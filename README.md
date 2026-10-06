# AnthonyCS

Personal computer science and engineering site for projects, technical writeups, study tools, and experiments.

**Live site:** https://anthonycs.dev  
**Portfolio:** https://anthonycs.dev/portfolio/  
**Projects:** https://anthonycs.dev/projects/  
**LearnCS:** https://anthonycs.dev/learn/

## What I built

AnthonyCS is a self-hosted site that I use as both a portfolio and a place to build software in public. The site is intentionally split into distinct sections instead of forcing every project into one visual system:

- **Projects** — engineering project pages and live demos.
- **Portfolio** — concise professional overview, resume, contact, and selected work.
- **LearnCS** — a study interface for computer science topics.
- **Arcade** — standalone browser games with their own retro UI.
- **CAPY** — documentation for an embedded handheld project.
- **Data Workbench** — browser-based structured-data exploration and algorithm benchmarking.

The live site is served from my own Ubuntu/Nginx host rather than a hosted site builder.

## Featured work

### Data Workbench
Browser-based tooling for loading, inspecting, editing, searching, profiling, and exporting structured datasets.

The benchmark compares repeated exact-match lookup strategies while separating preprocessing cost from lookup cost. On a documented 23,220-row dataset with 5,000 successful queries, the experiment exposed a major cost in the original generalized sort path and led to a type-aware numeric benchmark implementation.

- **Case study:** https://anthonycs.dev/projects/inventory-system/
- **Live demo:** https://anthonycs.dev/projects/inventory-system/app.html

### CAPY
An evolving embedded handheld project built around small microcontrollers, a TFT display, physical controls, storage, audio, and portable power.

The project progressed from an Arduino Mega proof of concept to an ESP32-based architecture with an MCP23017 I/O expander and a redesigned six-button control layout.

- **Project page:** https://anthonycs.dev/projects/capy/

### LearnCS
A browser-based study environment for organizing and reviewing computer science material.

Current emphasis is on building deeper material in systems-oriented topics rather than maximizing the number of shallow topic pages.

- **Live app:** https://anthonycs.dev/learn/

### Arcade
A collection of standalone browser games. Each game owns its own HTML/JavaScript implementation while the Arcade page acts as a launcher.

- **Live arcade:** https://anthonycs.dev/projects/arcade/

## Repository structure

```text
.
├── arcade/        # Earlier Arcade frontend
├── capyhost/      # CAPY-related web interface
├── home/          # Earlier AnthonyCS home frontend
├── html/          # Default/static server files
├── learncs/       # LearnCS frontend
├── notes/         # Notes interface
├── portfolio/     # Portfolio pages and project writeups
├── tools/         # Utility/tool pages
└── docs/          # Architecture and project notes
```

The production site has continued to evolve beyond some of the older snapshots in this repository. Live project pages are the best reference for the current UI and project state.

## Architecture

Most of AnthonyCS is deliberately lightweight:

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

There is no framework required to render the main site. Individual projects are kept as self-contained as practical so they can evolve without coupling every section to a shared frontend stack.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Tech

- HTML
- CSS
- JavaScript
- Linux / Ubuntu
- Nginx
- Git
- ESP32 / Arduino ecosystem for CAPY
- Data structures and browser performance work in Data Workbench

## Hardest problem

The main engineering challenge has not been creating another static portfolio page. It has been keeping several different products coherent while letting them stay intentionally different.

LearnCS behaves like a study application, Arcade behaves like a game launcher, Data Workbench behaves like a data tool, and the portfolio stays restrained and recruiter-facing. The shared requirement is clear navigation, understandable project boundaries, and reliable deployment without flattening those interfaces into one generic template.

## Run locally

Clone the repository:

```bash
git clone https://github.com/awhitecsdev/cs-site-and-server.git
cd cs-site-and-server
```

Serve it with any static HTTP server. For example:

```bash
python3 -m http.server 8000
```

Then open a section directly, for example:

```text
http://localhost:8000/home/
http://localhost:8000/portfolio/
http://localhost:8000/learncs/
http://localhost:8000/arcade/
```

Some older pages may contain paths that reflect the production server layout.

## Deployment

Production is hosted on Ubuntu with Nginx and HTTPS. Static changes do not require an application server restart; updated files are served directly by Nginx.

Server credentials, private configuration, certificates, and other secrets are intentionally not stored in this repository.

## Direction

Current work is focused on:

- publishing cleaner project source and documentation,
- improving Data Workbench functionality,
- deepening selected LearnCS topics,
- documenting CAPY architecture and hardware decisions,
- and adding more low-level / digital-hardware work over time.

