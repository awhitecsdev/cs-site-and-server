# Data Workbench

[Live demo](https://anthonycs.dev/projects/inventory-system/app.html) · [Case study](https://anthonycs.dev/projects/inventory-system/)

A browser-based workbench for opening unfamiliar structured data and doing useful inspection before reaching for a custom script.

![Data Workbench with a 23,220-row dataset](../docs/images/data-workbench-overview.jpg)

## What I built

- CSV / TSV / JSON import
- one-click **Load Sample Dataset**
- explicit schema handling
- duplicate-header protection
- search by all fields or one field
- sortable columns
- pagination
- add / edit / delete rows
- column profiles
- numeric summaries
- CSV export
- type-aware search benchmarking

## Hardest problem

The benchmark initially made the sorted/binary-search strategy look much worse than expected. The lookup itself was faster than linear scanning, but the sorted representation was expensive to build because numeric values were still being ordered through generalized locale-aware string comparison.

The benchmark now normalizes keys by inferred type:

```text
numeric column -> numeric keys -> numeric sort -> numeric binary search
text column    -> string keys  -> lexical sort -> lexical binary search
```

It also gives each strategy the same generated query workload and reports build time separately from search time.

## Architecture

```text
file
  -> parse
  -> schema handling
  -> normalization
  -> type inference
  -> dataset state
      -> search
      -> sort
      -> profile
      -> edit
      -> benchmark
      -> export
```

## Run locally

Because the sample dataset is loaded with `fetch()`, serve the directory instead of opening `index.html` directly:

```bash
cd data-workbench
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

No build step is required.

## Notes

The bundled sample is intentionally small so the demo is immediately usable. The live case study documents the larger 23,220-row benchmark dataset and the measurements that motivated the type-aware benchmark change.
