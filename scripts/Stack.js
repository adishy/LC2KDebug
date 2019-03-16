var Stack = {
    StackElementClass: ".Stack",

    StackSizeSelectorContainerClass: ".StackDisplaySliderBox",

    StackSizeSelectorElementClass: ".StackDisplaySlider",

    StackElement: null,

    StackSizeSelectorContainerElement: null,

    StackSizeSelectorElement: null,

    StackValues: null,

    StackStart: 0,
    
    StackLength: 5,

    UpdateElement: function(){
        this.StackElement.innerHTML = "";

        var StackValues = this.StackValues;

        var StackStart = this.StackStart;

        var StackLength = this.StackLength;

        for(var i = StackStart; i < (StackStart + StackLength); ++i){
            var MemoryValueElement = document.createElement('div');
            MemoryValueElement.classList.add("MemoryValue");
            MemoryValueElement.setAttribute("title", `Stack Index: ${i - StackStart}, Memory Index: ${i}`);
            var MemoryValueElementText = document.createElement('p');
            MemoryValueElementText.appendChild(document.createTextNode(StackValues[i]));
            MemoryValueElement.appendChild(MemoryValueElementText);
            this.StackElement.appendChild(MemoryValueElement);
        }
    },
    
    UpdateValues: function(_Simulation){
        this.StackLength = parseInt(Math.pow(2, parseInt(this.StackSizeSelectorElement.value)));
        this.UpdateElement();
    },

    InitializeStackDisplay: function(_Simulation){
        this.StackElement = document.querySelector(this.StackElementClass);
        this.StackSizeSelectorContainerElement = document.querySelector(this.StackSizeSelectorContainerClass);
        this.StackSizeSelectorElement = document.querySelector(this.StackSizeSelectorElementClass);
        this.StackStart = _Simulation.MemoryIndex;
        this.StackValues = _Simulation.Memory;
        this.StackLength = parseInt(Math.pow(2, parseInt(this.StackSizeSelectorElement.value)));
    }
};