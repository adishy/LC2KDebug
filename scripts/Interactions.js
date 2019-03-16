var InteractionsDEBUG = false;

var AssemblyFileDisplayClass = AssemblyFile.AssemblyFileElementClass;
var StackSizeSelectorClass = Stack.StackSizeSelectorElementClass;
var AssemblyFileTitleClass = ".Filenames";
var AssemblyFileInputClass = ".AssemblyFileButton";
var InputFileClass = ".MachineCodeFileButton";
var StepOverClass = ".StepOverButton";
var ContinueClass = ".ContinueButton";
var RestartClass = ".RestartButton";
var RegistersTitleClass = ".RegistersTitle";
var MemoryTitleClass = ".MemoryTitle";
var StackTitleClass = ".StackTitle";
var MachineCodeFilenameDisplayClass = ".MachineCodeFilename";

var AssemblyFileDisplay = document.querySelector(AssemblyFileDisplayClass);
var StackSizeSelector = document.querySelector(StackSizeSelectorClass);
var AssemblyFileTitle = document.querySelector(AssemblyFileTitleClass);
var AssemblyFileInput = document.querySelector(AssemblyFileInputClass);
var InputFile = document.querySelector(InputFileClass);
var StepOver = document.querySelector(StepOverClass);
var Continue = document.querySelector(ContinueClass);
var Restart = document.querySelector(RestartClass);
var RegistersTitle = document.querySelector(RegistersTitleClass);
var MemoryTitle = document.querySelector(MemoryTitleClass);
var StackTitle = document.querySelector(StackTitleClass);
var MachineCodeFilenameDisplay = document.querySelector(MachineCodeFilenameDisplayClass);

RegistersTitle.Display = true;
MemoryTitle.Display = false;
StackTitle.Display = true;

var Simulation = null;
var LoadedMachineCode = false;
var LoadedAssemblyFiles = false;
var OutputText = new Output();
var MachineCodeFile = null;

function DisableButtons(_AssemblyFileInput, 
                        _MachineCodeFileInput, 
                        _ContinueButton, 
                        _StepOverButton, 
                        _RestartButton){
    if(!_AssemblyFileInput) AssemblyFileInput.classList.add("DisabledButton");

    else AssemblyFileInput.classList.remove("DisabledButton");

    if(!_MachineCodeFileInput) InputFile.classList.add("DisabledButton");

    else InputFile.classList.remove("DisabledButton");

    if(!_StepOverButton) StepOver.classList.add("DisabledButton");

    else StepOver.classList.remove("DisabledButton");

    if(!_ContinueButton) Continue.classList.add("DisabledButton");

    else Continue.classList.remove("DisabledButton");

    if(!_RestartButton) Restart.classList.add("DisabledButton");

    else Restart.classList.remove("DisabledButton");
}

function ToggleBreakpoint(_LineNumber){
    Breakpoints.ToggleBreakpoints(_LineNumber);
}

function AssemblyFilesEmpty(){
    DisableButtons(true, true, false, false, false);
    LoadedAssemblyFiles = false;
}

function ReorderedAssemblyFile(_OldIndex, _NewIndex){
    AssemblyFile.ReorderFiles(_OldIndex, _NewIndex);

    if(LoadedAssemblyFiles && LoadedMachineCode){
        if(InteractionsDEBUG) console.log("Clicked Restart button");
        var Click = document.createEvent("Events");
        Click.initEvent("click", true, false);
        Restart.dispatchEvent(Click);
    }
  }

  function RemoveAssemblyFile(_Index){
    if(InteractionsDEBUG) console.log("Removed Assembly File");

    AssemblyFile.RemoveFile(_Index);

    if(LoadedMachineCode){
        if(AssemblyFile.GetCombinedFile() != MachineCodeFile.length){
            DisableButtons(true, true, false, false, false);
            LoadedAssemblyFiles = false;
        }
    }
  }

Registers.InitializeRegisterDisplay();

Memory.InitializeMemoryDisplay();

FileOrganizer.InitializeFileOrganizer(ReorderedAssemblyFile);

AssemblyFileInput.addEventListener("click", 
                                   function(){
                                        SelectAndReadFile(function(_File, _Filename){
                                                            AssemblyFile.InitializeAssemblyFileDisplay(_File, ToggleBreakpoint);
                                                            FileOrganizer.AddFile(_Filename, RemoveAssemblyFile, AssemblyFilesEmpty);
                                                            LoadedAssemblyFiles = true;
                                                            if(LoadedMachineCode) DisableButtons(true, true, true, true, true);
                                                            
                                                            else DisableButtons(true, true, false, false ,false);
                                                          }, 
                                                          true);
                                   });

InputFile.addEventListener("click", function(){
    if(LoadedAssemblyFiles){
        SelectAndReadFile(function(_File, _Filename){
            if(InteractionsDEBUG) console.log(_File);
            try{
                Simulation = GetMachineCode(_File, AssemblyFile.CombinedFileLength());
                MachineCodeFile = _File;
                LoadedMachineCode = true;
                AssemblyFile.UpdateValues(Simulation);
                Stack.InitializeStackDisplay(Simulation);
                Registers.UpdateValues(Simulation);
                Memory.UpdateValues(Simulation);
                Stack.UpdateValues(Simulation);
                MachineCodeFilenameDisplay.textContent = _Filename;
                DisableButtons(true, true, true, true ,true);
            }
            catch(_Error){
                console.error("Error: Machine code file invalid");
                console.error(_Error);
                return;
            }
        });
    }
});

StepOver.addEventListener("click", function(){
    if(LoadedAssemblyFiles && LoadedMachineCode){
        var State = ExecuteInstruction(Simulation, OutputText);
    
        AssemblyFile.UpdateValues(Simulation);

        Registers.UpdateValues(Simulation);

        Memory.UpdateValues(Simulation);

        Stack.UpdateValues(Simulation);

        if(State == HALTED) 
            if(InteractionsDEBUG) console.log(OutputText.GetOutputString());
    }
});

Continue.Clicks = 0;

Continue.addEventListener("click", function(){
    if(LoadedAssemblyFiles && LoadedMachineCode){
        ++Continue.Clicks;
        
        while(!Breakpoints.IsBreakpoint(Simulation.PC, Continue.Clicks) && !ExecuteInstruction.Halted){
            ExecuteInstruction(Simulation, OutputText);
        }

        AssemblyFile.UpdateValues(Simulation);

        Registers.UpdateValues(Simulation);

        Memory.UpdateValues(Simulation);

        Stack.UpdateValues(Simulation);
        
        Breakpoints.CurrentStopped = Simulation.PC;
    }
});

Restart.addEventListener("click", function(){
    if(InteractionsDEBUG) console.log("Restart button");

    if(LoadedAssemblyFiles && LoadedMachineCode){
        Simulation = GetMachineCode(MachineCodeFile, AssemblyFile.CombinedFileLength());

        ExecuteInstruction.Halted = false;

        AssemblyFile.UpdateValues(Simulation);

        Breakpoints.CurrentStopped = -1;

        Registers.UpdateValues(Simulation);
        
        Memory.UpdateValues(Simulation);

        Stack.InitializeStackDisplay(Simulation);

        Stack.UpdateValues(Simulation);
    }
});

RegistersTitle.addEventListener("click", function(){
    if(RegistersTitle.Display){
        Registers.RegisterElement.style.display = "none";
        RegistersTitle.Display = false;
        document.querySelector(".RegistersDisplay").style.height = "25px";
    }

    else{
        Registers.RegisterElement.style.display = "grid";
        RegistersTitle.Display = true;
        document.querySelector(".RegistersDisplay").style.height = "140px";
    }
});

MemoryTitle.addEventListener("click", function(){
    if(MemoryTitle.Display){
        Memory.MemoryElement.style.display = "none";
        MemoryTitle.Display = false;
    }

    else{
        Memory.MemoryElement.style.display = "grid";
        MemoryTitle.Display = true;
    }
});

StackTitle.addEventListener("click", function(){
    if(StackTitle.Display){
        Stack.StackElement.style.display = "none";
        Stack.StackSizeSelectorContainerElement.style.display = "none";
        StackTitle.Display = false;
    }

    else{
        Stack.StackElement.style.display = "grid";
        Stack.StackSizeSelectorContainerElement.style.display = "flex";
        StackTitle.Display = true;
    }
});

StackSizeSelector.addEventListener("change", function(){
    Stack.UpdateValues(Simulation);
});


document.addEventListener("keyup", function(_Event){
    /**
     * C: 67 (Continue)
     * D: 68 (Delete all breakpoints)
     * S: 83 (Step over)
     * R: 82 (Restart)
     * **/

    var ContinueKey = 67;
    var RemoveBreakpointsKey = 68;
    var RestartKey = 82;
    var StepOverKey = 83;

    if(_Event.keyCode == RemoveBreakpointsKey 
        && LoadedAssemblyFiles && LoadedMachineCode){
        Breakpoints.ResetAllBreakpoints();
        AssemblyFile.DisplayAssemblyFile();
        AssemblyFile.UpdateValues(Simulation);
    }

    if(_Event.keyCode == ContinueKey 
        && LoadedAssemblyFiles && LoadedMachineCode){
            var Click = document.createEvent("Events");
            Click.initEvent("click", true, false);
            Continue.dispatchEvent(Click);
    }

    if(_Event.keyCode == StepOverKey 
        && LoadedAssemblyFiles && LoadedMachineCode){
            var Click = document.createEvent("Events");
            Click.initEvent("click", true, false);
            StepOver.dispatchEvent(Click);
    }

    if(_Event.keyCode == RestartKey
        && LoadedAssemblyFiles && LoadedMachineCode){
            var Click = document.createEvent("Events");
            Click.initEvent("click", true, false);
            Restart.dispatchEvent(Click);
    }
});