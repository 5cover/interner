# Mutation review

Reviewed on 2026-09-18 with Node 26.2.0 and Stryker 10.0.0. The second full run produced 405 mutants: 355 killed, 31 timed out, 19 survived, zero uncovered and zero errors. Mutation score: 95.31%.

The first run exposed gaps in symbol descriptor rejection, ordinary object `length` observations, malformed extension validation, useful error locations and the DAG fast path. Dedicated regressions now kill those mutations. The oracle generator also now accounts for Date normalization of negative zero and always records deterministic failure seeds.

## Reviewed survivors

These are equivalent under the public contract, not unexplained missing assertions. The IDs identify the report from this run; IDs and source lines are not stable API. Use `pnpm mutate:audit` after rerunning to review the current report.

| File                                 | Mutant IDs              | Explanation                                                                                                                                                                                                  |
| ------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| builtins/date.ts, builtins/regexp.ts | 15, 134                 | Adding the same constant primitive edge to every node of one kind changes no equivalence classes. These leaf adapters do not hydrate edges.                                                                  |
| builtins/regexp.ts                   | 119                     | The separate own `lastIndex` descriptor check and own-key count of one already imply that the sole key is `lastIndex`.                                                                                       |
| graph/acyclic.ts                     | 239                     | A dummy string parent produces an unused named NaN property on the pending-count array, never a numeric node or queue entry. All real parents are still processed.                                           |
| graph/acyclic.ts                     | 272                     | Preallocating the classes array versus growing it by indexed assignments changes no populated entries.                                                                                                       |
| graph/capture.ts                     | 286                     | Null was already accepted by the preceding atom branch; this later null check is defensive.                                                                                                                  |
| graph/reconstruct.ts                 | 346                     | Choosing the last representative instead of the first is explicitly unspecified and preserves semantics.                                                                                                     |
| graph/reconstruct.ts                 | 351, 352, 353, 356, 359 | Built-ins always allocate objects and the extension boundary already validates allocations. Weakening this additional internal guard or its otherwise unreachable diagnostic does not affect the public API. |
| graph/refine.ts                      | 371                     | Starting without the initial local classes still computes them in the first loop round, then refines normally. This adds one round but does not change the fixed point.                                      |
| graph/signature.ts                   | 383                     | Testing positive instead of negative zero swaps the two private encodings. They remain distinct, so SameValue behavior is unchanged.                                                                         |
| graph/signature.ts                   | 384, 392, 394           | Each mutation renames one private tag to the empty string without colliding with any other encoding. Tests intentionally do not prescribe private byte strings.                                              |
| graph/signature.ts                   | 397                     | One extra hash round changes bucket selection, not equality: full signatures still resolve collisions. The hash function is not public API.                                                                  |
| graph/signature.ts                   | 402                     | A dummy string bucket entry has no matching `key`, so lookup skips it; real entries are unchanged.                                                                                                           |

No mutations are excluded from instrumentation to inflate the score. Timeouts include broken traversal termination and mutations that route the 20,000-node deep DAG into repeated refinement. They are reported separately from assertion failures; a timeout is not a proof of an observational mismatch.

## Reproduction and maintenance

```sh
pnpm mutate
pnpm mutate:audit
```

The HTML and JSON reports are in `reports/mutation`. CI preserves them as artifacts. A 95% score floor catches aggregate regressions, but is not a substitute for reviewing every new survivor. Update this review when semantic code or tests change. Do not assert exact hashes, representative selection or error prose merely to kill equivalent mutants.

The final ordinary test suite additionally exercises floating-point atoms and generated single-observation sensitivity. A separate run used 3,000 cases per property with seed 7183 and passed. These additions do not alter production code or the explanations above. Local validation used Node 26; Node 22 and 24 are configured in CI but were not downloaded or run locally.
