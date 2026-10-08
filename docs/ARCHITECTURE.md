# AnthonyCS Architecture

This document describes the live site's structure and the design decisions behind it.

## System overview

```text
Client browser
      |
      | HTTPS
      v
     Nginx
      |
      +-------------------+
      |                   |
      v                   v
Static site sections   Project applications
      |                   |
      |                   +-- Data Workbench
      |                   +-- Arcade games
      |                   +-- CAPY documentation
      |
      +-- Home
      +-- Projects
      +-- Portfolio
      +-- LearnCS
```

The site is primarily static HTML, CSS, and JavaScript served directly by Nginx. This keeps deployment simple and gives each section freedom to use the interaction model that fits it.

## Why the sections are separate

The site contains several interfaces with different goals:

- **Portfolio** should be fast to scan 
- **Projects** should show evidence, design decisions, demos, and technical detail.
- **LearnCS** should behave like a study tool.
- **Arcade** should have a gaming identity.
- **Data Workbench** should behave like a data tool.

A single global design system would require far less work and keep these interfaces visually consistent, but it would also erase useful page distinctions. The architecture therefore favors shared navigation conventions and clear links between sections over forcing every page into one frontend template.

## Data Workbench

High-level data flow:

```text
CSV / TSV / JSON
       |
       v
     Parse
       |
       v
Schema handling
       |
       v
Normalization
       |
       v
Type detection
       |
       v
 Dataset state
   /    |    |    \
search sort stats edit
                |
                v
              export
```

Important implementation decisions include:

- CSV/TSV input is parsed into arrays so schema handling stays explicit.
- Duplicate headers are retained safely with generated unique names.
- Blank headers are ignored.
- Extra malformed row fields do not silently expand the schema.
- JSON schemas are built from the union of keys across records.
- Numeric columns are inferred from populated values rather than assumed from headers.
- Search benchmarking separates preprocessing/build time from lookup time.
- Numeric benchmark fields use numeric keys and numeric ordering instead of generalized locale-aware string comparison.

The project page documents the current benchmark and design tradeoffs:

https://anthonycs.dev/projects/inventory-system/

## CAPY

CAPY has evolved through hardware constraints rather than from a fixed final architecture.

```text
Arduino Mega + TFT + joystick
              |
              v
ESP32 + TFT + breadboard controls
              |
              v
ESP32 + TFT + MCP23017
              |
              +-- six digital buttons
              +-- speaker
              +-- portable power
              +-- custom enclosure
```

The shift to the ESP32 reduced physical size but made GPIO management more important as controls and peripherals were added. The MCP23017 I/O expander became part of the design to move button input away from direct GPIO pressure.

Project page:

https://anthonycs.dev/projects/capy/

## Arcade

Arcade is intentionally a launcher rather than having all games in 1 file.

```text
Arcade launcher
      |
      +-- Mother Goose
      +-- Firefly
      +-- Pocket Pet
      +-- future games
```

Each game remains a standalone document/application. This keeps game logic isolated and makes it possible to iterate on one title without coupling it to the others.

## LearnCS

LearnCS is organized as a study interface. The current direction is selective and based on what I study or have found useful.
Near-term focus:

1. C / C++
2. Data Structures
3. Computer Architecture
4. Unix / Linux

## Deployment model

Production is hosted on Ubuntu and served through Nginx over HTTPS.

The public web root and server configuration are maintained separately from this repository. Secrets, certificates, credentials, and other private server material are not committed.

The deployment model is intentionally simple for the current scale of the project: static files are updated directly and served by Nginx without a framework build pipeline or long-running application process.
