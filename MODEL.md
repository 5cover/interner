# Value model, version 1

`intern` returns a quotienting clone of a finite supported graph. Every reconstructed graph node is fresh, while unmatched opaque symbol and function leaves are forwarded unchanged. All equivalent reachable graph nodes are represented by exactly one output value. There is no global pool. Input observations are not intentionally mutated.

## Domain and observations

The public `Atom` domain contains undefined, null, booleans, strings, numbers, bigints, symbols and functions. Atom equality is SameValue (`Object.is`), including equal NaNs, distinct positive and negative zero, symbol identity and function identity. Under default semantics, symbols and functions are opaque leaves rather than graph nodes. Their original identities are forwarded unchanged and their internal state is not inspected.

Extensions may override that default for matching symbols or functions. A claimed value becomes a semantic graph node described by the extension, participates in quotienting, and is reconstructed through `allocate()` and `hydrate()`. An unmatched symbol or function falls back to opaque identity forwarding. Functions used as extension atoms remain opaque identity observations; an extension must describe a function as a node to assign it structural semantics.

Built-in objects must have their exact local standard prototype. Cross-realm objects and subclasses are not built-ins. Supported built-ins are:

| Kind   | Observations and accepted shape                                                                                                                                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Object | Exact `Object.prototype`; ordered own string and symbol keys and their values; every property enumerable, writable, configurable and data-only                                                                                            |
| Array  | Native Array brand (`Array.isArray(value)`) and exact local `Array.prototype`; length, holes, ordered own string and symbol keys and values; normal data descriptors, with the standard non-enumerable, non-configurable, writable length |
| Date   | Exact `Date.prototype`, valid native brand; SameValue time, including invalid dates; no own properties                                                                                                                                    |
| RegExp | Exact `RegExp.prototype`, valid native brand; source and standard flags; only the normal own `lastIndex` data property, whose value is ignored and resets to zero                                                                         |

Non-extensible containers with otherwise normal descriptors are accepted; extensibility is normalized, as with structured clone. Frozen or sealed populated containers generally fail descriptor validation. Built-in structural accessors, abnormal descriptors and extra Date/RegExp properties are rejected, not silently discarded. String and symbol properties undergo the same data-descriptor validation and reconstruction. Symbol keys retain their original identity. A malformed built-in candidate cannot fall through to an extension. Array holes are distinct from present undefined properties. Keys such as `__proto__` are ordinary data. `Reflect.ownKeys` order, including symbol-key order after string keys, is semantic.

### Unsupported input and adapter dispatch

In this model, **unsupported input** has one operational meaning: if capture reaches an unsupported value, `intern()` throws `TypeError`; it never returns that value unchanged, retains it as an opaque reference, or merely declines to merge it. This applies at the root and at every reachable edge. Detectable malformed built-in shapes are also unsupported input and throw `TypeError`. Functions and symbols are supported either through a matching extension or through opaque fallback semantics, so this rule does not apply to them.

Adapter dispatch has a separate meaning. A built-in adapter or extension may simply **not accept** a value. That is not a result and does not itself throw: capture continues through the remaining adapters. Standard object built-ins are checked first. Extensions are then checked in option order for other objects, functions and symbols. For an unmatched function or symbol, capture applies opaque forwarding. If an unmatched object has no built-in semantics, it is unsupported input and `intern()` throws `TypeError`. Other primitives already have intrinsic atom semantics and are not offered to extensions. Proxies are outside the contract: portable JavaScript cannot detect them reliably, and traps may run or a proxy may go undetected.

## Equivalence and quotient

A node consists of its semantic kind, an ordered atom tuple and ordered edges. Each edge targets an atom, an opaque function, or a node. Property labels are part of the atom tuple, including symbol keys by identity. Two nodes are equivalent exactly when their kinds and atoms agree and corresponding edges contain SameValue atoms, the same unclaimed function object, or equivalent nodes. Distinct unmatched symbols and functions are never equivalent. Extension-claimed symbols and functions use the extension's described atoms and edges instead, so distinct inputs may become equivalent. Node equivalence is the greatest such relation (bisimulation), not equality of alias topology. In particular homogeneous cycles of different lengths can be equivalent.

The output preserves all these observations and contains no distinct equivalent nodes. No output node is an input node. Unmatched forwarded functions and symbols are leaves, not nodes, and preserve their input identity. Extension-claimed functions and symbols are nodes and therefore receive one fresh allocation per quotient class. All representatives are allocated before any edges are installed. Allocation and representative order are unspecified.

Identity-derived observations are those that can change solely because references denote one object rather than distinct equivalent objects. These observations, including identity-sensitive collection membership and subsequent mutation, are excluded for graph nodes. Primitive SameValue, symbol identity and forwarded function identity are not excluded. Outputs are mutable, not frozen; new sharing is visible through mutation. Separate calls never share a pool, although both calls forward the same input symbols and functions. Callers must not mutate the traversed input graph during the call; state reachable only through a function's own properties is not traversed.

## Extensions

`defineExtension` captures a definition and returns an opaque handle, not a global registration. Standard object built-ins take precedence. Otherwise the first matching handle in `options.extensions` wins, including before function and symbol fallback semantics. Distinct handles are distinct semantic kinds even when names are equal. The registry is snapshotted per call.

`match` and `describe` run during capture, once per visited candidate as applicable. `describe` returns actual, dense arrays `atoms` and `edges`. Atoms must belong to the public `Atom` domain; edge values undergo ordinary capture. These arrays are copied before subsequent callbacks. `allocate` runs once per quotient class; `hydrate` runs once per quotient class after all allocations, receiving canonical output edges. Callback exceptions propagate unchanged. Detectable malformed definitions, descriptors, allocations and unsupported inputs throw `TypeError` with a node location when available. Exact error prose is not API.

Extension authors promise:

1. Deterministic, input-preserving descriptions and stable atom/edge positions.
2. All relevant non-identity observations are represented.
3. Allocation returns a fresh matching value of the same category, retains no input references and represents the supplied atoms.
4. Hydration mutates only its target, relies on no hydration order, and results in the described atoms and equivalent edges.
5. Callbacks do not depend on traversal order or mutate the registry.

The runtime checks array shape, atom membership, allocation category, source reuse, duplicate allocations and matching allocated values. Object extensions must allocate objects, function extensions functions, and symbol extensions symbols. It cannot prove arbitrary callback laws or detect all concealed references or mutations. Violating these laws invalidates guarantees for values handled by that extension.

## Algorithms and compatibility

Capture and cycle detection are iterative. DAGs use bottom-up collision-safe hash-consing, expected O(V + E + S) time and space including observation size S. Cyclic graphs use whole-graph partition refinement, at most V rounds and O(V * (V + E + S)) expected worst-case time, O(V + E + S) working space. Hash collisions always undergo full signature comparison. Reconstruction uses one allocation per class. Hashes, traversal and representative choice are private.

Native structured clone is a differential oracle for the common domain, not the definition. Functions and symbols are deliberately outside that common domain: native structured clone rejects their values, while `intern()` either applies an extension or forwards them as opaque leaves. No host-specific support is inferred. Map and Set need an explicit future policy because merging keys can change cardinality or overwrite values.

Changes to observations, equivalence, maximality, freshness, extension lifecycle or dispatch are breaking changes. Adding built-in support is semver-sensitive because it can claim values previously handled by extensions. Runtime support is Node.js 22 and later; browsers are not currently a tested support promise.
