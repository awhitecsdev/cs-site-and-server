# AnthonyCS

Personal computer science and engineering site for projects, technical writeups, study tools, and experiments.

**Live site:** https://anthonycs.dev  
**Portfolio:** https://anthonycs.dev/portfolio/  
**Projects:** https://anthonycs.dev/projects/  
**LearnCS:** https://anthonycs.dev/learn/



## Repository structure

This repository mirrors the public structure of the production site.

```text
.
├── index.html
├── learn/
│   ├── index.html
│   ├── css/
│   └── js/
├── portfolio/
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── portfolio.css
│   └── resume.pdf
├── projects/
│   ├── index.html
│   ├── arcade/
│   ├── capy/
│   └── inventory-system/
└── docs/
```

Old snapshots such as `home/`, `html/`, `notes/`, `tools/`, `capyhost/`, `learncs/`, and the old top-level `arcade/` have been removed.

## Featured work

### Data Workbench

Browser-based structured-data tooling for loading, inspecting, editing, searching, profiling, benchmarking, and exporting datasets.

- **Case study:** https://anthonycs.dev/projects/inventory-system/
- **Live demo:** https://anthonycs.dev/projects/inventory-system/app.html
- **Source:** [projects/inventory-system/](projects/inventory-system/)
- **Technical notes:** [docs/DATA_WORKBENCH.md](docs/DATA_WORKBENCH.md)

### CAPY

Embedded handheld project developed through hardware and firmware revisions.

- **Project page:** https://anthonycs.dev/projects/capy/
- **Project files:** [projects/capy/](projects/capy/)
- **Technical notes:** [docs/CAPY.md](docs/CAPY.md)

The design progressed from an Arduino Mega proof of concept to an ESP32-based handheld with a TFT display, six-button input, MCP23017 I/O expansion, audio, battery power, and a custom enclosure.

### LearnCS

Interactive computer-science study environment with deeper material in C++, data structures, computer architecture, Unix/Linux, and related systems topics.

- **Live app:** https://anthonycs.dev/learn/
- **Source:** [learn/](learn/)

### Arcade

Retro-styled launcher for standalone browser games.

- **Live arcade:** https://anthonycs.dev/projects/arcade/
- **Source:** [projects/arcade/](projects/arcade/)

Current games include Mother Goose, Firefly, and Pocket Pet.

## Architecture

```text
Browser
   ↓
HTTPS
   ↓
Nginx
   ↓
Static HTML / CSS / JavaScript
   ↓
Independent site sections and project applications
```

The sections intentionally keep separate visual identities rather than sharing one generic frontend.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Tech

- HTML / CSS / JavaScript
- C / C++
- Linux / Ubuntu
- Nginx
- Git
- ESP32 / Arduino ecosystem
- Data structures and browser performance work
- Computer architecture and digital logic study

## Engineering approach

The recurring workflow is to build a usable version, run it, find the constraint, measure or debug it, and revise the design.

That appears differently across the site: Data Workbench exposes data-structure tradeoffs, CAPY exposes hardware constraints, LearnCS organizes technical study, and Arcade isolates interactive experiments as standalone games.

## Run locally

```bash
git clone https://github.com/awhitecsdev/cs-site-and-server.git
cd cs-site-and-server
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
http://localhost:8000/portfolio/
http://localhost:8000/learn/
http://localhost:8000/projects/
```

## Deployment

Production is hosted on Ubuntu with Nginx and HTTPS. The repository tracks the public site files; server credentials, SSH keys, certificates, temporary backups, and private configuration are intentionally excluded.
