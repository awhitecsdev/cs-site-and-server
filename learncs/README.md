# LearnCS

[Live site](https://anthonycs.dev/learn/)

LearnCS is my browser-based study interface for computer science material. The current direction is selective depth: fewer topics, but stronger explanations, examples, and connections between software and the machine underneath it.

## Current deep dives

- [C++](cpp.html) — memory, references, ownership, RAII, containers
- [Data Structures](data-structures.html) — choose from the workload backward
- [Computer Architecture](computer-architecture.html) — trace an instruction through the machine

## What I built

- searchable topic navigation
- expandable explanations
- programming-language references
- practice prompts
- focused long-form lessons
- links back to the broader AnthonyCS project

## Hardest problem

The main problem is editorial rather than technical: a study site can look large while teaching very little. I am intentionally avoiding the “100 shallow topics” approach and strengthening a smaller number of areas that connect directly to my coursework and systems/hardware goals.

## Run locally

```bash
cd learncs
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
