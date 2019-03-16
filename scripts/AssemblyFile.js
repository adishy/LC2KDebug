var AssemblyFileDEBUG = true;

var AssemblyFile = {
    AssemblyFileElementClass: ".FileDisplay",

    AssemblyFileElement: null,

    InstructionsText: [],

    DataText: [],

    BreakpointsCallback: null,

    PCValue: 0,

    GetCombinedFile: function(){
        var CombinedFile = [];

        this.InstructionsText.forEach(function(_Element){
            _Element.forEach(function(_Instruction){
                CombinedFile.push(_Instruction);
            });
        });

        this.DataText.forEach(function(_Element){
            _Element.forEach(function(_Data){
                CombinedFile.push(_Data);
            });
        });

        return CombinedFile;
    },

    DisplayAssemblyFile: function(){
        var AssemblyFileElement = this.AssemblyFileElement;

        var BreakpointsCallback = this.BreakpointsCallback;

        AssemblyFileElement.innerHTML = "";

        var CombinedFile = this.GetCombinedFile();

        var LineNumber = 0;

        CombinedFile.forEach(function(_Element){
            var HighlightedLine = SyntaxHighlighter.GetHighlightedLine(_Element, 
                                                                       LineNumber, 
                                                                       CombinedFile.length, 
                                                                       BreakpointsCallback);
            AssemblyFileElement.appendChild(HighlightedLine);
            ++LineNumber;
        });
    },

    UpdateValues: function(_Simulation){
        var OldLine = this.AssemblyFileElement.children[this.PCValue];
        
        if(OldLine.classList.contains("highlight"))
            OldLine.classList.remove("highlight");

        this.PCValue = _Simulation.PC;

        var NewLine = this.AssemblyFileElement.children[this.PCValue];

        NewLine.classList.add("highlight");

        NewLine.scrollIntoView({behavior: "smooth", 
                                block: "center" });
    },

    ReorderFiles: function(_OldIndex, _NewIndex){
        if(AssemblyFileDEBUG) console.log(this);
        var InstructionsText = this.InstructionsText;
        var DataText = this.DataText;

        var OldValue = InstructionsText[_OldIndex];
        InstructionsText[_OldIndex] = InstructionsText[_NewIndex];
        InstructionsText[_NewIndex] = OldValue;

        OldValue = DataText[_OldIndex];
        DataText[_OldIndex] = DataText[_NewIndex];
        DataText[_NewIndex] = OldValue;

        this.DisplayAssemblyFile();
    },

    RemoveFile: function(_Index){
        this.InstructionsText.splice(_Index, 1);
        this.DataText.splice(_Index, 1);
        this.DisplayAssemblyFile();
    },

    CombinedFileLength: function(){
        var Size = 0;

        this.InstructionsText.forEach(function(_Element){
            Size += _Element.length;
        });

        this.DataText.forEach(function(_Element){
            Size += _Element.length;
        });

        if(AssemblyFileDEBUG) console.log(Size);

        return Size;
    },

    InitializeAssemblyFileDisplay: function(_File, _BreakpointsCallback = null){
        if(this.AssemblyFileElement == null)
            this.AssemblyFileElement = document.querySelector(this.AssemblyFileElementClass);
        
        if(typeof _BreakpointsCallback == "function")
            this.BreakpointsCallback = _BreakpointsCallback;

        var Instructions = _File.split('\n');

        for(var i = 0; i < Instructions.length; ++i)
            if(!Instructions.length) Instructions.splice(i, 1);

        var DataStartIndex = -1;

        for(var i = 0; i < Instructions.length; ++i){
            var Line = Instructions[i].replace("\t", " ").replace("	", " ").split(" ");

            var Values = [];

            for(var j = 0; j < Line.length; ++j)
                if(Line[j].length) Values.push(Line[j]);

            if(Values.length >= 2 && Values[0] == ".fill" || Values[1] == ".fill"){
                DataStartIndex = i;
                break;
            }
        }
            
        if(DataStartIndex == -1) DataStartIndex = Instructions.length;

        if(AssemblyFileDEBUG) console.log(DataStartIndex);

        this.InstructionsText.push(Instructions.slice(0, DataStartIndex));
        this.DataText.push(Instructions.slice(DataStartIndex, Instructions.length));

        var LastFileData = this.DataText[this.DataText.length - 1];
        var LastDataElement = LastFileData[LastFileData.length - 1];

        if(!LastDataElement.length) LastFileData.pop();

        this.DisplayAssemblyFile();
    }
};