# AnthonyCS

Personal computer science and engineering site for projects, technical writeups, study tools, and experiments.

**Live site:** https://anthonycs.dev  
**Portfolio:** https://anthonycs.dev/portfolio/  
**Projects:** https://anthonycs.dev/projects/  
**LearnCS:** https://anthonycs.dev/learn/

![Data Workbench running a 23,220-row dataset](docs/images/data-workbench-overview.jpg)

## What this repository contains

AnthonyCS is self-hosted on Ubuntu/Nginx and split into intentionally different sections rather than one shared frontend.

- **Portfolio** — recruiter-facing overview, resume, contact, and selected work.
- **LearnCS** — interactive study environment.
- **Arcade** — browser-game launcher and standalone games.
- **CAPY** — embedded handheld project documentation.
- **Data Workbench** — structured-data exploration and algorithm benchmarking.
- **Docs** — architecture and technical notes.

The obsolete `home/`, `html/`, `notes/`, `tools/`, and `capyhost/` snapshots have been removed from this repository.

## Featured work

### Data Workbench

Browser-based tooling for loading, inspecting, editing, searching, profiling, benchmarking, and exporting structured datasets.

- **Case study:** https://anthonycs.dev/projects/inventory-system/
- **Live demo:** https://anthonycs.dev/projects/inventory-system/app.html
- **Source:** [data-workbench/](data-workbench/)
- **Technical notes:** [docs/DATA_WORKBENCH.md](docs/DATA_WORKBENCH.md)

### CAPY

Embedded handheld project that progressed from an Arduino Mega proof of concept to an ESP32 architecture with a TFT display, six-button input, MCP23017 I/O expansion, audio, battery power, and enclosure work.

- **Project page:** https://anthonycs.dev/projects/capy/
- **Technical notes:** [docs/CAPY.md](docs/CAPY.md)

### LearnCS

Interactive computer-science study environment with deeper material in C++, data structures, and computer architecture.

- **Live app:** https://anthonycs.dev/learn/
- **Source:** [learncs/](learncs/)

### Arcade

Browser-game launcher with standalone games and a deliberately separate retro interface.

- **Live arcade:** https://anthonycs.dev/projects/arcade/
- **Source:** [arcade/](arcade/)

## Repository structure

The remaining source is grouped by project while the production server uses the public URL structure shown on the right.

```text
GitHub                          Production
├── arcade/                    → /projects/arcade/
├── data-workbench/            → /projects/inventory-system/
├── learncs/                   → /learn/
├── portfolio/                 → /portfolio/
└── docs/                      → project/architecture documentation
```

The GitHub names will be normalized to the exact production directory structure during the next direct server sync. Until then, the live site is the authoritative UI build.

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

That shows up differently across the site: Data Workbench exposes data-structure tradeoffs, CAPY exposes hardware constraints, LearnCS organizes technical study, and Arcade keeps experiments isolated as standalone games.

## Run locally

```bash
git clone https://github.com/awhitecsdev/cs-site-and-server.git
cd cs-site-and-server
python3 -m http.server 8000
```

Then open the source section you want to inspect:

```text
http://localhost:8000/portfolio/
http://localhost:8000/learncs/
http://localhost:8000/arcade/
http://localhost:8000/data-workbench/
```

## Deployment

Production is hosted on Ubuntu with Nginx and HTTPS. Static changes are served directly by Nginx.

Server credentials, SSH keys, certificates, and other secrets are intentionally not stored in this repository.
