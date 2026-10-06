# CAPY

**Project page:** https://anthonycs.dev/projects/capy/

CAPY is an evolving handheld embedded-computing project. I use it to work through hardware constraints, input design, display/UI code, peripheral integration, and the tradeoffs involved in turning a breadboarded idea into a practical handheld device.

## Prototype evolution

```text
Arduino Mega + TFT + joystick
              |
              v
ESP32 + TFT + joystick / breadboards
              |
              v
ESP32 + TFT + MCP23017 + six buttons
              |
              +-- speaker
              +-- portable power
              +-- custom enclosure
```

The ESP32 reduced the physical footprint compared with the Arduino Mega, but the smaller design made GPIO allocation more important as controls and peripherals were added.

The input system also changed. The analog joystick used in the earlier prototype was replaced with a four-button D-pad plus two action/navigation buttons. An MCP23017 I/O expander was added to handle the growing digital-input requirement without consuming the remaining ESP32 pins directly.

## Current hardware direction

Verified/current design elements include:

- ESP32
- TFT display
- MCP23017 I/O expansion
- four-direction D-pad
- Select/A button
- Back/B button
- speaker output
- portable power
- custom enclosure work
- Wi-Fi for network-dependent features such as time synchronization

Additional hardware concepts tested or planned across iterations include ambient-light input, RGB indication, microSD storage, and Bluetooth communication.

## What I built

The point of CAPY is not simply assembling modules. The project has required repeated redesign around physical and electrical constraints:

- moving from a physically large Arduino Mega to an ESP32,
- rethinking the control scheme,
- adding I/O expansion,
- managing limited convenient GPIO,
- integrating a display and controls into a handheld layout,
- and separating prototype convenience from what a compact final device would need.

## Hardest problem

The hardest problem has been hardware integration under size and I/O constraints.

A breadboard makes experimentation easy, but every additional peripheral increases wiring, enclosure volume, and pin pressure. Moving to the ESP32 solved one physical problem while exposing another: the device needed a cleaner way to handle a growing set of controls. The MCP23017 and six-button redesign came from that constraint rather than from adding a feature for its own sake.

## Architecture direction

The next hardware revisions are intended to reduce breadboard/jumper-wire overhead and move toward a more compact, reproducible assembly.

Longer term, CAPY is also a platform for learning lower-level hardware design. The progression I am aiming for is:

```text
microcontroller prototype
        ->
cleaner custom hardware
        ->
FPGA / RTL experimentation
        ->
deeper digital-system design
```

## Status

CAPY is an active project. The live project page is the best reference for current prototype media and the latest revision history.
