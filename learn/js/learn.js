"use strict";


/* =========================================================
   LEARNCS DATA
========================================================= */

const topics = {

    /* =====================================================
       LANGUAGES
    ====================================================== */

    cpp: {
        category: "Languages",
        categoryLabel: "Programming Language",
        title: "C++",
        summary: "Systems programming from representation and lifetime upward.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "C++ gives a program direct control over representation, lifetime, ownership, and performance. The useful way to learn it is to connect syntax to what objects occupy memory and when their resources exist.",
                    "The language is especially relevant to embedded software, systems programming, game engines, infrastructure, and performance-sensitive applications."
                ],
                cards: [
                    ["Representation", "Values / Objects"],
                    ["Aliasing", "Pointers / References"],
                    ["Lifetime", "Scope + Ownership"],
                    ["Cleanup", "RAII"]
                ]
            },

            {
                id: "memory",
                label: "Memory",
                type: "content",
                heading: "Values, References, Pointers, and Lifetime",
                paragraphs: [
                    "A value is an object with storage and a type. A reference is another name for an existing object. A pointer stores an address and can be redirected or null.",
                    "The critical question is not just where something lives, but whether the object is still alive when code tries to use it."
                ],
                bullets: [
                    "Automatic storage usually ends when the enclosing scope ends",
                    "Dynamic storage lasts until ownership releases it",
                    "A dangling pointer or reference outlives the object it refers to",
                    "Passing by const reference avoids a copy while preventing mutation",
                    "Object layout and alignment affect memory use and cache behavior"
                ]
            },

            {
                id: "ownership",
                label: "Ownership",
                type: "content",
                heading: "RAII and Resource Ownership",
                paragraphs: [
                    "RAII ties a resource to an object's lifetime. Construction acquires or initializes the resource; destruction releases it. This makes cleanup follow normal scope rules instead of being scattered through error paths.",
                    "The same idea applies to memory, files, locks, sockets, and hardware-facing resources."
                ],
                bullets: [
                    "Prefer values when an object can own its own state",
                    "Use std::unique_ptr for exclusive dynamic ownership",
                    "Use std::shared_ptr only when ownership is genuinely shared",
                    "Avoid raw new/delete in ordinary application code",
                    "Design APIs so ownership is visible from the type"
                ]
            },

            {
                id: "containers",
                label: "Containers",
                type: "content",
                heading: "Choose Containers from the Access Pattern",
                paragraphs: [
                    "The Standard Library gives useful defaults, but the right container depends on access, insertion, ordering, memory locality, and invalidation rules."
                ],
                bullets: [
                    "std::vector — contiguous storage, fast indexed access, strong cache locality",
                    "std::array — fixed-size contiguous storage owned directly by the object",
                    "std::unordered_map — average constant-time key lookup with hashing",
                    "std::map — ordered keys with logarithmic operations",
                    "std::deque — efficient growth at both ends without one contiguous allocation"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "Pass by Reference without Copying",
                paragraphs: [
                    "This function reads a vector without copying it. const expresses that the function does not modify the caller's container."
                ],
                language: "cpp",
                code:
`#include <vector>
#include <cstddef>

long sum(const std::vector<int>& values) {
    long total = 0;

    for (int value : values) {
        total += value;
    }

    return total;
}`
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "C++ Reference",
                        source: "cppreference.com",
                        url: "https://en.cppreference.com/w/"
                    },
                    {
                        name: "C++ Core Guidelines",
                        source: "isocpp.github.io",
                        url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines"
                    }
                ]
            }
        ]
    },


    python: {
        category: "Languages",
        categoryLabel: "Programming Language",
        title: "Python",
        summary: "Readable, high-level programming for rapid development.",
        difficulty: "Beginner",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Python is a high-level programming language known for readable syntax and a large software ecosystem.",
                    "It is commonly used for automation, web development, scripting, scientific computing, data analysis, artificial intelligence, and rapid prototyping."
                ],
                cards: [
                    ["Level", "High Level"],
                    ["Typing", "Dynamic"],
                    ["Execution", "Interpreted"],
                    ["Style", "Multi-paradigm"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Core Python Concepts",
                bullets: [
                    "Variables and dynamic typing",
                    "Lists, tuples, sets, and dictionaries",
                    "Conditionals and loops",
                    "Functions",
                    "Modules and packages",
                    "Classes and objects",
                    "Exceptions",
                    "File input and output"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "Input and Output",
                language: "python",
                code:
`name = input("What is your name? ")

print(f"Hello, {name}!")`
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Official Python Tutorial",
                        source: "python.org",
                        url: "https://docs.python.org/3/tutorial/"
                    }
                ]
            }
        ]
    },


    assembly: {
        category: "Languages",
        categoryLabel: "Programming Language",
        title: "Assembly",
        summary: "Low-level programming close to the processor.",
        difficulty: "Advanced",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Assembly language provides a human-readable representation of processor instructions.",
                    "Unlike a high-level language, assembly exposes registers, memory addresses, instructions, calling conventions, and architecture-specific behavior."
                ],
                cards: [
                    ["Level", "Low Level"],
                    ["Execution", "Machine Instructions"],
                    ["Memory", "Direct Access"],
                    ["Architecture", "CPU Specific"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Important Concepts",
                bullets: [
                    "CPU registers",
                    "Instructions and opcodes",
                    "Memory addressing",
                    "The stack",
                    "Function calls",
                    "Branches and jumps",
                    "Flags",
                    "Calling conventions"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "x86-64 Style Example",
                language: "assembly",
                code:
`section .text
global _start

_start:
    mov rax, 60
    mov rdi, 0
    syscall`
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "x86 Assembly",
                        source: "Wikibooks",
                        url: "https://en.wikibooks.org/wiki/X86_Assembly"
                    }
                ]
            }
        ]
    },


    rust: {
        category: "Languages",
        categoryLabel: "Programming Language",
        title: "Rust",
        summary: "Systems programming focused on safety and performance.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Rust is a compiled systems programming language focused on memory safety, concurrency, and performance.",
                    "Its ownership model allows many memory errors to be detected at compile time without requiring garbage collection."
                ],
                cards: [
                    ["Level", "Systems"],
                    ["Typing", "Static"],
                    ["Memory", "Ownership"],
                    ["Focus", "Safety + Performance"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Core Rust Concepts",
                bullets: [
                    "Ownership",
                    "Borrowing",
                    "References",
                    "Lifetimes",
                    "Pattern matching",
                    "Enums",
                    "Traits",
                    "Result and Option",
                    "Safe concurrency"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "Basic Rust Program",
                language: "rust",
                code:
`fn main() {
    let message = "Hello, LearnCS";
    println!("{}", message);
}`
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Learn Rust",
                        source: "rust-lang.org",
                        url: "https://www.rust-lang.org/learn"
                    }
                ]
            }
        ]
    },


    html: {
        category: "Languages",
        categoryLabel: "Markup Language",
        title: "HTML",
        summary: "The structural language of the web.",
        difficulty: "Beginner",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "HTML stands for HyperText Markup Language. It describes the structure and meaning of content on a webpage.",
                    "HTML is not a general-purpose programming language. It defines elements such as headings, paragraphs, links, forms, images, tables, and semantic page regions."
                ],
                cards: [
                    ["Type", "Markup"],
                    ["Purpose", "Structure"],
                    ["Platform", "Web"],
                    ["Works With", "CSS + JavaScript"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Core HTML Concepts",
                bullets: [
                    "Elements and tags",
                    "Attributes",
                    "Document structure",
                    "Semantic HTML",
                    "Links",
                    "Images",
                    "Forms",
                    "Accessibility"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "Semantic HTML",
                language: "html",
                code:
`<article>
    <h1>LearnCS</h1>

    <p>
        Computer science learning material.
    </p>
</article>`
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "HTML Introduction",
                        source: "W3Schools",
                        url: "https://www.w3schools.com/html/html_intro.asp"
                    }
                ]
            }
        ]
    },


    /* =====================================================
       COMPUTER SCIENCE
    ====================================================== */

    "data-structures": {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Data Structures",
        summary: "Choose a representation from the workload backward.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "A data structure is a representation chosen to make a set of operations efficient enough for a workload.",
                    "The useful question is not which structure is best in isolation. It is which costs matter for this program: lookup, insertion, deletion, ordering, memory overhead, locality, or preprocessing."
                ],
                cards: [
                    ["Access", "How is data read?"],
                    ["Mutation", "Where does data change?"],
                    ["Order", "Must order be preserved?"],
                    ["Locality", "How is memory laid out?"]
                ]
            },

            {
                id: "arrays-lists",
                label: "Arrays vs Lists",
                type: "content",
                heading: "Contiguous Storage versus Linked Nodes",
                paragraphs: [
                    "Arrays and vectors place elements contiguously, which gives O(1) indexed access and usually strong cache locality. Linked lists trade that locality for node-by-node insertion and removal when the position is already known.",
                    "Asymptotic complexity alone can hide real hardware costs. Pointer chasing can make a linked structure slower even when the Big-O expression looks competitive."
                ],
                bullets: [
                    "Array/vector lookup by index: O(1)",
                    "Insert in the middle of a vector: O(n) due to shifting",
                    "Linked-list access by position: O(n)",
                    "Linked-list insertion after a known node: O(1)",
                    "Contiguous memory often improves cache utilization"
                ]
            },

            {
                id: "lookup",
                label: "Lookup",
                type: "content",
                heading: "Hash Index versus Sorted Representation",
                paragraphs: [
                    "A hash table pays a build and memory cost to make repeated exact-match lookup fast on average. A sorted array pays sorting cost, then supports binary search in O(log n). Linear search needs no index but scans records repeatedly.",
                    "The Data Workbench benchmark makes this tradeoff visible by measuring preprocessing separately from lookup time."
                ],
                bullets: [
                    "Linear scan — no build cost, O(n) per lookup",
                    "Hash map — build O(n), average O(1) lookup",
                    "Sorted array — build dominated by sorting, O(log n) lookup",
                    "A one-off query may not justify building an index",
                    "Repeated queries can make preprocessing worthwhile"
                ]
            },

            {
                id: "priority",
                label: "Priority Queues",
                type: "content",
                heading: "Heaps for Repeated Minimum or Maximum Selection",
                paragraphs: [
                    "A binary heap is useful when a program repeatedly needs the smallest or largest item but does not need the entire collection fully sorted."
                ],
                bullets: [
                    "Peek at the highest-priority element: O(1)",
                    "Insert: O(log n)",
                    "Remove highest-priority element: O(log n)",
                    "Common uses include schedulers, graph algorithms, simulations, and event queues"
                ]
            },

            {
                id: "practice",
                label: "Practice",
                type: "content",
                heading: "Reason from Operations First",
                bullets: [
                    "Choose a structure for 100,000 repeated exact key lookups and justify preprocessing cost",
                    "Compare a vector and linked list while discussing cache locality, not only Big-O",
                    "Implement a binary heap and trace one insertion by hand",
                    "Explain when a sorted vector can beat a tree for mostly-read workloads",
                    "Measure linear, hash, and binary-search lookup on the same query set"
                ]
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Open Data Structures",
                        source: "opendatastructures.org",
                        url: "https://opendatastructures.org/"
                    }
                ]
            }
        ]
    },


    "computer-architecture": {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Computer Architecture",
        summary: "Follow instructions, state, and data through the machine.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Computer architecture connects software-visible instructions to the datapath, registers, memory system, and timing behavior that execute them.",
                    "A useful bottom-up model is to follow one instruction through fetch, decode, operand read, execution, memory access when needed, and write-back."
                ],
                cards: [
                    ["ISA", "Software / Hardware Contract"],
                    ["Datapath", "Moves + Transforms Data"],
                    ["Control", "Selects Operations"],
                    ["State", "Registers + Memory"]
                ]
            },

            {
                id: "instruction",
                label: "Instruction Path",
                type: "content",
                heading: "Trace One RISC-V ADD",
                paragraphs: [
                    "For add x5, x6, x7, the processor fetches the encoded instruction using the program counter, decodes the opcode and register fields, reads x6 and x7, routes them to the ALU, performs addition, and writes the result to x5.",
                    "The ISA describes what must happen. The microarchitecture decides how the hardware is organized to make it happen."
                ],
                bullets: [
                    "PC identifies the next instruction",
                    "Instruction memory returns encoded bits",
                    "Decode identifies opcode and register fields",
                    "Register file supplies source operands",
                    "ALU performs the selected operation",
                    "Write-back updates the destination register"
                ]
            },

            {
                id: "state",
                label: "Logic + State",
                type: "content",
                heading: "Combinational Logic versus Sequential State",
                paragraphs: [
                    "Combinational logic produces outputs from current inputs. Sequential elements retain state across clock edges. A processor is built by composing both."
                ],
                bullets: [
                    "Multiplexers select among candidate values",
                    "Adders and ALUs transform data combinationally",
                    "Registers capture values on clock events",
                    "The program counter is state",
                    "Finite-state machines combine stored state with next-state logic"
                ]
            },

            {
                id: "memory",
                label: "Memory",
                type: "content",
                heading: "Memory Hierarchy and Locality",
                paragraphs: [
                    "Fast storage is expensive and small; large storage is slower. Caches exploit temporal and spatial locality so the processor can often avoid waiting for main memory.",
                    "This is why data layout matters even when two algorithms have similar Big-O complexity."
                ],
                bullets: [
                    "Registers are closest to execution units",
                    "Caches hold recently or nearby used blocks",
                    "Main memory is larger but slower",
                    "Spatial locality favors contiguous access",
                    "Temporal locality favors reusing recently accessed data"
                ]
            },

            {
                id: "performance",
                label: "Performance",
                type: "content",
                heading: "Execution Time Has Multiple Terms",
                paragraphs: [
                    "A common first model is CPU time = instruction count × cycles per instruction × clock period. Improving one term can worsen another, so performance work requires measuring the complete system."
                ],
                bullets: [
                    "Instruction count depends on the program and ISA",
                    "CPI depends on pipeline behavior, hazards, caches, and implementation",
                    "Clock period depends on the critical path and design",
                    "Cache misses can dominate otherwise simple code",
                    "Throughput and latency are related but not identical"
                ]
            },

            {
                id: "example",
                label: "Example",
                type: "code",
                heading: "RISC-V Data Flow",
                paragraphs: [
                    "These instructions create a small dependency chain that can be traced through registers and the ALU."
                ],
                language: "riscv",
                code:
`addi x5, x0, 12
addi x6, x0, 30
add  x7, x5, x6`
            }
        ]
    },


    algorithms: {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Algorithms",
        summary: "Procedures for solving computational problems.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "An algorithm is a finite sequence of steps used to solve a problem or perform a computation.",
                    "Computer scientists analyze algorithms not only for correctness, but also for efficiency."
                ],
                cards: [
                    ["Search", "Finding Data"],
                    ["Sort", "Ordering Data"],
                    ["Traversal", "Exploring Structures"],
                    ["Analysis", "Time + Space"]
                ]
            },

            {
                id: "families",
                label: "Types",
                type: "content",
                heading: "Common Algorithm Families",
                bullets: [
                    "Searching",
                    "Sorting",
                    "Recursion",
                    "Divide and conquer",
                    "Greedy algorithms",
                    "Dynamic programming",
                    "Graph traversal",
                    "Backtracking"
                ]
            },

            {
                id: "analysis",
                label: "Analysis",
                type: "content",
                heading: "Algorithm Analysis",
                paragraphs: [
                    "Time complexity estimates how the running time grows as the input becomes larger.",
                    "Space complexity describes how much additional memory an algorithm requires."
                ]
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Algorithm",
                        source: "Wikipedia",
                        url: "https://en.wikipedia.org/wiki/Algorithm"
                    }
                ]
            }
        ]
    },


    "operating-systems": {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Operating Systems",
        summary: "Software that manages hardware and application resources.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "An operating system manages the computer's hardware and provides services used by application software.",
                    "It acts as an intermediary between programs and physical resources such as processors, memory, disks, and devices."
                ],
                cards: [
                    ["Execution", "Processes"],
                    ["CPU", "Scheduling"],
                    ["Memory", "Virtual Memory"],
                    ["Storage", "File Systems"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Core Operating System Concepts",
                bullets: [
                    "Processes",
                    "Threads",
                    "CPU scheduling",
                    "Virtual memory",
                    "Page tables",
                    "File systems",
                    "System calls",
                    "Permissions",
                    "Device drivers",
                    "Inter-process communication"
                ]
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Operating System",
                        source: "Wikipedia",
                        url: "https://en.wikipedia.org/wiki/Operating_system"
                    }
                ]
            }
        ]
    },


    networks: {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Networks",
        summary: "Communication between computers and connected devices.",
        difficulty: "Intermediate",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Computer networks allow devices to communicate and share data using standardized protocols.",
                    "Networks range from small local networks to the global infrastructure of the Internet."
                ],
                cards: [
                    ["Address", "IP"],
                    ["Transport", "TCP / UDP"],
                    ["Naming", "DNS"],
                    ["Web", "HTTP / HTTPS"]
                ]
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Core Networking Concepts",
                bullets: [
                    "IP addresses",
                    "Subnets",
                    "Routers",
                    "Switches",
                    "TCP",
                    "UDP",
                    "DNS",
                    "HTTP and HTTPS",
                    "Ports",
                    "Firewalls"
                ]
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Computer Network",
                        source: "Wikipedia",
                        url: "https://en.wikipedia.org/wiki/Computer_network"
                    }
                ]
            }
        ]
    },


    unix: {
        category: "Computer Science",
        categoryLabel: "Computer Science",
        title: "Unix & Command Line",
        summary: "Working directly with Unix-like operating systems.",
        difficulty: "Beginner",

        tabs: [
            {
                id: "overview",
                label: "Overview",
                type: "overview",
                paragraphs: [
                    "Unix is a family of operating-system concepts that strongly influenced Linux, macOS, BSD, and modern server infrastructure.",
                    "The command line gives users a direct text interface for navigating files, controlling processes, administering systems, networking, and automation."
                ],
                cards: [
                    ["Navigation", "cd / pwd"],
                    ["Files", "ls / cp / mv"],
                    ["Processes", "ps / kill"],
                    ["Remote", "ssh"]
                ]
            },

            {
                id: "commands",
                label: "Commands",
                type: "code",
                heading: "Common Commands",
                language: "shell",
                code:
`pwd
ls -la
cd /var/www
mkdir project
cp source.txt copy.txt
mv old.txt new.txt
ps aux
grep nginx /var/log/nginx/access.log
ssh user@server`
            },

            {
                id: "concepts",
                label: "Concepts",
                type: "content",
                heading: "Important Unix Concepts",
                bullets: [
                    "Filesystem hierarchy",
                    "Users and groups",
                    "Permissions",
                    "Processes",
                    "Standard input and output",
                    "Pipes",
                    "Shell scripting",
                    "Environment variables",
                    "Remote administration"
                ]
            },

            {
                id: "resources",
                label: "Resources",
                type: "resources",
                heading: "External Resources",
                resources: [
                    {
                        name: "Basic Unix",
                        source: "University of Oxford",
                        url: "https://www.maths.ox.ac.uk/system/files/legacy/2356/basic-unix.pdf"
                    }
                ]
            }
        ]
    },


    /* =====================================================
       PRACTICE PROBLEMS
    ====================================================== */

    calculator: makePracticeTopic(
        "Basic Calculator",
        "Beginner",
        "Build a program that performs basic arithmetic operations.",
        [
            "Accept two numeric values from the user",
            "Allow the user to choose an operation",
            "Support addition",
            "Support subtraction",
            "Support multiplication",
            "Support division"
        ],
        [
            "Handle division by zero",
            "Add exponentiation",
            "Add square root support",
            "Allow repeated calculations without restarting"
        ],
        ["Input", "Conditionals", "Functions", "Arithmetic"]
    ),


    greeting: makePracticeTopic(
        "Write a Greeting",
        "Beginner",
        "Ask the user for their name and display a personalized greeting.",
        [
            "Read the user's name",
            "Store the name in a variable",
            "Construct a greeting",
            "Display the result"
        ],
        [
            "Change the greeting based on the time of day",
            "Ask for additional information",
            "Format the output differently"
        ],
        ["Input", "Strings", "Variables", "Output"]
    ),


    "guessing-game": makePracticeTopic(
        "Number Guessing Game",
        "Beginner",
        "Create a game where the computer chooses a number and the player attempts to guess it.",
        [
            "Generate a random target number",
            "Ask the player for a guess",
            "Report whether the guess is too high or too low",
            "Continue until the player guesses correctly"
        ],
        [
            "Count the number of attempts",
            "Add difficulty levels",
            "Limit the number of guesses",
            "Create a score system"
        ],
        ["Loops", "Conditionals", "Random Numbers", "State"]
    ),


    "file-reader": makePracticeTopic(
        "File Word Counter",
        "Beginner",
        "Read a text file and count how many words it contains.",
        [
            "Open a text file",
            "Read its contents",
            "Split the text into words",
            "Count the words",
            "Display the result"
        ],
        [
            "Count lines",
            "Count characters",
            "Find the most common word",
            "Ignore punctuation"
        ],
        ["Files", "Strings", "Loops", "Text Processing"]
    ),


    fibonacci: makePracticeTopic(
        "Fibonacci Sequence",
        "Beginner",
        "Generate values in the Fibonacci sequence.",
        [
            "Start with the first two values",
            "Generate each new value from the previous two",
            "Allow the user to choose how many terms to generate"
        ],
        [
            "Create a recursive implementation",
            "Compare recursive and iterative performance",
            "Calculate only the nth Fibonacci number"
        ],
        ["Loops", "Variables", "Recursion", "Math"]
    ),


    "coin-toss": makePracticeTopic(
        "Coin Toss",
        "Beginner",
        "Simulate flipping a coin and return heads or tails.",
        [
            "Generate a random result",
            "Map the result to heads or tails",
            "Display the outcome"
        ],
        [
            "Flip the coin multiple times",
            "Count heads and tails",
            "Calculate percentages",
            "Graph the results"
        ],
        ["Random Numbers", "Conditionals", "Statistics"]
    ),


    temperature: makePracticeTopic(
        "Temperature Conversion",
        "Beginner",
        "Convert temperatures between Fahrenheit and Celsius.",
        [
            "Accept a temperature value",
            "Allow the user to select the source unit",
            "Apply the correct conversion formula",
            "Display the converted value"
        ],
        [
            "Add Kelvin",
            "Validate input",
            "Allow repeated conversions",
            "Format output to a selected precision"
        ],
        ["Input", "Functions", "Arithmetic", "Validation"]
    )
};


/* =========================================================
   REFERENCE DATA
========================================================= */

const referenceViews = {

    history: {
        category: "Reference",
        categoryLabel: "Computer Science Reference",
        title: "History of Computing",
        summary: "Major developments that shaped modern computer science.",
        difficulty: "Reference",

        periods: [
            {
                period: "19th Century",
                title: "Early Beginnings",
                text:
                    "Charles Babbage designed the Analytical Engine, a mechanical general-purpose computing concept. Ada Lovelace studied the machine and described a method for calculating Bernoulli numbers, work commonly discussed as an early example of a computer algorithm."
            },

            {
                period: "1930s–1940s",
                title: "Theoretical Foundations",
                text:
                    "Alan Turing helped formalize the mathematical foundations of computation through the concept now known as the Turing machine. His work became foundational to computability theory and theoretical computer science."
            },

            {
                period: "1940s–1960s",
                title: "Rise of Electronic Computers",
                text:
                    "Electronic digital computers developed rapidly after World War II. Programming evolved from direct machine instructions toward assembly languages and increasingly sophisticated high-level languages."
            },

            {
                period: "1950s–1960s",
                title: "Programming Languages",
                text:
                    "Grace Hopper contributed to compiler development and helped advance the idea that programmers could express programs using more human-readable languages. She later played an important role in the development of COBOL."
            },

            {
                period: "1970s–1980s",
                title: "Personal Computer Revolution",
                text:
                    "Microprocessors made smaller and more affordable computers possible. Companies such as Apple and Microsoft helped bring personal computing into homes, schools, and businesses."
            },

            {
                period: "1990s–Present",
                title: "Internet and Modern Computing",
                text:
                    "The growth of the Internet, mobile devices, cloud computing, artificial intelligence, high-performance hardware, and globally distributed systems dramatically expanded the role of computer science."
            }
        ]
    },


    figures: {
        category: "Reference",
        categoryLabel: "Computer Science Reference",
        title: "Important Figures",
        summary: "People whose work helped shape computing and computer science.",
        difficulty: "Reference",

        figures: [
            {
                dates: "1791–1871",
                name: "Charles Babbage",
                text:
                    "Designed the Difference Engine and Analytical Engine. His designs introduced important concepts associated with programmable mechanical computation."
            },

            {
                dates: "1815–1852",
                name: "Ada Lovelace",
                text:
                    "Wrote extensive notes about Babbage's Analytical Engine and described an algorithm intended for execution by the machine."
            },

            {
                dates: "1912–1954",
                name: "Alan Turing",
                text:
                    "Made foundational contributions to computability, algorithms, artificial intelligence, and wartime cryptanalysis."
            },

            {
                dates: "1906–1992",
                name: "Grace Hopper",
                text:
                    "A programming pioneer associated with early compiler development and the development of COBOL."
            },

            {
                dates: "1950–",
                name: "Steve Wozniak",
                text:
                    "Designed the Apple I and Apple II computers and played a central engineering role in the early development of personal computing."
            },

            {
                dates: "1955–2011",
                name: "Steve Jobs",
                text:
                    "Co-founded Apple and strongly influenced the commercialization, product design, and user experience of personal computing."
            },

            {
                dates: "1955–",
                name: "Bill Gates",
                text:
                    "Co-founded Microsoft and played a major role in the growth of commercial software for personal computers."
            }
        ]
    }
};


/* =========================================================
   DOM REFERENCES
========================================================= */

const topicTabs = document.getElementById("topicTabs");
const topicContent = document.getElementById("topicContent");

const topicCategory = document.getElementById("topicCategory");
const topicTitle = document.getElementById("topicTitle");
const topicSummary = document.getElementById("topicSummary");
const topicDifficulty = document.getElementById("topicDifficulty");

const panelTitle = document.getElementById("panelTitle");

const infoCategory = document.getElementById("infoCategory");
const infoTopic = document.getElementById("infoTopic");
const infoDifficulty = document.getElementById("infoDifficulty");

const searchInput = document.getElementById("searchInput");

const navigationItems = document.querySelectorAll(".nav-item");

const compilerModal = document.getElementById("compilerModal");
const closeCompilerButton = document.getElementById("closeCompiler");
const compilerLanguage = document.getElementById("compilerLanguage");
const compilerFrame = document.getElementById("compilerFrame");


let currentTopicKey = "cpp";
let currentTabIndex = 0;


/* =========================================================
   PRACTICE TOPIC FACTORY
========================================================= */

function makePracticeTopic(
    title,
    difficulty,
    objective,
    requirements,
    extensions,
    concepts
) {
    return {
        category: "Practice",
        categoryLabel: "Programming Exercise",
        title: title,
        summary: objective,
        difficulty: difficulty,

        tabs: [
            {
                id: "objective",
                label: "Objective",
                type: "practice-objective",
                objective: objective,
                concepts: concepts
            },

            {
                id: "requirements",
                label: "Requirements",
                type: "list",
                heading: "Requirements",
                items: requirements
            },

            {
                id: "extensions",
                label: "Extensions",
                type: "list",
                heading: "Extensions",
                items: extensions
            },

            {
                id: "compiler",
                label: "Compiler",
                type: "compiler-launch"
            }
        ]
    };
}


/* =========================================================
   DOM HELPERS
========================================================= */

function clearElement(element) {
    element.replaceChildren();
}


function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined && text !== null) {
        element.textContent = text;
    }

    return element;
}


function appendParagraph(parent, text) {
    parent.appendChild(
        makeElement("p", "", text)
    );
}


function appendHeading(parent, text) {
    parent.appendChild(
        makeElement("h2", "", text)
    );
}


/* =========================================================
   HEADER
========================================================= */

function updateTopicHeader(topic) {
    topicCategory.textContent = topic.categoryLabel;
    topicTitle.textContent = topic.title;
    topicSummary.textContent = topic.summary;
    topicDifficulty.textContent = topic.difficulty;

    infoCategory.textContent = topic.category;
    infoTopic.textContent = topic.title;
    infoDifficulty.textContent = topic.difficulty;
}


/* =========================================================
   TAB RENDERING
========================================================= */

function renderTabs(topic) {
    clearElement(topicTabs);

    topic.tabs.forEach(function (tab, index) {
        const button = makeElement(
            "button",
            "topic-tab",
            tab.label
        );

        button.type = "button";

        if (index === currentTabIndex) {
            button.classList.add("active");
        }

        button.addEventListener("click", function () {
            currentTabIndex = index;
            renderTabs(topic);
            renderTabContent(topic.tabs[index]);
        });

        topicTabs.appendChild(button);
    });
}


/* =========================================================
   CARDS
========================================================= */

function renderInfoCards(cards) {
    const grid = makeElement("div", "info-grid");

    cards.forEach(function (cardData) {
        const card = makeElement("div", "info-card");

        const label = makeElement(
            "span",
            "info-card-label",
            cardData[0]
        );

        const value = makeElement(
            "span",
            "info-card-value",
            cardData[1]
        );

        card.append(label, value);
        grid.appendChild(card);
    });

    topicContent.appendChild(grid);
}


/* =========================================================
   CODE
========================================================= */

function renderCode(code, language) {
    const wrapper = makeElement("div", "code-block");

    const header = makeElement("div", "code-header");

    header.append(
        makeElement(
            "span",
            "",
            language ? language.toUpperCase() : "CODE"
        ),

        makeElement(
            "span",
            "",
            "Example"
        )
    );

    const pre = document.createElement("pre");
    const codeElement = document.createElement("code");

    codeElement.textContent = code;

    pre.appendChild(codeElement);

    wrapper.append(header, pre);

    topicContent.appendChild(wrapper);
}


/* =========================================================
   RESOURCE LINKS
========================================================= */

function renderResources(resources) {
    const list = makeElement("div", "resource-list");

    resources.forEach(function (resource) {
        const link = document.createElement("a");

        link.className = "resource-link";
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.append(
            makeElement(
                "span",
                "",
                resource.name
            ),

            makeElement(
                "span",
                "",
                resource.source + " ↗"
            )
        );

        list.appendChild(link);
    });

    topicContent.appendChild(list);
}


/* =========================================================
   TAB CONTENT
========================================================= */

function renderTabContent(tab) {
    clearElement(topicContent);

    panelTitle.textContent = tab.label;

    switch (tab.type) {

        case "overview":

            tab.paragraphs.forEach(function (paragraph) {
                appendParagraph(topicContent, paragraph);
            });

            if (tab.cards) {
                renderInfoCards(tab.cards);
            }

            break;


        case "content":

            if (tab.heading) {
                appendHeading(topicContent, tab.heading);
            }

            if (tab.paragraphs) {
                tab.paragraphs.forEach(function (paragraph) {
                    appendParagraph(topicContent, paragraph);
                });
            }

            if (tab.bullets) {
                const list = document.createElement("ul");

                tab.bullets.forEach(function (bullet) {
                    list.appendChild(
                        makeElement("li", "", bullet)
                    );
                });

                topicContent.appendChild(list);
            }

            break;


        case "code":

            if (tab.heading) {
                appendHeading(topicContent, tab.heading);
            }

            if (tab.paragraphs) {
                tab.paragraphs.forEach(function (paragraph) {
                    appendParagraph(topicContent, paragraph);
                });
            }

            renderCode(tab.code, tab.language);

            break;


        case "resources":

            if (tab.heading) {
                appendHeading(topicContent, tab.heading);
            }

            appendParagraph(
                topicContent,
                "Use these sources to continue studying this topic."
            );

            renderResources(tab.resources);

            break;


        case "practice-objective":

            appendHeading(topicContent, "Objective");

            appendParagraph(
                topicContent,
                tab.objective
            );

            const meta = makeElement(
                "div",
                "practice-meta"
            );

            tab.concepts.forEach(function (concept) {
                meta.appendChild(
                    makeElement(
                        "span",
                        "practice-tag",
                        concept
                    )
                );
            });

            topicContent.appendChild(meta);

            const note = makeElement("div", "note");

            appendParagraph(
                note,
                "Try designing the solution before opening the compiler."
            );

            topicContent.appendChild(note);

            break;


        case "list":

            appendHeading(
                topicContent,
                tab.heading
            );

            const checklist = makeElement(
                "ul",
                "checklist"
            );

            tab.items.forEach(function (item) {
                checklist.appendChild(
                    makeElement(
                        "li",
                        "",
                        item
                    )
                );
            });

            topicContent.appendChild(checklist);

            break;


        case "compiler-launch":

            appendHeading(
                topicContent,
                "Interactive Compiler"
            );

            appendParagraph(
                topicContent,
                "Open the compiler without leaving your current LearnCS topic."
            );

            const openButton = makeElement(
                "button",
                "resource-link",
                ""
            );

            openButton.type = "button";

            openButton.append(
                makeElement(
                    "span",
                    "",
                    "Open Compiler"
                ),

                makeElement(
                    "span",
                    "",
                    "→"
                )
            );

            openButton.addEventListener(
                "click",
                openCompiler
            );

            topicContent.appendChild(openButton);

            break;


        default:

            appendParagraph(
                topicContent,
                "Content unavailable."
            );
    }
}


/* =========================================================
   TOPIC LOADING
========================================================= */

function loadTopic(key) {
    const topic = topics[key];

    if (!topic) {
        return;
    }

    currentTopicKey = key;
    currentTabIndex = 0;

    clearNavigationSelection();

    const selectedButton = document.querySelector(
        '[data-topic="' + key + '"]'
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    updateTopicHeader(topic);
    renderTabs(topic);
    renderTabContent(topic.tabs[0]);
}


/* =========================================================
   REFERENCE VIEWS
========================================================= */

function loadHistory() {
    clearNavigationSelection();

    const data = referenceViews.history;

    topicCategory.textContent = data.categoryLabel;
    topicTitle.textContent = data.title;
    topicSummary.textContent = data.summary;
    topicDifficulty.textContent = data.difficulty;

    infoCategory.textContent = data.category;
    infoTopic.textContent = data.title;
    infoDifficulty.textContent = data.difficulty;

    clearElement(topicTabs);
    clearElement(topicContent);

    panelTitle.textContent = "Timeline";

    const timeline = makeElement(
        "div",
        "timeline"
    );

    data.periods.forEach(function (period) {
        const item = makeElement(
            "article",
            "timeline-item"
        );

        item.append(
            makeElement(
                "span",
                "timeline-period",
                period.period
            ),

            makeElement(
                "h3",
                "",
                period.title
            )
        );

        appendParagraph(
            item,
            period.text
        );

        timeline.appendChild(item);
    });

    topicContent.appendChild(timeline);
}


function loadFigures() {
    clearNavigationSelection();

    const data = referenceViews.figures;

    topicCategory.textContent = data.categoryLabel;
    topicTitle.textContent = data.title;
    topicSummary.textContent = data.summary;
    topicDifficulty.textContent = data.difficulty;

    infoCategory.textContent = data.category;
    infoTopic.textContent = data.title;
    infoDifficulty.textContent = data.difficulty;

    clearElement(topicTabs);
    clearElement(topicContent);

    panelTitle.textContent = "People";

    const grid = makeElement(
        "div",
        "figure-grid"
    );

    data.figures.forEach(function (figure) {
        const card = makeElement(
            "article",
            "figure-card"
        );

        card.append(
            makeElement(
                "span",
                "figure-date",
                figure.dates
            ),

            makeElement(
                "h3",
                "",
                figure.name
            )
        );

        appendParagraph(
            card,
            figure.text
        );

        grid.appendChild(card);
    });

    topicContent.appendChild(grid);
}


/* =========================================================
   SIDEBAR SELECTION
========================================================= */

function clearNavigationSelection() {
    navigationItems.forEach(function (item) {
        item.classList.remove("active");
    });
}


navigationItems.forEach(function (item) {

    if (item.dataset.topic) {
        item.addEventListener(
            "click",
            function () {
                loadTopic(item.dataset.topic);
            }
        );
    }

    if (item.dataset.view === "history") {
        item.addEventListener(
            "click",
            loadHistory
        );
    }

    if (item.dataset.view === "figures") {
        item.addEventListener(
            "click",
            loadFigures
        );
    }
});


/* =========================================================
   RIGHT TOOL BUTTONS
========================================================= */

document
    .querySelectorAll('[data-view="history"]')
    .forEach(function (button) {
        button.addEventListener(
            "click",
            loadHistory
        );
    });


document
    .querySelectorAll('[data-view="figures"]')
    .forEach(function (button) {
        button.addEventListener(
            "click",
            loadFigures
        );
    });


document
    .querySelectorAll('[data-tool="compiler"]')
    .forEach(function (button) {
        button.addEventListener(
            "click",
            openCompiler
        );
    });


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    function () {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        document
            .querySelectorAll(".navigation-group")
            .forEach(function (group) {

                let visibleItems = 0;

                group
                    .querySelectorAll(".nav-item")
                    .forEach(function (item) {

                        const searchable =
                            item.textContent.toLowerCase();

                        const visible =
                            query === "" ||
                            searchable.includes(query);

                        item.classList.toggle(
                            "hidden",
                            !visible
                        );

                        if (visible) {
                            visibleItems += 1;
                        }
                    });

                group.style.display =
                    visibleItems > 0
                        ? ""
                        : "none";
            });
    }
);


/* =========================================================
   COMPILER
========================================================= */

const compilerUrls = {
    python:
        "https://onecompiler.com/embed/python?theme=dark",

    cpp:
        "https://onecompiler.com/embed/cpp?theme=dark",

    java:
        "https://onecompiler.com/embed/java?theme=dark",

    javascript:
        "https://onecompiler.com/embed/javascript?theme=dark"
};


function openCompiler() {
    compilerModal.classList.add("open");

    compilerModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


function closeCompiler() {
    compilerModal.classList.remove("open");

    compilerModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


closeCompilerButton.addEventListener(
    "click",
    closeCompiler
);


document
    .querySelectorAll("[data-close-modal]")
    .forEach(function (element) {
        element.addEventListener(
            "click",
            closeCompiler
        );
    });


compilerLanguage.addEventListener(
    "change",
    function () {

        const selected =
            compilerLanguage.value;

        if (compilerUrls[selected]) {
            compilerFrame.src =
                compilerUrls[selected];
        }
    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            compilerModal.classList.contains("open")
        ) {
            closeCompiler();
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadTopic("cpp");
