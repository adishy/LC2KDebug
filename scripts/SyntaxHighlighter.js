var SyntaxHighlighter = {
    IsInstruction: function(_Value){
        var Instructions = ["add", "nor", "lw", "sw", "beq", "noop", "halt"];

        return Instructions.includes(_Value);
    },

    MatchInstructionValues: function(_Line, _Regex){

    },

    GetHighlightedElement: function(_CurrentLineNumber, 
                                    _TotalLineLength,
                                    _Label, 
                                    _Instruction, 
                                    _RegisterA, 
                                    _RegisterB, 
                                    _RegisterC, 
                                    _Comments,
                                    _BreakpointsCallback){
        var CurrentLineNumber = _CurrentLineNumber;

        var HighlightedLineElement = document.createElement("p");
        HighlightedLineElement.classList.add("Line");

        var LineNumberElement = document.createElement("span");
        LineNumberElement.classList.add("LineNumber");

        _TotalLineLength= _TotalLineLength.toString();
        _CurrentLineNumber  = _CurrentLineNumber.toString();

        for(var i = _CurrentLineNumber.length; i < _TotalLineLength.length; ++i)
            _CurrentLineNumber += '\u00A0';

        LineNumberElement.appendChild(document.createTextNode(_CurrentLineNumber + "  "));
        
        var LabelElement = document.createElement("span");
        
        if(_Label != null && _Label.length){
            if(_Label[0] >= 'A' && _Label[0] <= 'Z') LabelElement.classList.add("GlobalLabel");

            else LabelElement.classList.add("LocalLabel");
        
            for(var i = _Label.length; i < 6; ++i) _Label += '\u00A0';

            LabelElement.appendChild(document.createTextNode(_Label + "  "));
        }

        else LabelElement.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"));

        var InstructionElement = document.createElement("span");
        InstructionElement.classList.add("Instruction");

        for(var i = _Instruction.length; i < 5; ++i) _Instruction += '\u00A0';

        InstructionElement.appendChild(document.createTextNode(_Instruction  + "  "));

        var RegisterAElement = document.createElement("span");
        RegisterAElement.classList.add("InstructionArgument");

        if(_RegisterA != null && _RegisterA.length)
            RegisterAElement.appendChild(document.createTextNode(_RegisterA + "\u00A0\u00A0"));

        var RegisterBElement = document.createElement("span");
        RegisterBElement.classList.add("InstructionArgument");

        if(_RegisterB != null && _RegisterB.length){
            if(_Instruction.trimRight() == "jalr")
                for(var i = 0; i < 7; ++i) _RegisterB += '\u00A0';

            RegisterBElement.appendChild(document.createTextNode(_RegisterB + "\u00A0\u00A0"));
        }

        var RegisterCElement = document.createElement("span");

        if(_RegisterC != null && _RegisterC.length){
            var Value = parseInt(_RegisterC);

            if(Number.isNaN(Value)){
                if(_RegisterC[0] >= 'A' && _RegisterC[0] <= 'Z') RegisterCElement.classList.add("GlobalLabel");

                else RegisterCElement.classList.add("LocalLabel");
            }

            else RegisterCElement.classList.add("InstructionArgument");

            for(var i = _RegisterC.length; i < 6; ++i) _RegisterC += '\u00A0';

            RegisterCElement.appendChild(document.createTextNode(_RegisterC + "  "));
        }

        var CommentsElement = document.createElement("span");
        CommentsElement.classList.add("Comments");

        if(_Comments != null && _Comments.length) CommentsElement.appendChild(document.createTextNode(_Comments + "  "));

        HighlightedLineElement.appendChild(LineNumberElement);
        HighlightedLineElement.appendChild(LabelElement);
        HighlightedLineElement.appendChild(InstructionElement);
        HighlightedLineElement.appendChild(RegisterAElement);
        HighlightedLineElement.appendChild(RegisterBElement);
        HighlightedLineElement.appendChild(RegisterCElement);
        HighlightedLineElement.appendChild(CommentsElement);

        if(typeof _BreakpointsCallback == "function"){
            HighlightedLineElement.addEventListener("click", function(){
                                                        if(HighlightedLineElement.classList.contains("breakpoint"))
                                                            HighlightedLineElement.classList.remove("breakpoint");

                                                        else HighlightedLineElement.classList.add("breakpoint");
                                                        
                                                        _BreakpointsCallback(CurrentLineNumber);
                                                    });
        }

        return HighlightedLineElement;
    },

    RIInstructionType: function(_Value, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback){
        var SplitRIInstruction = /^([^\s]*)\s+(add|nor|nand|lw|sw|beq)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)(\s+)?(.*)?/g;

        var Label = "$1";
        var Instruction = "$2";
        var RegisterA = "$3";
        var RegisterB = "$4";
        var RegisterC = "$5";
        var Comments = "$7";

        Label = _Value.replace(SplitRIInstruction, Label);
        Instruction = _Value.replace(SplitRIInstruction, Instruction);
        RegisterA = _Value.replace(SplitRIInstruction, RegisterA);
        RegisterB = _Value.replace(SplitRIInstruction, RegisterB);
        RegisterC = _Value.replace(SplitRIInstruction, RegisterC);
        Comments = _Value.replace(SplitRIInstruction, Comments);

        return this.GetHighlightedElement(_CurrentLineNumber, 
                                          _TotalLineLength,
                                          Label, 
                                          Instruction, 
                                          RegisterA, 
                                          RegisterB, 
                                          RegisterC, 
                                          Comments,
                                          _BreakpointsCallback);
    },

    JInstructionType: function(_Value, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback){
        var SplitJInstruction = /^([^\s]*)\s+(jalr)\s+([^\s]+)\s+([^\s]+)(\s+)?(.*)?/g;

        var Label = "$1";
        var Instruction = "$2";
        var RegisterA = "$3";
        var RegisterB = "$4";
        var Comments = "$6";

        Label = _Value.replace(SplitJInstruction, Label);
        Instruction = _Value.replace(SplitJInstruction, Instruction);
        RegisterA = _Value.replace(SplitJInstruction, RegisterA);
        RegisterB = _Value.replace(SplitJInstruction, RegisterB);
        Comments = _Value.replace(SplitJInstruction, Comments);

        return this.GetHighlightedElement(_CurrentLineNumber, 
                                          _TotalLineLength,
                                          Label, 
                                          Instruction, 
                                          RegisterA, 
                                          RegisterB, 
                                          null, 
                                          Comments,
                                          _BreakpointsCallback);
    },

    Directive: function(_Value, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback){
        var SplitDirective = /^([^\s]*)\s+(\.fill)\s+([^\s]+)(\s+)?(.*)?/g;

        var Label = "$1";
        var Instruction = "$2";
        var RegisterA = "$3";
        var Comments = "$5";

        Label = _Value.replace(SplitDirective, Label);
        Instruction = _Value.replace(SplitDirective, Instruction);
        RegisterA = _Value.replace(SplitDirective, RegisterA);
        Comments = _Value.replace(SplitDirective, Comments);

        return this.GetHighlightedElement(_CurrentLineNumber, 
                                          _TotalLineLength,
                                          Label, 
                                          Instruction, 
                                          RegisterA, 
                                          null, 
                                          null, 
                                          Comments,
                                          _BreakpointsCallback);
    },

    OInstructionType: function(_Value, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback){
        var SplitOInstruction =  /^([^\s]*)\s+(halt|noop)(\s+)?(.*)?/g;

        var Label = "$1";
        var Instruction = "$2";
        var Comments = "$4";

        Label = _Value.replace(SplitOInstruction, Label);
        Instruction = _Value.replace(SplitOInstruction, Instruction);
        Comments = _Value.replace(SplitOInstruction, Comments);

        return this.GetHighlightedElement(_CurrentLineNumber, 
                                          _TotalLineLength,
                                          Label, 
                                          Instruction, 
                                          null, 
                                          null, 
                                          null, 
                                          Comments,
                                          _BreakpointsCallback);
    },

    IsNumericalArgument: function(_Value){
        var IntegerValue = parseInt(_Value);

        return !Number.isNaN(IntegerValue);
    },

    GetHighlightedLine: function(_Line, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback){
        var SplitOpcode = /(?:[^\s]*\s+)(add|nor|nand|lw|sw|beq|jalr|noop|halt|\.fill)(?:.*)/g;

        var Opcode = _Line.replace(SplitOpcode, "$1");
    
        switch(Opcode){
            case "add":
            case "nor":
            case "lw":
            case "sw":
            case "beq":
                return this.RIInstructionType(_Line, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback);
            break;
    
            case "jalr":
            return this.JInstructionType(_Line, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback);
            break;
    
            case ".fill":
                return this.Directive(_Line, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback);
            break;
    
            case "noop":
            case "halt":
                return this.OInstructionType(_Line, _CurrentLineNumber, _TotalLineLength, _BreakpointsCallback);
            break;
    
            default:
                throw "Unknown instruction type";
        }
    }
};