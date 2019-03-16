# LC2KDebug
## (beta)
## A Javascript debugger for the LC2K ISA
[Demo](https://adishy.github.io/LC2KDebug)


![](screenshots/DebuggingView.png | width=250)

#
### How do I use this?

* First select all the assembly files (LC2K source code files)
* Reorder them to the original linked order in the top bar (drag on the filenames to reorder) if there are multiple source code files
* Select the final (linked) machine code file
* The debugger will start executing your code
* Control the debugger with the buttons at the bottom bar or using the keyboard shortcuts below
* Breakpoints can be added by clicking the required line
* The current values in the registers and memory can be viewed on the right
* The values on the stack can also be viewed on the right
* To increase the number of memory values visible on the stack, drag the slider towards the right (the number of memory values visible increases by a factor of 2 each time)
* Hover over any memory value or stack value to see its index in memory. (Index values for registers are displayed on the top left corner)
* Click on the titles for the register, memory or stack display to collapse/expand
#
### Keyboard shorcuts
| Action  | Keyboard Shortcut |
| ------------- | ------------- |
| Continue  | C  |
| Step Over  | S  |
| Restart  | R  |
| Remove all breakpoints  | D  |
#
### Tests
* A spec example with multiple source code files and a final linked machine code file is available in the tests directory of this repository

