# `interner`: implementation plan

## 1. Purpose

`interner` transforms a supported JavaScript value graph into fresh reconstructed structural nodes with maximal sharing of equivalent subvalues. Opaque preserved references, including ordinary-object prototypes, are intentionally retained from the input.

The motivating example is repetitive generated data:

```ts
const input = {
  first: {
    type: "string",
    minLength: 1,
  },
  second: {
    type: "string",
    minLength: 1,
  },
};

const output = intern(input);

output !== input;
output.first === output.second;
```

This is useful when a downstream consumer can exploit reference identity, for example a YAML serializer emitting anchors, a graph serializer emitting references, or an algorithm memoizing work by identity.

`interner` is not a YAML library, a deep-equality library, an immutable data library, or a global intern pool.

Its operation is a value transformation.

## 2. Semantic model

Model every supported input as a finite directed graph.

Object-like values are nodes. Properties and other structural relationships are labeled edges. Primitive state and standard built-in state are local observations attached to nodes.

Define an equivalence relation `≈` over nodes.

Two nodes are equivalent when:

1. they have the same supported semantic kind;
2. all non-reference intrinsic observations are equal;
3. they expose the same ordered/labeled structural edges;
4. corresponding edge targets are themselves equivalent.

For cyclic graphs, `≈` is defined coinductively as the greatest relation satisfying those conditions. In graph terminology, it is bisimulation equivalence for the supported semantic graph.

`intern(x)` computes the quotient of the graph by that equivalence relation.

If:

```text
A ≈ B ≈ C
```

the result contains one representative node for that equivalence class.

For acyclic data this reduces to ordinary structural interning or hash-consing.

For cyclic data it is graph minimization under bisimulation.

## 3. Core invariant

For every supported input `x`:

```ts
const y = intern(x);
```

the following must hold.

### 3.1 Observational preservation

`y` has the same permitted observations as a structured clone of `x`.

Conceptually:

```text
intern(x) ≈ structuredClone(x)
```

for the supported value domain.

The equivalence relation deliberately excludes observations derived from object identity.

Examples of excluded observations include:

```ts
a === b
Object.is(a, b)
```

when `a` and `b` are objects.

It also excludes observations whose result depends on distinguishing object identities indirectly, such as using objects as identity-sensitive keys or membership tokens.

The specification should define this semantically rather than maintain an exhaustive list:

> An identity-derived observation is an observation whose result can differ solely because two references denote the same object instead of distinct otherwise equivalent objects.

Primitive identity is not excluded. For example:

```ts
Object.is(0, -0)
```

remains a meaningful observation and must be preserved.

### 3.2 Maximality

For every pair of distinct mergeable nodes `a` and `b` reachable from `y`:

```text
a ≉ b
```

There must not remain two distinct nodes that are equivalent under the supported semantic model.

This makes maximal sharing contractual rather than best-effort.

### 3.3 Freshness

No supported object node in the result is an object node from the input graph.

`intern()` is a cloning transformation, not an in-place deduplicator.

There is no promise that:

```ts
intern(x) === intern(x)
```

or that corresponding nodes returned by separate calls share identity.

There is no global intern pool.

### 3.4 Input immutability

`intern()` does not intentionally mutate the input graph.

The caller must not mutate values reachable from the input while `intern()` is executing.

### 3.5 Mutation after return

The returned graph is mutable unless the represented type itself says otherwise.

Mutation is outside the observational equivalence guarantee because newly introduced sharing becomes visible through mutation:

```ts
const y = intern({
  a: { n: 1 },
  b: { n: 1 },
});

y.a === y.b;

y.a.n = 2;
y.b.n === 2;
```

This is expected behavior.

`interner` must not freeze values implicitly. Freezing would itself change observable semantics.

## 4. Supported value model for version 1

Start deliberately narrower than the universe of structured-cloneable JavaScript values.

Built-in support should exist only where `interner` can state an exact standard semantic model without guessing what an application-defined object means.

Version 1 should support:

| Kind                  | Semantic observations                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `undefined`           | exact primitive value                                                                           |
| `null`                | exact primitive value                                                                           |
| `boolean`             | exact primitive value                                                                           |
| `string`              | exact primitive value                                                                           |
| `number`              | SameValue semantics, including `NaN` and `-0`                                                   |
| `bigint`              | exact numeric value                                                                             |
| ordinary object       | opaque prototype identity; ordered own property descriptors and recursively observed data values or accessor functions |
| `Array`               | length, holes, ordered own elements/properties and descriptors, recursively observed edges      |
| `Date`                | standard Date brand and time value                                                              |
| `RegExp`              | standard RegExp brand, source and flags, with structured-clone-compatible `lastIndex` semantics |

Ordinary object support accepts any prototype, including null, custom and foreign-realm prototypes. The prototype is compared by reference identity, retained on allocation, and never traversed, cloned, validated or interned. Arrays, Date and RegExp retain their exact-local-prototype requirements.

Every own string or symbol property participates through its complete descriptor. Data descriptors contribute their flags and value; accessor descriptors contribute their flags and getter/setter references without invoking either function.

Arrays receive analogous validation while treating `length` and holes according to Array semantics.

The important constraint is that `interner` must never decide:

> This unfamiliar object looks record-like, so comparing its enumerable properties is probably safe.

It is not safe according to the package philosophy. That decision belongs to an extension supplied by the application.

## 5. Explicitly unsupported in version 1

Reject rather than guess for:

- application-defined class instances;
- promises;
- proxies;
- weak collections;
- host objects;
- DOM objects;
- `SharedArrayBuffer`;
- transferable semantics;
- `Map`;
- `Set`;
- boxed primitive objects;
- errors;
- `ArrayBuffer`, typed arrays and `DataView`, until their complete observation model is specified and tested.

Some of these are standard JavaScript structures and may become built-ins later.

"Standard" is necessary for built-in support, not sufficient.

In particular, `Map` and `Set` should not be rushed into version 1. Maximal quotienting can cause formerly distinct equivalent object keys or elements to become one identity. A JavaScript `Map` cannot represent two entries whose canonicalized keys have become the same key, and choosing how to resolve such entries would introduce a policy.

Do not add them until there is a precise, non-arbitrary contract.

Proxies require a special warning. JavaScript provides no reliable general-purpose operation for detecting a proxy without interacting with it. Passing a proxy is outside the supported contract, and the implementation cannot promise that traps will never execute before the value is rejected.

## 6. Relationship to `structuredClone`

The contract should be described as structured-clone-like rather than implemented as "whatever the host's `structuredClone()` happens to do."

For the supported domain, define `interner`'s value model explicitly and require it to agree with `structuredClone` on ordinary observations.

This gives the package:

- a portable specification;
- an independent test oracle;
- freedom to fuse cloning and interning rather than materialize a full structured clone first;
- protection from host-specific structured-clone extensions.

Native `structuredClone()` should be used in tests as a differential oracle where applicable, not as the normative definition of every supported behavior.

## 7. Public API

Keep the runtime API to two operations:

```ts
export function intern<const T>(
  value: T,
  options?: InternOptions,
): T;

export function defineExtension<
  T extends object,
  const A extends readonly Atom[],
  const E extends readonly unknown[],
>(
  extension: ExtensionDefinition<T, A, E>,
): Extension;
```

Supporting types:

```ts
export type Atom =
  | undefined
  | null
  | boolean
  | number
  | bigint
  | string;

export interface InternOptions {
  readonly extensions?: readonly Extension[];
}

export interface ExtensionDefinition<
  T extends object,
  A extends readonly Atom[],
  E extends readonly unknown[],
> {
  readonly name: string;

  readonly match: (value: object) => value is T;

  readonly describe: (
    value: T,
  ) => {
    readonly atoms: A;
    readonly edges: E;
  };

  readonly allocate: (
    atoms: A,
  ) => T;

  readonly hydrate: (
    target: T,
    edges: E,
  ) => void;
}
```

`Extension` itself should be an opaque exported type produced by `defineExtension()`.

That gives extension authors strict inference without exposing the erased representation used internally.

The package should not expose:

```ts
equals(a, b)
hash(value)
canonicalKey(value)
```

as semantic extension points.

## 8. Why extensions describe structure instead of equality

An extension tells `interner` what a custom value means structurally.

It does not implement the interning algorithm.

For example:

```ts
const urlExtension = defineExtension<
  URL,
  readonly [href: string],
  readonly []
>({
  name: "URL",

  match: (value): value is URL =>
    value instanceof URL,

  describe: value => ({
    atoms: [value.href],
    edges: [],
  }),

  allocate: ([href]) =>
    new URL(href),

  hydrate: () => {},
});
```

Then:

```ts
const output = intern(input, {
  extensions: [urlExtension],
});
```

The extension states:

```text
URL semantic state = href
```

`interner` still owns:

- equality;
- hashing;
- collision handling;
- cycle handling;
- graph minimization;
- maximality;
- allocation of equivalence classes.

This prevents extension authors from accidentally violating laws such as:

```text
equals(a, b) => hash(a) === hash(b)
```

and keeps cyclic equality entirely inside `interner`.

## 9. Extension graph model

Each extension describes a node using two things.

`atoms` are intrinsic primitive state required to distinguish and allocate the object.

`edges` are semantic references to other values.

For example, a custom graph node might use:

```ts
class Node {
  constructor(
    public readonly name: string,
    public next: Node | null = null,
  ) {}
}
```

with:

```ts
const nodeExtension = defineExtension<
  Node,
  readonly [name: string],
  readonly [next: Node | null]
>({
  name: "Node",

  match: (value): value is Node =>
    value instanceof Node,

  describe: value => ({
    atoms: [value.name],
    edges: [value.next],
  }),

  allocate: ([name]) =>
    new Node(name),

  hydrate: (target, [next]) => {
    target.next = next;
  },
});
```

The separation between allocation and hydration permits cycles.

All representatives are allocated before their canonical edges are installed.

## 10. Extension laws

The extension contract must be documented as laws, not merely callback signatures.

For every value accepted by an extension:

```text
match(value) = true
```

the extension promises:

1. `describe()` is deterministic for an unmodified input.
2. `describe()` does not mutate its input.
3. every non-identity observation that should affect equivalence is represented by either `atoms` or `edges`;
4. atom positions have stable meaning;
5. edge positions have stable meaning;
6. `allocate(atoms)` returns a fresh instance represented by the extension;
7. `allocate()` does not retain references into the original input graph;
8. `hydrate()` mutates only its `target`;
9. `hydrate()` may assume all canonical target objects have already been allocated;
10. after allocation and hydration, describing the reconstructed value yields the same atoms and equivalent edges;
11. callback behavior does not depend on traversal order;
12. callbacks do not mutate the extension registry while an `intern()` operation is executing.

An extension that omits observable state is explicitly declaring that state irrelevant to its value semantics.

If an extension violates these laws, guarantees for values handled by that extension do not apply.

The core guarantees for built-in values remain defined independently.

## 11. Extension dispatch

Built-in standard semantics take precedence.

Extensions are consulted only for values not accepted by a built-in adapter.

For extensions:

```ts
extensions: [a, b, c]
```

test them in array order and select the first matching extension.

Document this order as operational API behavior.

Adding a new built-in adapter later can therefore conflict with an extension that previously claimed that object kind. Treat expansion of built-in support as semver-sensitive. If it can steal values from previously valid extensions, make it a major-version change.

Do not casually make support additions in minor releases.

## 12. Internal representation

Separate graph capture from graph minimization.

Each source object receives an internal numeric node index through a `WeakMap<object, NodeId>`.

A captured node contains conceptually:

```ts
interface Node {
  readonly kind: Kind;
  readonly atoms: readonly Atom[];
  readonly edges: readonly ValueRef[];
}
```

where:

```ts
type ValueRef =
  | {
      readonly type: "atom";
      readonly value: Atom;
    }
  | {
      readonly type: "node";
      readonly id: NodeId;
    };
```

The actual implementation may use compact arrays rather than allocating these tagged objects.

The important architectural rule is that graph capture defines semantics and graph minimization knows nothing about JavaScript object types.

Built-in adapters and extensions both compile values into the same internal graph language.

## 13. Object semantics

For plain objects, property order is observable and therefore semantic.

These must not be merged:

```ts
const a = {};
a.x = 1;
a.y = 2;

const b = {};
b.y = 2;
b.x = 1;
```

because:

```ts
Object.keys(a)
Object.keys(b)
```

can differ.

The internal representation must therefore retain key order.

Keys form intrinsic labels associated with corresponding value edges.

## 14. Array semantics

Array holes must remain distinct from explicit `undefined`.

These are not equivalent:

```ts
const a = new Array(1);
const b = [undefined];
```

because:

```ts
0 in a;
0 in b;
```

differs.

Array length, its writable flag, hole positions, key order, every own property descriptor, and corresponding value or accessor-function edges must all participate in equivalence.

## 15. Primitive equality

Use SameValue semantics for atoms.

In particular:

```ts
Object.is(NaN, NaN) === true
Object.is(0, -0) === false
```

The internal atom encoding used for hashing must preserve this distinction.

Never rely directly on JavaScript `Map<number, ...>` semantics for structural atom identity because `Map` uses SameValueZero and therefore does not distinguish `0` from `-0`.

## 16. Graph minimization algorithm

Implement correctness first, with an acyclic fast path.

### Phase A: capture

Traverse the supported value graph once.

Use source identity only to detect repeated references and cycles during capture.

Produce the semantic graph.

Complexity:

```text
O(V + E)
```

apart from extension callback costs.

### Phase B: detect cycles

Run a standard graph traversal or strongly connected component computation.

If the graph is acyclic, use bottom-up hash-consing.

If it contains cycles, use partition refinement.

### Phase C1: acyclic fast path

Process nodes in reverse topological order.

A node signature consists of:

```text
kind
atoms
ordered edge labels/positions
primitive edge values
canonical class IDs of object-valued edges
```

Look up the signature in an intern table.

Equal signatures receive the same class.

Hash collisions must always be resolved by full signature comparison.

Hash equality is an optimization, never semantic evidence.

Expected complexity:

```text
O(V + E)
```

with normal hash-table assumptions.

This path should cover essentially all JSON Schema and YAML-oriented usage.

### Phase C2: cyclic path

Use a correct partition-refinement algorithm.

Start by partitioning nodes according to their local observations:

```text
kind
atoms
edge arity/labels
primitive-valued edges
```

Repeatedly refine partitions according to the current partitions of object-valued edge targets.

Stop when the partition is stable.

For a finite deterministic labeled graph, the stable partition gives the required bisimulation classes.

The first implementation may use a straightforward refinement algorithm with a documented higher worst-case cost.

Do not compromise semantic maximality merely to claim linear complexity.

A more sophisticated worklist or Paige-Tarjan-style refinement can replace it later without changing the public contract.

### Phase D: reconstruct

Allocate exactly one output representative per equivalence class.

Allocation occurs before edge hydration so cycles can be reconstructed.

Then hydrate all edges using the canonical representatives of their target classes.

The reconstruction phase is:

```text
O(Vq + Eq)
```

where `Vq` and `Eq` refer to the quotient graph.

## 17. Hashing

Hashing is strictly an internal acceleration mechanism.

Implement a collision-safe structural hash over:

```text
kind
atoms
edge labels
primitive edge values
class IDs
```

Never use the hash itself as equality.

Create a canonical primitive encoding that distinguishes:

```text
undefined
null
true
false
NaN
+0
-0
Infinity
-Infinity
finite numbers
bigints
strings
```

No hash function or canonical serialization format becomes public API.

Changing the internal hash algorithm must not alter results.

## 18. Determinism

The quotient semantics must not depend on traversal order, source allocation order, hash seed, or hash collisions.

Object identity of the newly allocated representatives is intentionally unspecified.

Observable property order and other supported structural order remain specified.

Tests should deliberately randomize source allocation and traversal opportunities to verify this separation.

## 19. TypeScript configuration

Use strict TypeScript from the first commit.

Recommended compiler settings include:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true,
    "verbatimModuleSyntax": true,
    "declaration": true
  }
}
```

Do not weaken types inside the implementation merely because extension dispatch requires erasure.

`defineExtension()` should be the single boundary where a strongly typed user extension is converted into the internal erased representation.

Keep that erasure private and aggressively runtime-check the descriptor returned by an extension.

Avoid `any` in exported declarations.

Use `unknown` at untrusted boundaries.

## 20. Testing philosophy

Tests must be generated from the semantic invariants.

Do not build confidence by accumulating examples such as:

```text
works for nested arrays
works for three identical objects
works for self-cycle
works for Date
```

Examples are useful as regressions and documentation, but they are not the core correctness strategy.

The core suite should ask:

> What observations does the specification say must survive, and what graph property does maximality require?

Then test those properties systematically.

## 21. Independent test model

Create a deliberately slow reference implementation used only in tests.

It must not reuse:

- production hashing;
- production partition code;
- production node signatures;
- production graph reconstruction.

For small generated graphs, compute bisimulation equivalence using pair elimination.

Conceptually:

1. begin with every pair of nodes whose local observations are compatible;
2. repeatedly remove a pair when any corresponding edge points to a pair no longer considered equivalent;
3. continue until stable;
4. the remaining relation is the reference equivalence relation.

This is allowed to be quadratic or cubic because generated oracle graphs remain small.

The production implementation and the test oracle should reach the same equivalence classes by materially different algorithms.

## 22. Property-based graph generation

Use `fast-check` or an equivalent property-testing library.

Generate an abstract semantic graph first, then materialize it into JavaScript.

The generator should vary dimensions rather than contain hand-picked cases:

- graph size;
- fanout;
- duplicate frequency;
- cycles;
- self-cycles;
- mutually recursive cycles;
- graph depth;
- primitive values;
- `NaN`, infinities, `0` and `-0`;
- property ordering;
- array holes;
- shared source references;
- structurally equal but source-distinct nodes;
- almost-equal nodes differing by one observation;
- built-in semantic kinds;
- extension semantic kinds.

This lets tests reason about the intended graph independently of incidental JavaScript construction.

## 23. Core test properties

For every generated supported graph, assert all of the following.

### Preservation

The result and reference clone model are equivalent under the independent observation relation:

```text
intern(x) ≈ cloneModel(x)
```

### Maximality

For every pair of distinct reachable quotient nodes:

```text
a ≉ b
```

according to the independent oracle.

### No incorrect merges

Whenever the reference oracle says:

```text
a ≉ b
```

production output must not represent the corresponding equivalence classes with the same node.

### Completeness of merging

Whenever the reference oracle says:

```text
a ≈ b
```

their occurrences in the quotient must resolve to the same representative.

### Input preservation

Snapshot all permitted observations of the source before the call and verify they are unchanged afterward.

### Freshness

No result object is a source object.

### Idempotence of the quotient

Given:

```ts
const a = intern(x);
const b = intern(a);
```

`a` and `b` are observationally equivalent and contain the same number of equivalence classes.

The operation need not preserve identities across the two calls.

### Allocation invariance

Materialize the same abstract input graph with different concrete source identities and construction orders.

The quotient graphs must be isomorphic under the semantic model.

### Replacement invariance

Replace any source subgraph with a freshly allocated equivalent subgraph.

The quotient must remain semantically identical.

### Sensitivity

Change exactly one permitted observation.

When that observation distinguishes two nodes under the reference model, production interning must no longer merge them.

This property is particularly important because it proves that observations have not accidentally been omitted from signatures.

## 24. Observation suites by built-in kind

Maintain one explicit observation definition per built-in semantic kind.

For a plain object, test:

```text
kind
property count
property order
property names
recursive property values
```

For an array, test:

```text
Array brand
length
hole presence
own-key order
extra supported string properties
recursive element/property values
```

For `Date`:

```text
Date brand
time value under SameValue
```

For `RegExp`:

```text
RegExp brand
source
flags
structured-clone-compatible lastIndex state
```

For primitives:

```text
type
SameValue
```

When adding a built-in type, the first required artifact is its observation specification.

Only then write its adapter.

This prevents support from growing through isolated test cases.

## 25. Differential testing against native `structuredClone`

For every generated value in the common supported domain:

```ts
const expected = structuredClone(input);
const actual = intern(input);
```

Compare them using the independent identity-erasing observation oracle.

Do not use `assert.deepStrictEqual()` as the semantic oracle because conventional deep comparators can themselves impose alias-topology requirements.

Native structured clone is a secondary differential check, not the only specification.

Run this suite in every supported JavaScript runtime.

## 26. Cyclic correctness suite

Property generation must deliberately include cycles from the beginning.

In particular, verify cases where graph topology differs but observations do not.

For example, a one-node cycle:

```text
A -> A
```

and a two-node homogeneous cycle:

```text
B -> C -> B
```

are bisimilar under the identity-erasing model.

The quotient should therefore be capable of reducing the second graph to one representative node.

Do not special-case this exact example in implementation tests. It should fall naturally out of generated cyclic graphs and the independent reference relation.

Keep a few such examples only as readable regression tests.

## 27. Extension conformance testing

Test extensions with the same invariant machinery as built-ins.

Create test-only extensions covering:

```text
no edges
one edge
multiple edges
self-reference
mutual cycles
distinct atoms
equivalent atoms
deeply equivalent descendants
```

Verify dispatch order and built-in precedence.

Verify that callback execution obeys the documented lifecycle:

```text
match
describe
allocate
hydrate
```

with all representatives allocated before hydration begins.

Test malformed extensions separately:

- wrong atom values;
- non-array descriptors;
- `allocate()` returning a primitive;
- `hydrate()` throwing;
- inconsistent `match()`;
- mutation of input during `describe()`.

The package may reject detectable contract violations. It cannot prove semantic correctness of arbitrary callbacks.

## 28. Unsupported-value testing

Generate unsupported shapes by category rather than accumulating random examples.

For each unsupported semantic category, verify a predictable failure.

Errors should identify:

```text
the unsupported kind
a useful path or node location when practical
```

Do not make exact prose error messages part of the API unless necessary.

Tests should assert error class/category and structured information if such information is exposed.

Do not promise reliable rejection behavior for proxies beyond documenting that they are unsupported.

## 29. Mutation testing

Run mutation testing over the graph capture, primitive comparison, partitioning and reconstruction code.

This is particularly valuable for conditions such as:

```text
property order
hole detection
-0 handling
edge count
partition equality
hash collision checks
```

The property suite should kill mutations that remove or invert these observations.

A surviving mutation is evidence that the test model has failed to encode part of the semantic contract.

Mutation testing can run in a slower CI job rather than on every local test invocation.

## 30. Integration tests

Keep integrations thin.

For YAML, have one test proving that a serializer capable of emitting aliases can exploit the result:

```ts
const output = intern(schema);
const yaml = stringify(output);
```

and repeated structures become aliases.

Do not assert exact anchor names unless the YAML package explicitly guarantees them.

Do not use YAML output as evidence that `interner` itself is correct.

Likewise, test serialization or memory-oriented consumers only as integration examples.

## 31. Benchmarks

Benchmarks are not correctness tests.

Create separate benchmarks for:

```text
large unique tree
large highly duplicated tree
deep tree
wide tree
generated JSON Schema
acyclic repeated subgraphs
cyclic graph
```

Measure:

```text
wall-clock time
peak or retained memory where measurable
source nodes
quotient nodes
compression ratio
```

Compare against:

```text
structuredClone only
intern
YAML stringify without interning
intern + YAML stringify
```

Do not promise that `intern()` always reduces total work or serialized byte size.

Its guarantee is graph minimization under its equivalence relation.

## 32. Operational JSDoc

JSDoc should describe runtime behavior, not repeat TypeScript types.

The JSDoc for `intern()` must state:

- that it returns a fresh quotienting clone;
- that input is not intentionally mutated;
- the supported value domain;
- that equivalent subvalues are maximally shared;
- that identity-derived observations are intentionally not preserved;
- that mutation of the returned graph may reveal sharing;
- that identities are not shared across calls;
- that extensions supply semantics only for otherwise unsupported values;
- what happens on unsupported input;
- callback error propagation;
- expected acyclic and cyclic complexity characteristics.

The JSDoc for `defineExtension()` must state:

- that it registers semantic structure rather than equality;
- the meaning of atoms and edges;
- callback lifecycle;
- allocation-before-hydration behavior;
- extension laws;
- built-in precedence;
- that malformed or semantically inconsistent extensions invalidate guarantees for handled values.

Each callback should document exactly what may already have happened and what it may rely upon.

For example, `hydrate()` should say:

> Called exactly once for each output equivalence class handled by this extension, after all output representatives have been allocated. `edges` contains canonicalized output values. The callback must mutate only `target` and must not rely on hydration order.

That is operational documentation.

## 33. README structure

The README should explain the model rather than merely advertise deduplication.

Use this progression:

1. `interner` in one sentence.
2. Five-line example showing `a === b` after interning.
3. YAML/schema motivation.
4. What the operation guarantees.
5. Identity and mutation caveat.
6. Graph quotient mental model.
7. Why this is hash-consing for acyclic values and bisimulation minimization for cyclic values.
8. Supported values table.
9. Unsupported values and rationale.
10. Extension example.
11. Why there is no `equals` or `hash` callback.
12. Complexity and performance.
13. Relationship to `structuredClone`.
14. YAML integration example.
15. FAQ.

The README should explicitly answer:

> Why doesn't `interner` inspect arbitrary class instances?

Because properties alone are not a definition of an application's object semantics. `interner` fully specifies ordinary own-property and opaque-prototype treatment, but an extension is needed when inherited behavior itself needs domain-specific semantics.

> Why aren't mutation semantics preserved?

Because sharing is the purpose of the transformation. Mutation is an identity-revealing operation.

> Why not use deep equality?

Because the problem is graph equivalence and quotienting, including cycles, not merely answering whether two roots compare equal.

> Why not maintain a global pool?

Because that changes object lifetime, introduces garbage-collection complexity, and creates cross-call identity semantics that are unnecessary for the transformation.

> Does this produce the smallest YAML?

No. It produces a maximally shared value graph. Deciding whether a YAML serializer should express every shared node as an anchor is a separate representation problem.

> Is maximal sharing best-effort?

No. Within the supported semantic model it is part of the contract.

## 34. Source organization

Keep semantic layers visibly separate:

```text
src/
  index.ts
  types.ts
  builtins/
    array.ts
    date.ts
    object.ts
    regexp.ts
  graph/
    capture.ts
    model.ts
    acyclic.ts
    refine.ts
    reconstruct.ts
  extension/
    define.ts
    runtime.ts

test/
  reference/
    capture.ts
    equivalence.ts
    quotient.ts
  generators/
    graph.ts
    materialize.ts
  properties/
    preservation.test.ts
    maximality.test.ts
    freshness.test.ts
    metamorphic.test.ts
    extensions.test.ts
  builtins/
  unsupported/
  integration/
  regression/
```

Do not export implementation modules.

The graph layer should have no knowledge of `Date`, `RegExp`, Zod, YAML, or user classes.

## 35. Continuous integration

Run at minimum:

```text
TypeScript typecheck
unit tests
property tests with deterministic recorded seed on failure
lint
package build
package export smoke test
```

Run broader jobs for:

```text
multiple supported Node versions
browser runtime if browser support is claimed
mutation tests
benchmarks without pass/fail performance thresholds initially
```

When a property test fails, print and persist the minimized `fast-check` counterexample and seed so the exact graph becomes reproducible.

## 36. Versioning policy

Treat semantic guarantees as the package's primary API.

Changes to any of these are breaking:

```text
equivalence relation
supported observations
maximality
built-in dispatch precedence
extension lifecycle
mutation/freshness guarantees
```

Internal hashing, graph algorithms, allocation order and representative choice are not API.

Adding support for a previously unsupported built-in may be breaking if an extension could previously claim it.

Document this from version 1 so optimization does not accidentally turn into semantic drift.

## 37. Implementation order

Implement in this order:

1. Write `MODEL.md` containing the formal supported-domain and equivalence contract.
2. Write the independent test graph model and slow bisimulation oracle.
3. Write property generators and get the oracle testing itself on known mathematical cases.
4. Define the public TypeScript API and extension laws.
5. Implement graph capture for primitives, plain objects and arrays.
6. Implement acyclic hash-consing.
7. Satisfy preservation, maximality, freshness and metamorphic properties for generated DAGs.
8. Implement cyclic partition refinement.
9. Satisfy the same properties for arbitrary generated finite graphs.
10. Add `Date` and `RegExp` only after their observation suites are written.
11. Implement `defineExtension()`, allocation and hydration.
12. Run the entire invariant suite through custom extension nodes.
13. Add unsupported-value validation.
14. Add native `structuredClone` differential tests.
15. Add YAML integration tests.
16. Add benchmarks.
17. Write JSDoc from the already-tested operational contracts.
18. Write the README from `MODEL.md`, using the motivating schema/YAML example.
19. Run mutation testing and close every unexplained surviving mutation in semantic code.
20. Publish only after the tests demonstrate maximality independently of the production algorithm.

## 38. Definition of done

Version 1 is ready when all of these statements are defensible:

> For every value in the documented built-in domain, `intern()` returns fresh reconstructed structural nodes preserving every documented non-identity observation. Opaque preserved references, including prototypes, are intentionally excluded from whole-graph freshness.

> Every pair of mergeable equivalent nodes in the result has been coalesced.

> Cycles are part of the semantic model, not an unsupported edge case.

> Arbitrary objects receive no inferred semantics.

> Application-defined semantics enter only through an explicit extension.

> Extensions describe observations and graph structure rather than supplying equality or hashing.

> The correctness suite derives from those observations and uses an independent equivalence algorithm.

> YAML is a motivating consumer, not part of the abstraction.

That gives `interner` a small surface with unusually strong semantics: the package can remain tiny because almost all of its complexity lives where it belongs, in the specification, oracle, and guarantees rather than in configuration knobs.
