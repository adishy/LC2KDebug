/** 
 * Author: Aditya Manjusha Shylesh
 * ReadFile.js
 * Functions for creating file dialog, reading file
 **/
/******************************************************************************/
/******************************************************************************/
/*Print console debug statements */
var ReadFileDEBUG = false;

/******************************************************************************/
/******************************************************************************/
function SelectAndReadFile(_Callback, _Multiple = false){
    var HiddenFileInputElement = document.createElement('input');
    HiddenFileInputElement.type = "file";

    if(_Multiple) HiddenFileInputElement.setAttribute("multiple", "");
    
    HiddenFileInputElement.onchange = function(_Event){
                                        var FileSelected = _Event.target.files[0];
                                        for(var i = 0; i < _Event.target.files.length; ++i){
                                                if(ReadFileDEBUG) console.log(FileSelected);
                                                ReadFile(_Event.target.files[i], _Callback);
                                        }
                                      };
    HiddenFileInputElement.click();
}
/******************************************************************************/
/******************************************************************************/

/******************************************************************************/
/******************************************************************************/
function ReadFile(_FileSelected, _Callback){
    if(ReadFileDEBUG){
        console.log("Reading file", _FileSelected);
        console.log(_Callback);
    }

    var Reader = new FileReader();  

    Reader.onload = function(){
        if(typeof _Callback == "function") _Callback(Reader.result, _FileSelected.name);
    }

    Reader.readAsText(_FileSelected);
}

/******************************************************************************/
/******************************************************************************/