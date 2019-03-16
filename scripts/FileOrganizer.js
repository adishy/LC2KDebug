var FileOrganizerDEBUG = true;

var FileOrganizer = {
    FileOrganizerElementClass: ".FilenamesList",

    FileOrganizerElement: null,

    SortFileOrder: null,

    AddFile: function(_Filename, _RemoveFileCallback, _EmptyCallback){
        var RemoveFile = this.RemoveFile;

        var FilenameElement = document.createElement("li");
        FilenameElement.classList.add("FilenameElement");
        
        var FilenameText = document.createElement("p");
        FilenameText.classList.add("Filename");
        FilenameText.appendChild(document.createTextNode(_Filename));

        var RemoveButton = document.createElement("i");
        RemoveButton.classList.add("fas");
        RemoveButton.classList.add("fa-times");
        RemoveButton.classList.add("RemoveFileButton");

        var Self = this;

        RemoveButton.addEventListener("click", 
                                      function(_Event){
                                        RemoveFile(Self, _Event, _RemoveFileCallback, _EmptyCallback);
                                      });

        FilenameElement.appendChild(FilenameText);
        FilenameElement.appendChild(RemoveButton);

        this.FileOrganizerElement.appendChild(FilenameElement);
    },

    RemoveFile: function(_Self, _Event, _Callback, _EmptyCallback){
        if(FileOrganizerDEBUG){
            console.log(_Event);
            console.log(_Event.target);
            console.log(_Event.target.parentElement);
            console.log(_Event.target.parentElement.parentElement);
        }

        var Index = -1;

        var FilenamesList = _Self.FileOrganizerElement;

        if(FileOrganizerDEBUG) console.log(_Self);

        for(var i = 0; i < FilenamesList.children.length; ++i)
            if(FilenamesList.children[i] == _Event.target.parentElement){
                Index = i;
                break;
            }

        if(Index == -1)
            throw "Unable to find FilenameElement in the current list of FilenameElements"

        FilenamesList.removeChild(_Event.target.parentElement);

        if(typeof _Callback == "function") _Callback(Index);

        if(FileOrganizerDEBUG){
            console.log(FilenamesList.children);
            console.log(_EmptyCallback);
        }

        if(typeof _EmptyCallback == "function" && !FilenamesList.children.length) _EmptyCallback();
    },

    InitializeFileOrganizer: function(_Callback){
        this.FileOrganizerElement = document.querySelector(this.FileOrganizerElementClass);
        
        this.SortFileOrder = Sortable.create(this.FileOrganizerElement, 
                                             {
                                                animation: 150,
                                                easing: "cubic-bezier(1, 0, 0, 1)",
                                                onEnd: function(_Event){
                                                            if(FileOrganizerDEBUG) console.log(_Event);
                                                            _Callback(_Event.oldIndex, _Event.newIndex);
                                                        }
                                             });
    }
};