var Registers = {
    RegisterElementClass: ".Registers",

    RegisterElement: null,

    RegisterValues: new Int32Array(NUMREGS),

    RegisterValueDisplay: [],

    UpdateElement: function(){
        for(var i = 0; i < this.RegisterValues.length; ++i)
            this.RegisterValueDisplay[i].innerHTML = this.RegisterValues[i];
    },

    UpdateValues: function(_Simulation){
        this.RegisterValues = _Simulation.Registers;
        this.UpdateElement();
    },

    InitializeRegisterDisplay: function(){
        this.RegisterElement = document.querySelector(this.RegisterElementClass);
        for(var i = 0; i < this.RegisterElement.children.length; ++i)
            this.RegisterValueDisplay.push(this.RegisterElement.children[i].children[1]);
            
        for(var i = 0; i < this.RegisterValueDisplay.length; ++i)
            this.RegisterValueDisplay[i].innerHTML = 0;
    }
};