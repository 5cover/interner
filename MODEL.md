# Value model, version 1

`intern` returns a fresh quotienting clone of a finite supported graph. All equivalent reachable object nodes are represented by exactly one output object. There is no global pool. Input observations are not intentionally mutated.

## Domain and observations

Atoms are undefined, null, booleans, strings, numbers and bigints. Atom equality is SameValue (`Object.is`), including equal NaNs and distinct positive and negative zero. Functions and symbols are not atoms. A function value, whether the root or reachable through an edge, is unsupported: `intern()` throws `TypeError`. Functions are not offered to extensions, including callable objects with ordinary own properties, because version 1 gives functions no structural semantics.

Built-in objects must have their exact local standard prototype. Cross-realm objects and subclasses are not built-ins. Supported built-ins are:

| Kind   | Observations and accepted shape                                                                                                                                                                                         |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Object | Exact `Object.prototype`; ordered own string keys and their values; every property enumerable, writable, configurable and data-only                                                                                     |
| Array  | Native Array brand (`Array.isArray(value)`) and exact local `Array.prototype`; length, holes, ordered own keys and values; normal data descriptors, with the standard non-enumerable, non-configurable, writable length |
| Date   | Exact `Date.prototype`, valid native brand; SameValue time, including invalid dates; no own properties                                                                                                                  |
| RegExp | Exact `RegExp.prototype`, valid native brand; source and standard flags; only the normal own `lastIndex` data property, whose value is ignored and resets to zero                                                       |

Non-extensible containers with otherwise normal descriptors are accepted; extensibility is normalized, as with structured clone. Frozen or sealed populated containers generally fail descriptor validation. Built-in structural accessors, symbol keys, abnormal descriptors and extra Date/RegExp properties are rejected, not silently discarded. A malformed built-in candidate cannot fall through to an extension. Array holes are distinct from present undefined properties. Keys such as `__proto__` are ordinary data. Property enumeration order is semantic.

### Unsupported input and adapter dispatch

In this model, **unsupported input** has one operational meaning: if capture reaches an unsupported value, `intern()` throws `TypeError`; it never returns that value unchanged, retains it as an opaque reference, or merely declines to merge it. This applies at the root and at every reachable edge. Detectable malformed built-in shapes are also unsupported input and throw `TypeError`.

Adapter dispatch has a separate meaning. A built-in adapter or extension may simply **not accept** an object. That is not a result and does not itself throw: capture continues through the remaining adapters. Built-ins are checked first, then extensions in option order. If no adapter accepts the object, it is unsupported input and `intern()` throws `TypeError`. An extension may give an otherwise unsupported **object** semantics, but cannot receive functions or symbols. Proxies are outside the contract: portable JavaScript cannot detect them reliably, and traps may run or a proxy may go undetected.

## Equivalence and quotient

A node consists of its semantic kind, an ordered atom tuple and ordered edges. Each edge targets either an atom or a node. Property labels are part of the atom tuple. Two nodes are equivalent exactly when their kinds and atoms agree and corresponding edges contain SameValue atoms or equivalent nodes. This is the greatest such relation (bisimulation), not equality of alias topology. In particular homogeneous cycles of different lengths can be equivalent.

The output preserves all these observations and contains no distinct equivalent nodes. No output node is an input node. All representatives are allocated before any edges are installed. Allocation and representative order are unspecified.

Identity-derived observations are those that can change solely because references denote one object rather than distinct equivalent objects. These observations, including identity-sensitive collection membership and subsequent mutation, are excluded. Primitive SameValue is not excluded. Outputs are mutable, not frozen; new sharing is visible through mutation. Separate calls never share a pool. Callers must not mutate the reachable input during the call.

## Extensions

`defineExtension` captures a definition and returns an opaque handle, not a global registration. Built-ins take precedence. Otherwise the first matching handle in `options.extensions` wins. Distinct handles are distinct semantic kinds even when names are equal. The registry is snapshotted per call.

`match` and `describe` run during capture, once per visited object as applicable. `describe` returns actual, dense arrays `atoms` and `edges`. Atoms must belong to the primitive domain; edge values undergo ordinary capture. These arrays are copied before subsequent callbacks. `allocate` runs once per quotient class; `hydrate` runs once per quotient class after all allocations, receiving canonical output edges. Callback exceptions propagate unchanged. Detectable malformed definitions, descriptors, allocations and unsupported inputs throw `TypeError` with a node location when available. Exact error prose is not API.

Extension authors promise:

1. Deterministic, input-preserving descriptions and stable atom/edge positions.
2. All relevant non-identity observations are represented.
3. Allocation returns a fresh matching object, retains no input references and represents the supplied atoms.
4. Hydration mutates only its target, relies on no hydration order, and results in the described atoms and equivalent edges.
5. Callbacks do not depend on traversal order or mutate the registry.

The runtime checks array shape, atom membership, object allocation, source reuse, duplicate allocations and matching allocated instances. It cannot prove arbitrary callback laws or detect all concealed references or mutations. Violating these laws invalidates guarantees for values handled by that extension.

## Algorithms and compatibility

Capture and cycle detection are iterative. DAGs use bottom-up collision-safe hash-consing, expected O(V + E + S) time and space including observation size S. Cyclic graphs use whole-graph partition refinement, at most V rounds and O(V * (V + E + S)) expected worst-case time, O(V + E + S) working space. Hash collisions always undergo full signature comparison. Reconstruction uses one allocation per class. Hashes, traversal and representative choice are private.

Native structured clone is a differential oracle for the common domain, not the definition. No host-specific support is inferred. Map and Set need an explicit future policy because merging keys can change cardinality or overwrite values.

Changes to observations, equivalence, maximality, freshness, extension lifecycle or dispatch are breaking changes. Adding built-in support is semver-sensitive because it can claim values previously handled by extensions. Runtime support is Node.js 22 and later; browsers are not currently a tested support promise.
