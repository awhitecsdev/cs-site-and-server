# Data Workbench

**Live case study:** https://anthonycs.dev/projects/inventory-system/  
**Live demo:** https://anthonycs.dev/projects/inventory-system/app.html

Data Workbench is a browser-based structured-data tool for loading, inspecting, editing, searching, profiling, benchmarking, and exporting datasets.

## What I built

The application handles:

- CSV and TSV parsing
- JSON arrays, single objects, and objects containing a `data` array
- schema normalization
- duplicate-header handling
- malformed-row handling
- automatic numeric-field detection
- global and field-specific search
- sorting and pagination
- record add/edit/delete operations
- numeric summaries
- CSV export
- search-strategy benchmarking

## Data flow

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
   /    |    |     \
search sort stats editing
                 |
                 v
               export
```

## Parsing decisions

Delimited files are parsed as arrays rather than relying on automatic header mapping. That keeps schema construction explicit.

Current handling includes:

- trimming header whitespace and BOM characters,
- ignoring blank header cells,
- renaming duplicate headers such as `price (2)`,
- detecting rows with extra fields without allowing them to silently expand the schema,
- and normalizing records into a consistent internal representation.

For JSON, the schema is built from the union of keys across records so later objects can introduce fields that are absent from the first row.

## Numeric inference

A populated column is treated as numeric when at least 80% of its non-empty values can be parsed as numbers.

This allows a mostly numeric column to remain analyzable even if it contains a small number of markers such as missing or nonnumeric values.

## Search benchmark

The benchmark compares three repeated exact-match lookup strategies:

1. linear scan,
2. JavaScript `Map` index,
3. sorted array with iterative binary search.

Build/preprocessing time is measured separately from lookup time.

A documented test used:

- 23,220 records
- 7 columns
- the `value` field
- 5,000 successful exact-match queries
- median of five runs

Baseline medians before the type-aware benchmark optimization were:

| Strategy | Build | Search | Total |
| --- | ---: | ---: | ---: |
| Linear Array | 0 ms | 439.1 ms | 439.1 ms |
| Map Index | 1.0 ms | 0.2 ms | 1.1 ms |
| Sorted + Binary Search | 844.2 ms | 162.4 ms | 1003.3 ms |

The useful result was not simply that one structure won. The experiment exposed that the generalized locale-aware sort path was dominating the binary-search strategy's total cost on numeric data.

## Optimization from the benchmark

The benchmark was revised so all strategies now operate on the same normalized key type:

```text
Numeric field
    -> numeric key
    -> numeric equality
    -> numeric Map key
    -> numeric sort
    -> numeric binary search

Text field
    -> string key
    -> exact string equality
    -> string Map key
    -> lexical sort
    -> lexical binary search
```

This removed unnecessary locale-aware string comparison from numeric benchmark fields.

That change is a direct example of the intended development loop for the project:

```text
measure
  -> identify bottleneck
  -> change implementation
  -> validate behavior
```

## Hardest problem

The difficult part is keeping the benchmark honest enough to teach something.

A lookup benchmark can easily become misleading if each strategy receives different data, if preprocessing cost is hidden, or if numeric values are compared as strings in one path and numbers in another. The current implementation normalizes keys and reuses the same generated query workload across the strategies.

## Current limitations

- processing is client-side,
- very large tables are not yet virtualized,
- numeric inference is heuristic rather than schema-driven,
- benchmark queries currently sample values that already exist in the dataset,
- and the project is intentionally a lightweight workbench rather than a replacement for a full dataframe/database environment.

## Next work

- stronger column profiling,
- richer filters,
- duplicate detection,
- improved export behavior,
- and table virtualization if dataset size makes it necessary.
