# Benchmark methodology

The benchmark suite measures four independent effects: the time spent by `intern()`, exact graph reduction, V8 retained heap reduction, and consequences for serializers. Benchmarks characterize those effects. The correctness suite separately proves the promised quotient behavior.

## Reproduction

Install the pinned dependencies and run:

```sh
pnpm bench
```

This runs the quick profile, writes an immutable raw result beneath `benchmark-results/raw/`, selects that run as `benchmark-results/latest/`, and generates JSON, Markdown and SVG artifacts. Use `pnpm bench:full` for all configured fixtures, sizes, timing samples and three retained-heap samples per state.

Other commands are:

```sh
pnpm bench:memory
pnpm bench:report
pnpm bench:plots
pnpm bench:readme
pnpm bench:compare -- baseline/results.json candidate/results.json
```

`bench:readme` is explicit because an ordinary local benchmark should not silently modify the package README.

## Fixture contract

Every fixture implements `BenchmarkFixture` from `bench/types.ts`. It supplies a stable ID, family, description, optional parameters, serialization capabilities and a `create()` function. A new registered fixture automatically participates in structural analysis, intern timing and retained-size measurement. YAML and JSON measurements depend only on declared capabilities.

Application object sources live in `fixtures/application/`, outside the benchmark harness. The benchmark registry and `test/fixtures/application.test.ts` consume the same source definitions. This keeps realistic fixture inputs under correctness coverage while benchmark-specific metadata remains in `bench/`. The TypeScript AST source parses its own module using TypeScript's compiler API and projects it to ordinary objects, since compiler AST nodes have internal state outside interner's supported domain.

Synthetic fixtures isolate graph properties and scaling. Test-derived fixtures record deterministic seeds and generator configuration. Application fixtures generate realistic documents from small checked-in definitions. The flagship fixture calls Zod's supported `z.toJSONSchema()` API; `interner` itself has no knowledge of Zod. Zod 4.6 attaches a non-enumerable `~standard` protocol property to the returned payload. The fixture removes that protocol metadata and passes the enumerable JSON Schema object to `intern()`, whose supported domain deliberately rejects hidden properties.

## Structural metrics

The walker follows reachable supported values and visits each object identity once. Primitive occurrences are counted whenever a primitive is encountered at the root or as an edge target. Property names are not counted as string values.

| Metric                | Definition                                                                  |
| --------------------- | --------------------------------------------------------------------------- |
| `objectNodes`         | Distinct reachable supported ordinary-object identities.                    |
| `arrayNodes`          | Distinct reachable array identities.                                        |
| `dateNodes`           | Distinct reachable Date identities.                                         |
| `regexpNodes`         | Distinct reachable RegExp identities.                                       |
| `edges`               | Present object properties, array elements and extra array properties.       |
| `objectProperties`    | Enumerable ordinary-object properties and extra non-index array properties. |
| `arrayElements`       | Present array-index elements.                                               |
| `arrayHoles`          | Missing indices below an array's length.                                    |
| `strings`             | String value occurrences, excluding property names.                         |
| `stringCodeUnits`     | Sum of JavaScript UTF-16 code-unit lengths for those string occurrences.    |
| primitive counters    | Occurrences of number, bigint, boolean, null and undefined values.          |
| `totalReferenceNodes` | Sum of all distinct object, array, Date and RegExp identities.              |

Exact deltas use `(after - before) / before * 100`, so reductions are negative. A zero denominator is reported as unavailable.

## Retained heap

V8 retained size is the heap memory attributed by the heap graph to objects that would become collectible if the benchmark root were no longer reachable.

Each fixture and state runs in a fresh Node process. The worker constructs either the source or interned value, places it behind a uniquely named holder, forces GC with `--expose-gc`, and writes a heap snapshot. memlab parses the snapshot and calculates dominators and retained sizes. The worker locates the holder, follows its `rootValue` property edge, writes that heap node's `retainedSize` to a per-worker temporary JSON file, deletes the snapshot and exits.

The full profile records three independent samples for each before and after state. Reports show the median, minimum, maximum and raw samples. Retained bytes are engine-specific, so every record includes Node, V8, platform and architecture.

## Timing

Timing uses `performance.now()`, warmup iterations and repeated measured iterations. Quick runs use two warmups and seven samples; full runs use five warmups and 21 samples. The displayed value is the median, with minimum, maximum and every raw sample preserved.

Each intern sample calls the fixture factory before starting the timer, then measures only `intern(value)`. The source is therefore equivalent and fresh rather than an already-interned result. YAML measurements separately time source serialization, interned serialization, and the end-to-end `intern()` plus YAML workflow.

Serialized sizes use `Buffer.byteLength(text, 'utf8')`. JSON is a control because ordinary JSON cannot preserve sharing. YAML uses `js-yaml` with its normal alias support.

## Results and plots

Raw and selected result files share the schema in `bench/types.ts`. Derived percentages exist only in `summary.json` and reports. Plot modules consume that summary, return Vega-Lite specifications, compile through Vega and render SVG directly in Node without a browser.

The generated plots cover retained heap, YAML bytes, intern time, scaling, and structural reduction versus retained reduction. The structural-byte estimate plot records that no model is published yet.

Estimated structural bytes are a fitted proxy derived from portable graph features. They are not literal object-layout sizes. No weights are currently published because this repository has not yet committed an empirically calibrated and held-out validated model. The benchmark deliberately reports no guessed estimate in its place.

## Versioning and CI

Every run records the package revision, benchmark schema, dependency versions, profile and runtime. Quick CI is a smoke test and does not treat shared-runner timings as stable regression thresholds. Structural and serialized byte results are deterministic. Full release runs should use the documented Node version on a stable machine, inspect sample variance, compare with the previous saved run, and then run `pnpm bench:readme` to publish selected results.
