# interner

`interner` creates a quotienting clone of a JavaScript value graph with maximal sharing of equivalent subvalues. By default, symbol and function leaves are forwarded unchanged; extensions may give them domain-specific graph semantics.

```ts
import { intern } from 'interner'
const input = { a: { type: 'string' }, b: { type: 'string' } }
const output = intern(input)
output !== input // true
output.a === output.b // true
```

Repetitive generated schemas are a natural use case: YAML serializers can emit aliases, graph serializers can emit references, and consumers can memoize by identity. This package is a value transformation, not a YAML library or a global intern pool. It has no runtime dependencies. Requires Node.js 22 or later; ESM only.

## Guarantees

- A fresh result, with no source graph nodes reused and no intentional input mutation. Unmatched opaque symbols and functions are forwarded by identity.
- Preservation of the supported observations, including property order, array holes and the distinction between `0` and `-0`.
- Maximal sharing, including for cyclic graphs, not best-effort deduplication.
- No reconstructed identities are pooled across calls; unmatched input symbols and functions are forwarded on every call.

Do not modify the reachable input during a call. Output remains mutable. Identity and identity-derived observations are deliberately not preserved: changing `output.a.type` also changes `output.b.type` above. Treat the result as a value when relying on preservation. No implicit freezing occurs.

## Mental model

Objects are graph nodes. Ordered properties or extension edges connect nodes; primitive and built-in state are local observations. Symbols and functions are opaque identity-bearing leaves by default, or graph nodes when claimed by an extension. Equivalent nodes become one representative in the quotient graph. For trees and DAGs this is bottom-up hash-consing. For cycles it is bisimulation minimization: a homogeneous two-node cycle can become a self-cycle, because its permitted observations are identical.

See [MODEL.md](MODEL.md) for the normative supported domain and equivalence laws.

## Supported values

| Kind                                             | Preserved observations                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| undefined, null, boolean, string, number, bigint | SameValue, including NaN and signed zero                                                                           |
| Symbol                                           | Original identity by default; value, property key, edge, extension atom or extension node                          |
| Plain object                                     | Ordered own enumerable string and symbol data properties with normal descriptors                                   |
| Array                                            | Native Array brand and exact local `Array.prototype`; length, holes, ordered own string and symbol data properties |
| Date                                             | Native time value, including invalid dates                                                                         |
| RegExp                                           | Source and flags; `lastIndex` resets to zero like structured clone                                                 |
| Function                                         | Original identity by default; opaque forwarding or domain-specific extension node                                  |

Built-ins require exact local standard prototypes. Arrays additionally require the native Array brand, checked with `Array.isArray`, and writable standard `length`. Date has no own properties; RegExp has only normal `lastIndex`. Abnormal descriptors and structural accessors are rejected with `TypeError`. String and symbol keys receive the same normal data-descriptor validation and reconstruction; symbol-key identity and `Reflect.ownKeys` order are preserved. No user structural getters are evaluated by ordinary built-in capture. Proxies are outside the contract and cannot reliably be detected; traps may run.

Classes, null or foreign prototypes, boxed values, errors, promises, weak collections, buffers, views, shared memory and host objects are unsupported by default. “Unsupported” means that capture throws `TypeError` at the root or any reachable edge. A built-in adapter or extension failing to match is different: dispatch continues, and throws only when no adapter accepts the object. Map and Set are intentionally excluded: merging equivalent keys or elements can lose entries. Explicit extensions can supply semantics for otherwise unsupported objects.

Symbols and functions use identity forwarding as their default semantics. When no extension matches, the original value is returned at the root and installed unchanged on every corresponding output edge. The same identity can permit containing nodes to merge; distinct identities keep otherwise equivalent containing nodes separate. Function own properties, prototypes, closures and behavior are not inspected by default.

Extensions are consulted before that fallback. A matching extension can describe a function or symbol with domain-specific atoms and edges, causing distinct inputs to merge and producing a fresh function or symbol per quotient class. Functions and symbols may also be extension atoms, where they retain opaque identity semantics.

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

Atoms are intrinsic observations, including symbols and functions compared by identity. Edges are ordered recursive values, including primitives, functions and cycles. Description tuples must be dense arrays. Capture finishes before allocation. One value is allocated per equivalence class, and all values exist before hydration begins. Hydration receives canonical output edges and must mutate only its target, regardless of hydration order. The opaque handles do not register anything globally.

Definitions must be deterministic, input-preserving, complete, position-stable and traversal-independent. Allocation must return fresh matching instances, without hidden input references. Reconstructed descriptions must retain the same atoms and equivalent edges. Do not mutate the registry from callbacks. Undetectable violations invalidate the extension's guarantees; detectable malformed descriptors or allocations throw `TypeError`. Callback exceptions propagate unchanged.

Standard object built-ins take precedence, then the first matching extension in array order wins. Functions and symbols reach extensions before their opaque forwarding fallback. Each handle defines a distinct kind; names are diagnostic, not kind identifiers. There are no `equals` or `hash` callbacks: interner owns equivalence, collisions, cycles and maximality. See the callback JSDoc and [extension laws](MODEL.md#extensions).

## Complexity and performance

For V nodes, E edges and S observation bytes, expected DAG time and working space are O(V + E + S). Cyclic graphs currently use simple whole-graph refinement, with up to O(V * (V + E + S)) expected time and O(V + E + S) space. Extension callback costs are additional. Hash collisions never establish equality; full signatures are compared. Traversal is iterative, including deeply nested inputs.

The benchmark suite measures transformation time, exact structural reduction, V8 retained size through memlab, and YAML serialization effects. On included generated-schema fixtures, interning can substantially reduce distinct reachable objects, retained heap and YAML output. The exact benefit depends on structural duplication in the input.

<!-- benchmark:start -->

Published profile: `quick`, Node 26. Exact results depend on the input and runtime.

| Fixture               | Reference nodes | V8 retained heap | YAML bytes | Intern time |
| --------------------- | --------------: | ---------------: | ---------: | ----------: |
| zod-json-schema       |          -94.3% |           -77.2% |     -94.3% |     9.78 ms |
| openapi-document      |          -95.9% |           -62.6% |     -94.9% |     2.16 ms |
| typescript-source-ast |          -44.7% |           -55.8% |     -28.2% |     3.26 ms |
| configuration-tree    |          -94.5% |           -48.1% |     -88.6% |     0.67 ms |

![V8 retained heap](benchmark-results/latest/plots/retained-size.svg)

![YAML output size](benchmark-results/latest/plots/yaml-size.svg)

![Intern scaling](benchmark-results/latest/plots/scaling.svg)

[Methodology](BENCHMARKS.md) | [Full report](benchmark-results/latest/report.md) | [Machine-readable results](benchmark-results/latest/results.json) | [Fixture sources](bench/fixtures)
<!-- benchmark:end -->

See the [benchmark methodology](BENCHMARKS.md), [generated report](benchmark-results/latest/report.md), [machine-readable results](benchmark-results/latest/results.json), and [fixture sources](bench/fixtures).

## Structured clone and YAML

The explicit model is structured-clone-like, not a wrapper around the host clone implementation. Tests compare the common domain against native `structuredClone` using an independent identity-erasing oracle. Symbols and functions are outside that common domain: native structured clone rejects their values, while `interner` applies matching extensions or forwards them. Unlike structured clone, arbitrary class semantics and malformed structural shapes are not silently flattened.

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
