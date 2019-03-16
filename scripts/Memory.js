var Memory = {
    MemoryElementClass: ".Memory",

    MemoryElement: null,

    MemoryValues: null,

    MemoryLength: 0,

    UpdateElement: function(){
        this.MemoryElement.innerHTML = "";

        var MemoryValues = this.MemoryValues;

        for(var i = 0; i < this.MemoryLength; ++i){
            var MemoryValueElement = document.createElement('div');
            MemoryValueElement.classList.add("MemoryValue");
            MemoryValueElement.setAttribute("title", `Memory Index: ${i}`);
            var MemoryValueElementText = document.createElement('p');
            MemoryValueElementText.appendChild(document.createTextNode(MemoryValues[i]));
            MemoryValueElement.appendChild(MemoryValueElementText);
            this.MemoryElement.appendChild(MemoryValueElement);
        }
    },
    
    UpdateValues: function(_Simulation){
        this.MemoryValues = _Simulation.Memory;
        this.MemoryLength = _Simulation.MemoryIndex;
        this.UpdateElement();
    },

    InitializeMemoryDisplay: function(){
        this.MemoryElement = document.querySelector(this.MemoryElementClass);
    }
};