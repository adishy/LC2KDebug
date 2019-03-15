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
var StartedDebugging = false;
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

// Breakpoints.AddBreakpoint(3);
// Breakpoints.AddBreakpoint(2);
// Breakpoints.AddBreakpoint(4);

Registers.InitializeRegisterDisplay();

Memory.InitializeMemoryDisplay();

FileOrganizer.InitializeFileOrganizer(function(_OldIndex, _NewIndex){
                                        if(!StartedDebugging) AssemblyFile.ReorderFiles(_OldIndex, _NewIndex);
                                      }, 
                                      function(){
                                            StepOver.classList.add("DisabledButton")
                                      });

AssemblyFileInput.addEventListener("click", 
                                   function(){
                                        SelectAndReadFile(function(_File, _Filename){
                                                            AssemblyFile.InitializeAssemblyFileDisplay(_File, ToggleBreakpoint);
                                                            FileOrganizer.AddFile(_Filename, AssemblyFile.RemoveFile);
                                                            LoadedAssemblyFiles = true;
                                                            DisableButtons(true, true, false, false ,false);
                                                          }, 
                                                          true);
                                   });

InputFile.addEventListener("click", function(){
    if(LoadedAssemblyFiles){
        SelectAndReadFile(function(_File, _Filename){
            console.log(_File);
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
        if(!StartedDebugging) StartedDebugging = true;

        var State = ExecuteInstruction(Simulation, OutputText);
    
        AssemblyFile.UpdateValues(Simulation);

        Registers.UpdateValues(Simulation);

        Memory.UpdateValues(Simulation);

        Stack.UpdateValues(Simulation);

        if(State == HALTED) console.log(OutputText.GetOutputString());
    }
});

Continue.Clicks = 0;

Continue.addEventListener("click", function(){
    if(LoadedAssemblyFiles && LoadedMachineCode){
        ++Continue.Clicks;
        // Breakpoints.ResetVisitedBreakpoints();
        
        while(!Breakpoints.IsBreakpoint(Simulation.PC, Continue.Clicks) && !ExecuteInstruction.Halted){
            ExecuteInstruction(Simulation, OutputText);
        }

        AssemblyFile.UpdateValues(Simulation);

        Registers.UpdateValues(Simulation);

        Memory.UpdateValues(Simulation);

        Stack.UpdateValues(Simulation);
        
        // Breakpoints.AddVisitedBreakpoint(Simulation.PC);
        // Breakpoints.VisitedCurrentBreakpoint = true;
        Breakpoints.CurrentStopped = Simulation.PC;
    }
});

Restart.addEventListener("click", function(){
    if(LoadedAssemblyFiles && LoadedMachineCode){
        StartedDebugging = false;

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

Restart.addEventListener("dblclick", function(){
    if(LoadedAssemblyFiles && LoadedMachineCode){
        Breakpoints.ResetAllBreakpoints();
        Breakpoints.ResetVisitedBreakpoints();
        AssemblyFile.DisplayAssemblyFile();
        AssemblyFile.UpdateValues(Simulation);
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
