const ADD = "add";
const NOR = "nor";
const LOAD = "lw";
const STORE = "sw";
const COMPARE = "beq";
const BRANCH = "jalr";
const HALT = "halt";
const NOOP = "noop";
const DIRECTIVE = ".fill";

const ADD_OPCODE = 0;
const NOR_OPCODE = 1;
const LOAD_OPCODE = 2;
const STORE_OPCODE = 3;
const COMPARE_OPCODE = 4;
const BRANCH_OPCODE = 5;
const HALT_OPCODE = 6;
const NOOP_OPCODE = 7;

const TOTAL_WORDS = 65536;

const NUMMEMORY = 65536;
const NUMREGS = 8;
const MAXLINELENGTH = 1000

const INSTRUCTION_BITS = 29360128;
const REGISTERA_BITS = 3670016;
const REGISTERB_BITS = 458752;
const DESTINATION_REGISTER_BITS = 7;
const OFFSET_BITS = 65535;

const HALTED = false;