# interner

`interner` creates a fresh clone of a JavaScript value graph with maximal sharing of equivalent subvalues.

```ts
import { intern } from 'interner'
const input = { a: { type: 'string' }, b: { type: 'string' } }
const output = intern(input)
output !== input // true
output.a === output.b // true
```

Repetitive generated schemas are a natural use case: YAML serializers can emit aliases, graph serializers can emit references, and consumers can memoize by identity. This package is a value transformation, not a YAML library or a global intern pool. It has no runtime dependencies. Requires Node.js 22 or later; ESM only.

## Guarantees

- A fresh result, with no source objects reused and no intentional input mutation.
- Preservation of the supported observations, including property order, array holes and the distinction between `0` and `-0`.
- Maximal sharing, including for cyclic graphs, not best-effort deduplication.
- No shared identities across calls.

Do not modify the reachable input during a call. Output remains mutable. Identity and identity-derived observations are deliberately not preserved: changing `output.a.type` also changes `output.b.type` above. Treat the result as a value when relying on preservation. No implicit freezing occurs.

## Mental model

Objects are graph nodes. Ordered properties or extension edges connect nodes; primitive and built-in state are local observations. Equivalent nodes become one representative in the quotient graph. For trees and DAGs this is bottom-up hash-consing. For cycles it is bisimulation minimization: a homogeneous two-node cycle can become a self-cycle, because its permitted observations are identical.

See [MODEL.md](MODEL.md) for the normative supported domain and equivalence laws.

## Supported values

| Kind                                             | Preserved observations                                                      |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| undefined, null, boolean, string, number, bigint | SameValue, including NaN and signed zero                                    |
| Plain object                                     | Ordered own enumerable string data properties with normal descriptors       |
| Array                                            | Length, holes, ordered own elements and extra normal string data properties |
| Date                                             | Native time value, including invalid dates                                  |
| RegExp                                           | Source and flags; `lastIndex` resets to zero like structured clone          |

Built-ins require exact local standard prototypes. Arrays require writable standard `length`. Date has no own properties; RegExp has only normal `lastIndex`. Abnormal descriptors, structural accessors and symbol keys are rejected with `TypeError`. No user structural getters are evaluated by ordinary built-in capture. Proxies are outside the contract and cannot reliably be detected; traps may run.

Classes, null or foreign prototypes, functions, symbols, boxed values, errors, promises, weak collections, buffers, views, shared memory and host objects are unsupported by default. Map and Set are intentionally excluded: merging equivalent keys or elements can lose entries. Explicit extensions can supply semantics for otherwise unsupported objects, but not functions or symbols.

## Extensions

Only `intern` and `defineExtension` are runtime exports. Supporting types are `Atom`, `Extension`, `ExtensionDefinition` and `InternOptions`.

```ts
import { defineExtension, intern } from 'interner'

const urlExtension = defineExtension<URL, readonly [href: string], readonly []>({
  name: 'URL',
  match: (value): value is URL => value instanceof URL,
  describe: value => ({ atoms: [value.href], edges: [] }),
  allocate: ([href]) => new URL(href),
  hydrate: () => {},
})

const urls = intern([new URL('https://example.org'), new URL('https://example.org')], {
  extensions: [urlExtension],
})
urls[0] === urls[1] // true
```

Atoms are intrinsic primitive observations. Edges are ordered recursive values, including primitives and cycles. Description tuples must be dense arrays. Capture finishes before allocation. One instance is allocated per equivalence class, and all instances exist before hydration begins. Hydration receives canonical output edges and must mutate only its target, regardless of hydration order. The opaque handles do not register anything globally.

Definitions must be deterministic, input-preserving, complete, position-stable and traversal-independent. Allocation must return fresh matching instances, without hidden input references. Reconstructed descriptions must retain the same atoms and equivalent edges. Do not mutate the registry from callbacks. Undetectable violations invalidate the extension's guarantees; detectable malformed descriptors or allocations throw `TypeError`. Callback exceptions propagate unchanged.

Built-ins take precedence, then the first matching extension in array order wins. Each handle defines a distinct kind; names are diagnostic, not kind identifiers. There are no `equals` or `hash` callbacks: interner owns equivalence, collisions, cycles and maximality. See the callback JSDoc and [extension laws](MODEL.md#extensions).

## Complexity and performance

For V nodes, E edges and S observation bytes, expected DAG time and working space are O(V + E + S). Cyclic graphs currently use simple whole-graph refinement, with up to O(V * (V + E + S)) expected time and O(V + E + S) space. Extension callback costs are additional. Hash collisions never establish equality; full signatures are compared. Traversal is iterative, including deeply nested inputs.

The benchmark suite measures transformation time, exact structural reduction, V8 retained size through memlab, and YAML serialization effects. On included generated-schema fixtures, interning can substantially reduce distinct reachable objects, retained heap and YAML output. The exact benefit depends on structural duplication in the input.

<!-- benchmark:start -->

Published profile: `quick`, Node 26. Exact results depend on the input and runtime.

| Fixture            | Reference nodes | V8 retained heap | YAML bytes | Intern time |
| ------------------ | --------------: | ---------------: | ---------: | ----------: |
| zod-json-schema    |          -94.3% |           -77.2% |     -94.5% |     8.25 ms |
| openapi-document   |          -95.9% |           -62.2% |     -95.2% |     1.89 ms |
| configuration-tree |          -94.5% |           -46.9% |     -89.6% |     0.61 ms |

![V8 retained heap](benchmark-results/latest/plots/retained-size.svg)

![YAML output size](benchmark-results/latest/plots/yaml-size.svg)

![Intern scaling](benchmark-results/latest/plots/scaling.svg)

[Methodology](BENCHMARKS.md) | [Full report](benchmark-results/latest/report.md) | [Machine-readable results](benchmark-results/latest/results.json) | [Fixture sources](bench/fixtures)
<!-- benchmark:end -->

See the [benchmark methodology](BENCHMARKS.md), [generated report](benchmark-results/latest/report.md), [machine-readable results](benchmark-results/latest/results.json), and [fixture sources](bench/fixtures).

## Structured clone and YAML

The explicit model is structured-clone-like, not a wrapper around the host clone implementation. Tests compare the common domain against native `structuredClone` using an independent identity-erasing oracle. Unlike structured clone, arbitrary class semantics and malformed structural shapes are not silently flattened.

```ts
import { stringify } from 'yaml' // separate consumer dependency
import { intern } from 'interner'

const schema = { first: { type: 'string' }, second: { type: 'string' } }
console.log(stringify(intern(schema))) // serializer may use anchors and aliases
```

## Development

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm mutate
pnpm bench
pnpm bench:full
```

The property suite generates abstract semantic graphs, materializes them and checks against an independent pair-elimination bisimulation oracle. It verifies preservation, exact merging, maximality, freshness, input preservation, idempotence, allocation and replacement invariance. Failures persist minimized counterexamples and seed/path in `reports/counterexamples`. Replay with `FC_PROPERTY=... FC_SEED=... FC_PATH=... pnpm test`; `FC_RUNS` changes the run count. `FC_PROPERTY` selects the failed property so its shrink path is not applied to unrelated generators. `pnpm mutate:audit` lists surviving mutations from the latest JSON report for review. See [the mutation review](MUTATION_REVIEW.md) for the measured baseline and explanations of equivalent survivors.

CI checks Node 22, 24 and 26; scheduled/manual jobs run mutation tests and benchmarks. Browser compatibility is not currently a tested support promise.

## FAQ

**Why not inspect arbitrary classes?** Enumerable properties are not a definition of application semantics. An explicit extension must supply that definition.

**Why aren't mutation semantics preserved?** Sharing is the purpose of the transformation. Mutation reveals identity.

**Why not deep equality?** The task is quotienting a graph, including cycles, not merely comparing two roots.

**Why no global pool?** It changes object lifetime, complicates garbage collection and creates unnecessary cross-call identity semantics.

**Does this produce the smallest YAML?** No. It produces a maximally shared graph; anchor selection is a separate serializer decision.

**Is maximal sharing best-effort?** No. It is contractual within the supported model.

**What changes are breaking?** Equivalence, observations, maximality, freshness, dispatch and extension lifecycle. New built-ins can steal values from extensions, so built-in expansion is semver-sensitive. Internal hashing and representative choice are not public API.
