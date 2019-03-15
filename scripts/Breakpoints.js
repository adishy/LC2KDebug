var Breakpoints = {
    BreakpointList: [],

    CurrentStopped: -1,

    IsBreakpoint: function (_LineNumber) {
        var CurrentLine = _LineNumber == this.CurrentStopped;

        if(CurrentLine) this.CurrentStopped = -1;

        return this.BreakpointList.includes(_LineNumber) && !CurrentLine;
    },

    AddBreakpoint: function (_LineNumber) {
        this.BreakpointList.push(_LineNumber);
    },

    RemoveBreakpoint: function (_LineNumber) {
        if (this.BreakpointList.includes(_LineNumber)) {
            this.BreakpointList.splice(this.BreakpointList.indexOf(_LineNumber), 1);
        }
    },

    ToggleBreakpoints: function(_LineNumber){
        console.log(this);

        if(this.BreakpointList.includes(_LineNumber)) this.RemoveBreakpoint(_LineNumber);

        else this.AddBreakpoint(_LineNumber);
    },

    ResetAllBreakpoints: function () {
        this.BreakpointList = [];
        this.VisitedBreakpoints = [];
    }
}