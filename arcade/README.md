# AnthonyCS Arcade

[Live arcade](https://anthonycs.dev/projects/arcade/)

The Arcade is a launcher for small browser games and interaction experiments. Each game is intended to remain independently runnable instead of being coupled into one large application.

## Architecture

```text
Arcade launcher
  -> Mother Goose
  -> Firefly
  -> Pocket Pet
  -> future games
```

## What I built

The launcher provides discovery and presentation while individual games own their rendering, input, and game state.

That separation makes it possible to change one title without introducing dependencies into the others.

## Tech

- HTML
- CSS
- JavaScript
- Canvas for game rendering where appropriate

## Note

This directory contains an earlier Arcade snapshot. The live AnthonyCS Arcade has continued to evolve beyond this version.
