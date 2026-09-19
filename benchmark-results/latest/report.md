# Interner benchmark report

Generated from benchmark schema 1.0.0 using profile `full`.

Runtime: Node v26.2.0 (V8 14.6.202.34-node.20), linux/x64.

[Machine-readable results](results.json) | [Summary](summary.json)

## Plots

![Retained heap reduction](plots/retained-size.svg)

![YAML output reduction](plots/yaml-size.svg)

![Intern time](plots/intern-time.svg)

![Scaling](plots/scaling.svg)

![Structural reduction versus retained heap](plots/structural-vs-retained.svg)

![Structural estimate versus retained heap](plots/estimate-vs-retained.svg)

## zod-json-schema

JSON Schema generated from a checked-in Zod source definition using Zod's supported conversion API.

Parameters: `{"fields":96}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,977 | 19 | -1,958 | -99.0% |
| Array nodes | 299 | 6 | -293 | -98.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,393 | 275 | -8,118 | -96.7% |
| Object properties | 6,814 | 159 | -6,655 | -97.7% |
| Array elements | 1,579 | 116 | -1,463 | -92.7% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 3,945 | 133 | -3,812 | -96.6% |
| String code units | 42,187 | 1,284 | -40,903 | -97.0% |
| Numbers | 1,875 | 8 | -1,867 | -99.6% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 298 | 5 | -293 | -98.3% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,276 | 25 | -2,251 | -98.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 188.5 KiB | 188.5 KiB | 188.5 KiB | 3 |
| After | 19.0 KiB | 17.2 KiB | 19.0 KiB | 3 |
| Change | -169.5 KiB | | | -89.9% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 223.2 KiB | 5.7 KiB | -217.5 KiB | -97.5% |
| JSON UTF-8 bytes | 135.1 KiB | 135.1 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 79.3 ms | n/a | n/a |
| YAML serialization time | 12.6 ms | 0.88 ms | -11.70 ms | -93.0% |
| End-to-end YAML time | 12.6 ms | 78.2 ms | 65.7 ms | 522.2% |

## json-schema-bundle

A deterministic bundle of related JSON Schema definitions.

Parameters: `{"definitions":250}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 2,502 | 9 | -2,493 | -99.6% |
| Array nodes | 500 | 2 | -498 | -99.6% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 9,252 | 279 | -8,973 | -97.0% |
| Object properties | 7,752 | 273 | -7,479 | -96.5% |
| Array elements | 1,500 | 6 | -1,494 | -99.6% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 3,751 | 13 | -3,738 | -99.7% |
| String code units | 27,044 | 134 | -26,910 | -99.5% |
| Numbers | 2,500 | 4 | -2,496 | -99.8% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 3,002 | 11 | -2,991 | -99.6% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 159.5 KiB | 159.5 KiB | 159.5 KiB | 3 |
| After | 28.3 KiB | 28.3 KiB | 28.3 KiB | 3 |
| Change | -131.2 KiB | | | -82.3% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 189.4 KiB | 5.4 KiB | -184.0 KiB | -97.2% |
| JSON UTF-8 bytes | 126.2 KiB | 126.2 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 98.6 ms | n/a | n/a |
| YAML serialization time | 13.2 ms | 1.05 ms | -12.12 ms | -92.0% |
| End-to-end YAML time | 13.2 ms | 100.2 ms | 87.0 ms | 660.7% |

## openapi-document

An OpenAPI-like document with repeated parameters, responses and schemas.

Parameters: `{"paths":250}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 5,003 | 20 | -4,983 | -99.6% |
| Array nodes | 500 | 2 | -498 | -99.6% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 12,505 | 295 | -12,210 | -97.6% |
| Object properties | 11,255 | 290 | -10,965 | -97.4% |
| Array elements | 1,250 | 5 | -1,245 | -99.6% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 4,253 | 17 | -4,236 | -99.6% |
| String code units | 32,032 | 142 | -31,890 | -99.6% |
| Numbers | 2,500 | 4 | -2,496 | -99.8% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 250 | 1 | -249 | -99.6% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 5,503 | 22 | -5,481 | -99.6% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 290.8 KiB | 290.8 KiB | 290.8 KiB | 3 |
| After | 34.5 KiB | 34.5 KiB | 34.5 KiB | 3 |
| Change | -256.2 KiB | | | -88.1% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 328.8 KiB | 6.6 KiB | -322.2 KiB | -98.0% |
| JSON UTF-8 bytes | 177.2 KiB | 177.2 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 188.8 ms | n/a | n/a |
| YAML serialization time | 18.8 ms | 1.34 ms | -17.44 ms | -92.9% |
| End-to-end YAML time | 18.8 ms | 188.4 ms | 169.6 ms | 903.2% |

## ast-graph

A generated ESTree-like syntax graph with repeated node shapes.

Parameters: `{"declarations":1000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 6,001 | 3,018 | -2,983 | -49.7% |
| Array nodes | 2,001 | 1,009 | -992 | -49.6% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 18,002 | 10,052 | -7,950 | -44.2% |
| Object properties | 15,002 | 8,044 | -6,958 | -46.4% |
| Array elements | 3,000 | 2,008 | -992 | -33.1% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 9,001 | 5,019 | -3,982 | -44.2% |
| String code units | 97,897 | 60,082 | -37,815 | -38.6% |
| Numbers | 1,000 | 8 | -992 | -99.2% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 8,002 | 4,027 | -3,975 | -49.7% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 398.7 KiB | 398.7 KiB | 398.7 KiB | 3 |
| After | 252.8 KiB | 252.8 KiB | 252.8 KiB | 3 |
| Change | -145.8 KiB | | | -36.6% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 342.7 KiB | 178.7 KiB | -164.0 KiB | -47.9% |
| JSON UTF-8 bytes | 255.8 KiB | 255.8 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 244.8 ms | n/a | n/a |
| YAML serialization time | 23.0 ms | 15.8 ms | -7.23 ms | -31.5% |
| End-to-end YAML time | 23.0 ms | 264.7 ms | 241.8 ms | 1051.8% |

## typescript-source-ast

A portable TypeScript AST parsed from the source of its own fixture module.

Parameters: `{}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 219 | 144 | -75 | -34.2% |
| Array nodes | 219 | 98 | -121 | -55.3% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 747 | 521 | -226 | -30.3% |
| Object properties | 529 | 324 | -205 | -38.8% |
| Array elements | 218 | 197 | -21 | -9.6% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 310 | 180 | -130 | -41.9% |
| String code units | 3,692 | 2,499 | -1,193 | -32.3% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 438 | 242 | -196 | -44.7% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 32.6 KiB | 32.6 KiB | 32.6 KiB | 3 |
| After | 14.4 KiB | 14.4 KiB | 14.4 KiB | 3 |
| Change | -18.2 KiB | | | -55.8% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 19.2 KiB | 13.8 KiB | -5.4 KiB | -28.2% |
| JSON UTF-8 bytes | 9.9 KiB | 9.9 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 12.4 ms | n/a | n/a |
| YAML serialization time | 2.27 ms | 1.91 ms | -0.36 ms | -16.0% |
| End-to-end YAML time | 2.27 ms | 13.0 ms | 10.7 ms | 472.0% |

## configuration-tree

A generated service configuration tree with repeated runtime policies.

Parameters: `{"services":250}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,252 | 7 | -1,245 | -99.4% |
| Array nodes | 250 | 1 | -249 | -99.6% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 3,751 | 265 | -3,486 | -92.9% |
| Object properties | 3,501 | 264 | -3,237 | -92.5% |
| Array elements | 250 | 1 | -249 | -99.6% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 1,750 | 7 | -1,743 | -99.6% |
| String code units | 11,000 | 44 | -10,956 | -99.6% |
| Numbers | 500 | 2 | -498 | -99.6% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 1,502 | 8 | -1,494 | -99.5% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 89.0 KiB | 89.0 KiB | 89.0 KiB | 3 |
| After | 28.4 KiB | 28.4 KiB | 28.4 KiB | 3 |
| Change | -60.6 KiB | | | -68.1% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 68.8 KiB | 5.5 KiB | -63.2 KiB | -92.0% |
| JSON UTF-8 bytes | 57.0 KiB | 57.0 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 51.4 ms | n/a | n/a |
| YAML serialization time | 6.86 ms | 0.79 ms | -6.07 ms | -88.5% |
| End-to-end YAML time | 6.86 ms | 53.7 ms | 46.8 ms | 682.6% |

## message-catalog

A localization catalog with repeated messages, metadata and placeholder definitions.

Parameters: `{"messagesPerLocale":250}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 3,005 | 6 | -2,999 | -99.8% |
| Array nodes | 0 | 0 | 0 | n/a |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 6,004 | 262 | -5,742 | -95.6% |
| Object properties | 6,004 | 262 | -5,742 | -95.6% |
| Array elements | 0 | 0 | 0 | n/a |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 3,000 | 5 | -2,995 | -99.8% |
| String code units | 32,672 | 60 | -32,612 | -99.8% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 3,005 | 6 | -2,999 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 142.3 KiB | 142.3 KiB | 142.3 KiB | 3 |
| After | 27.6 KiB | 27.6 KiB | 27.6 KiB | 3 |
| Change | -114.6 KiB | | | -80.6% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 127.2 KiB | 7.0 KiB | -120.2 KiB | -94.5% |
| JSON UTF-8 bytes | 117.4 KiB | 117.4 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 120.2 ms | n/a | n/a |
| YAML serialization time | 10.1 ms | 0.92 ms | -9.22 ms | -90.9% |
| End-to-end YAML time | 10.1 ms | 122.0 ms | 111.9 ms | 1103.5% |

## language-descriptors

Repeated objects with descriptor flags, accessor descriptors and symbol keys.

Parameters: `{"records":96}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 97 | 2 | -95 | -97.9% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 194 | 99 | -95 | -49.0% |
| Object properties | 98 | 3 | -95 | -96.9% |
| Array elements | 96 | 96 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 96 | 1 | -95 | -99.0% |
| String code units | 960 | 10 | -950 | -99.0% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 1 | 1 | 0 | 0.0% |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 98 | 3 | -95 | -96.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 14.8 KiB | 14.8 KiB | 14.8 KiB | 3 |
| After | 3.1 KiB | 3.1 KiB | 3.1 KiB | 3 |
| Change | -11.7 KiB | | | -79.3% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Intern transformation time | n/a | 11.8 ms | n/a | n/a |

## language-opaque-atoms

Repeated and distinct function and symbol values, including symbol property keys.

Parameters: `{"records":96}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 193 | 98 | -95 | -49.2% |
| Array nodes | 2 | 2 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 581 | 391 | -190 | -32.7% |
| Object properties | 389 | 199 | -190 | -48.8% |
| Array elements | 192 | 192 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 194 | 99 | -95 | -49.0% |
| Functions | 193 | 98 | -95 | -49.2% |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 195 | 100 | -95 | -48.7% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 19.6 KiB | 19.6 KiB | 19.6 KiB | 3 |
| After | 16.1 KiB | 16.1 KiB | 16.1 KiB | 3 |
| Change | -3.4 KiB | | | -17.5% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Intern transformation time | n/a | 9.15 ms | n/a | n/a |

## language-prototypes

Custom and null prototypes, inherited behavior, opaque prototype references and cycles.

Parameters: `{"records":96}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 194 | 4 | -190 | -97.9% |
| Array nodes | 2 | 2 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 486 | 201 | -285 | -58.6% |
| Object properties | 294 | 9 | -285 | -96.9% |
| Array elements | 192 | 192 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 192 | 2 | -190 | -99.0% |
| String code units | 2,880 | 30 | -2,850 | -99.0% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 2 | 2 | 0 | 0.0% |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 1 | 1 | 0 | 0.0% |
| Reference nodes | 196 | 6 | -190 | -96.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 25.7 KiB | 25.7 KiB | 25.7 KiB | 3 |
| After | 3.7 KiB | 3.7 KiB | 3.7 KiB | 3 |
| Change | -22.0 KiB | | | -85.5% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Intern transformation time | n/a | 9.56 ms | n/a | n/a |

## unique-flat

A flat array of unique records.

Parameters: `{"nodes":5000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 5,000 | 5,000 | 0 | 0.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 15,000 | 15,000 | 0 | 0.0% |
| Object properties | 10,000 | 10,000 | 0 | 0.0% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 5,000 | 5,000 | 0 | 0.0% |
| String code units | 48,890 | 48,890 | 0 | 0.0% |
| Numbers | 5,000 | 5,000 | 0 | 0.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 5,001 | 5,001 | 0 | 0.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 389.9 KiB | 389.9 KiB | 389.9 KiB | 3 |
| After | 468.2 KiB | 468.2 KiB | 468.2 KiB | 3 |
| Change | 78.3 KiB | | | 20.1% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 163.8 KiB | 163.8 KiB | 0 B | 0.0% |
| JSON UTF-8 bytes | 173.6 KiB | 173.6 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 190.2 ms | n/a | n/a |
| YAML serialization time | 19.3 ms | 19.0 ms | -0.36 ms | -1.9% |
| End-to-end YAML time | 19.3 ms | 215.8 ms | 196.5 ms | 1016.8% |

## unique-deep

A unique linked object chain.

Parameters: `{"nodes":2500}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 2,501 | 2,501 | 0 | 0.0% |
| Array nodes | 0 | 0 | 0 | n/a |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 7,502 | 7,502 | 0 | 0.0% |
| Object properties | 7,502 | 7,502 | 0 | 0.0% |
| Array elements | 0 | 0 | 0 | n/a |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,501 | 2,501 | 0 | 0.0% |
| String code units | 10,004 | 10,004 | 0 | 0.0% |
| Numbers | 2,501 | 2,501 | 0 | 0.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,501 | 2,501 | 0 | 0.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 117.4 KiB | 117.4 KiB | 117.4 KiB | 3 |
| After | 137.2 KiB | 137.1 KiB | 137.2 KiB | 3 |
| Change | 19.8 KiB | | | 16.9% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Intern transformation time | n/a | 98.0 ms | n/a | n/a |

## unique-wide

A wide object with unique child records.

Parameters: `{"nodes":5000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 5,001 | 5,001 | 0 | 0.0% |
| Array nodes | 0 | 0 | 0 | n/a |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 15,000 | 15,000 | 0 | 0.0% |
| Object properties | 15,000 | 15,000 | 0 | 0.0% |
| Array elements | 0 | 0 | 0 | n/a |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 5,000 | 5,000 | 0 | 0.0% |
| String code units | 48,890 | 48,890 | 0 | 0.0% |
| Numbers | 5,000 | 5,000 | 0 | 0.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 5,001 | 5,001 | 0 | 0.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 542.9 KiB | 542.9 KiB | 542.9 KiB | 3 |
| After | 621.2 KiB | 621.2 KiB | 621.2 KiB | 3 |
| Change | 78.3 KiB | | | 14.4% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 206.7 KiB | 206.7 KiB | 0 B | 0.0% |
| JSON UTF-8 bytes | 221.4 KiB | 221.4 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 194.5 ms | n/a | n/a |
| YAML serialization time | 20.8 ms | 21.0 ms | 0.15 ms | 0.7% |
| End-to-end YAML time | 20.8 ms | 213.6 ms | 192.8 ms | 925.6% |

## duplicate-leaves

Many structurally equal leaf objects.

Parameters: `{"nodes":5000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 5,000 | 1 | -4,999 | -100.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 15,000 | 5,002 | -9,998 | -66.7% |
| Object properties | 10,000 | 2 | -9,998 | -100.0% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 5,000 | 1 | -4,999 | -100.0% |
| String code units | 30,000 | 6 | -29,994 | -100.0% |
| Numbers | 5,000 | 1 | -4,999 | -100.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 5,001 | 2 | -4,999 | -100.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 234.4 KiB | 234.4 KiB | 234.4 KiB | 3 |
| After | 39.4 KiB | 39.4 KiB | 39.4 KiB | 3 |
| Change | -195.0 KiB | | | -83.2% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 146.5 KiB | 44.0 KiB | -102.5 KiB | -70.0% |
| JSON UTF-8 bytes | 156.3 KiB | 156.3 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 188.0 ms | n/a | n/a |
| YAML serialization time | 19.4 ms | 1.44 ms | -17.97 ms | -92.6% |
| End-to-end YAML time | 19.4 ms | 181.3 ms | 161.9 ms | 834.1% |

## duplicate-small-subtrees

Many equal shallow schema fragments.

Parameters: `{"nodes":5000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 20,000 | 4 | -19,996 | -100.0% |
| Array nodes | 5,001 | 2 | -4,999 | -100.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 65,000 | 5,012 | -59,988 | -92.3% |
| Object properties | 50,000 | 10 | -49,990 | -100.0% |
| Array elements | 15,000 | 5,002 | -9,998 | -66.7% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 30,000 | 6 | -29,994 | -100.0% |
| String code units | 185,000 | 37 | -184,963 | -100.0% |
| Numbers | 10,000 | 2 | -9,998 | -100.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 25,001 | 6 | -24,995 | -100.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 1.0 MiB | 1.0 MiB | 1.0 MiB | 3 |
| After | 40.3 KiB | 40.3 KiB | 40.3 KiB | 3 |
| Change | -1014.4 KiB | | | -96.2% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 913.1 KiB | 44.1 KiB | -869.0 KiB | -95.2% |
| JSON UTF-8 bytes | 795.9 KiB | 795.9 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 799.6 ms | n/a | n/a |
| YAML serialization time | 78.9 ms | 1.43 ms | -77.44 ms | -98.2% |
| End-to-end YAML time | 78.9 ms | 787.2 ms | 708.4 ms | 898.1% |

## duplicate-large-subtrees

Many equal nested configuration subtrees.

Parameters: `{"nodes":625}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 5,000 | 7 | -4,993 | -99.9% |
| Array nodes | 626 | 2 | -624 | -99.7% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 15,000 | 645 | -14,355 | -95.7% |
| Object properties | 12,500 | 17 | -12,483 | -99.9% |
| Array elements | 2,500 | 628 | -1,872 | -74.9% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 3,750 | 5 | -3,745 | -99.9% |
| String code units | 24,375 | 33 | -24,342 | -99.9% |
| Numbers | 5,625 | 7 | -5,618 | -99.9% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 5,626 | 9 | -5,617 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 239.3 KiB | 239.3 KiB | 239.3 KiB | 3 |
| After | 7.1 KiB | 7.1 KiB | 7.1 KiB | 3 |
| Change | -232.2 KiB | | | -97.0% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 219.7 KiB | 5.8 KiB | -213.9 KiB | -97.4% |
| JSON UTF-8 bytes | 174.6 KiB | 174.6 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 200.3 ms | n/a | n/a |
| YAML serialization time | 21.3 ms | 0.43 ms | -20.84 ms | -98.0% |
| End-to-end YAML time | 21.3 ms | 195.8 ms | 174.5 ms | 820.0% |

## low-redundancy

A graph with approximately ten percent repeated records.

Parameters: `{"nodes":5000,"redundancy":0.1}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 10,000 | 4,511 | -5,489 | -54.9% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 25,000 | 14,022 | -10,978 | -43.9% |
| Object properties | 20,000 | 9,022 | -10,978 | -54.9% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 10,000 | 4,511 | -5,489 | -54.9% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 5,000 | 10 | -4,990 | -99.8% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 10,001 | 4,512 | -5,489 | -54.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 429.7 KiB | 429.7 KiB | 429.7 KiB | 3 |
| After | 286.2 KiB | 286.2 KiB | 286.2 KiB | 3 |
| Change | -143.6 KiB | | | -33.4% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 271.5 KiB | 136.5 KiB | -135.0 KiB | -49.7% |
| JSON UTF-8 bytes | 252.0 KiB | 252.0 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 388.6 ms | n/a | n/a |
| YAML serialization time | 30.4 ms | 18.6 ms | -11.78 ms | -38.7% |
| End-to-end YAML time | 30.4 ms | 388.5 ms | 358.1 ms | 1177.7% |

## medium-redundancy

A graph with approximately half repeated records.

Parameters: `{"nodes":5000,"redundancy":0.5}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 10,000 | 2,503 | -7,497 | -75.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 25,000 | 10,006 | -14,994 | -60.0% |
| Object properties | 20,000 | 5,006 | -14,994 | -75.0% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 10,000 | 2,503 | -7,497 | -75.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 5,000 | 2 | -4,998 | -100.0% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 10,001 | 2,504 | -7,497 | -75.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 429.7 KiB | 429.7 KiB | 429.7 KiB | 3 |
| After | 176.4 KiB | 176.4 KiB | 176.4 KiB | 3 |
| Change | -253.4 KiB | | | -59.0% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 266.1 KiB | 95.3 KiB | -170.8 KiB | -64.2% |
| JSON UTF-8 bytes | 246.6 KiB | 246.6 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 416.0 ms | n/a | n/a |
| YAML serialization time | 31.1 ms | 15.0 ms | -16.11 ms | -51.8% |
| End-to-end YAML time | 31.1 ms | 387.5 ms | 356.4 ms | 1145.7% |

## high-redundancy

A graph with approximately ninety percent repeated records.

Parameters: `{"nodes":5000,"redundancy":0.9}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 10,000 | 20 | -9,980 | -99.8% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 25,000 | 5,040 | -19,960 | -79.8% |
| Object properties | 20,000 | 40 | -19,960 | -99.8% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 10,000 | 20 | -9,980 | -99.8% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 5,000 | 10 | -4,990 | -99.8% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 10,001 | 21 | -9,980 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 429.7 KiB | 429.7 KiB | 429.7 KiB | 3 |
| After | 40.6 KiB | 40.6 KiB | 40.6 KiB | 3 |
| Change | -389.2 KiB | | | -90.6% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 258.8 KiB | 44.5 KiB | -214.3 KiB | -82.8% |
| JSON UTF-8 bytes | 239.3 KiB | 239.3 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 384.6 ms | n/a | n/a |
| YAML serialization time | 29.5 ms | 1.60 ms | -27.95 ms | -94.6% |
| End-to-end YAML time | 29.5 ms | 366.0 ms | 336.4 ms | 1138.9% |

## already-shared

A source DAG whose repeated positions already share identities.

Parameters: `{"edges":5000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 8 | 7 | -1 | -12.5% |
| Array nodes | 2 | 2 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 5,023 | 5,020 | -3 | -0.1% |
| Object properties | 20 | 17 | -3 | -15.0% |
| Array elements | 5,003 | 5,003 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 6 | 5 | -1 | -16.7% |
| String code units | 39 | 33 | -6 | -15.4% |
| Numbers | 9 | 7 | -2 | -22.2% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 10 | 9 | -1 | -10.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 41.1 KiB | 41.1 KiB | 41.1 KiB | 3 |
| After | 41.3 KiB | 41.3 KiB | 41.3 KiB | 3 |
| Change | 184 B | | | 0.4% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 44.3 KiB | 44.2 KiB | -51 B | -0.1% |
| JSON UTF-8 bytes | 1.4 MiB | 1.4 MiB | 0 B | 0.0% |
| Intern transformation time | n/a | 9.21 ms | n/a | n/a |
| YAML serialization time | 1.23 ms | 1.64 ms | 0.41 ms | 33.1% |
| End-to-end YAML time | 1.23 ms | 10.0 ms | 8.77 ms | 711.4% |

## self-cycles

Independent equivalent self-cycles.

Parameters: `{"nodes":500}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 500 | 1 | -499 | -99.8% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 1,500 | 502 | -998 | -66.5% |
| Object properties | 1,000 | 2 | -998 | -99.8% |
| Array elements | 500 | 500 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 500 | 1 | -499 | -99.8% |
| String code units | 2,000 | 4 | -1,996 | -99.8% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 501 | 2 | -499 | -99.6% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 39.2 KiB | 39.2 KiB | 39.2 KiB | 3 |
| After | 4.2 KiB | 4.2 KiB | 4.2 KiB | 3 |
| Change | -35.0 KiB | | | -89.2% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 20.3 KiB | 4.4 KiB | -15.9 KiB | -78.2% |
| Intern transformation time | n/a | 24.5 ms | n/a | n/a |
| YAML serialization time | 3.93 ms | 0.33 ms | -3.60 ms | -91.6% |
| End-to-end YAML time | 3.93 ms | 24.1 ms | 20.2 ms | 514.3% |

## equivalent-cycles

Many equivalent cyclic components.

Parameters: `{"components":300}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 900 | 1 | -899 | -99.9% |
| Array nodes | 301 | 2 | -299 | -99.3% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 3,000 | 305 | -2,695 | -89.8% |
| Object properties | 1,800 | 2 | -1,798 | -99.9% |
| Array elements | 1,200 | 303 | -897 | -74.8% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 900 | 1 | -899 | -99.9% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 1,201 | 3 | -1,198 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 86.9 KiB | 86.9 KiB | 86.9 KiB | 3 |
| After | 2.7 KiB | 2.7 KiB | 2.7 KiB | 3 |
| Change | -84.2 KiB | | | -96.9% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 42.9 KiB | 2.7 KiB | -40.2 KiB | -93.7% |
| Intern transformation time | n/a | 43.0 ms | n/a | n/a |
| YAML serialization time | 4.26 ms | 0.25 ms | -4.01 ms | -94.1% |
| End-to-end YAML time | 4.26 ms | 41.5 ms | 37.3 ms | 875.1% |

## large-strongly-connected-component

One strongly connected component with repeating local observations.

Parameters: `{"nodes":1000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,000 | 8 | -992 | -99.2% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 3,000 | 1,016 | -1,984 | -66.1% |
| Object properties | 2,000 | 16 | -1,984 | -99.2% |
| Array elements | 1,000 | 1,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 0 | 0 | 0 | n/a |
| String code units | 0 | 0 | 0 | n/a |
| Numbers | 1,000 | 8 | -992 | -99.2% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 1,001 | 9 | -992 | -99.1% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 78.2 KiB | 78.2 KiB | 78.2 KiB | 3 |
| After | 8.5 KiB | 8.5 KiB | 8.5 KiB | 3 |
| Change | -69.7 KiB | | | -89.1% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Intern transformation time | n/a | 44.4 ms | n/a | n/a |

## mixed-cyclic-and-acyclic

Repeated trees connected to equivalent cycles.

Parameters: `{"nodes":500}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 6,500 | 13 | -6,487 | -99.8% |
| Array nodes | 1,001 | 3 | -998 | -99.7% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 19,500 | 540 | -18,960 | -97.2% |
| Object properties | 15,500 | 33 | -15,467 | -99.8% |
| Array elements | 4,000 | 507 | -3,493 | -87.3% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 3,000 | 5 | -2,995 | -99.8% |
| String code units | 19,500 | 33 | -19,467 | -99.8% |
| Numbers | 7,000 | 13 | -6,987 | -99.8% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 7,501 | 16 | -7,485 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 394.7 KiB | 394.7 KiB | 394.7 KiB | 3 |
| After | 7.0 KiB | 7.0 KiB | 7.0 KiB | 3 |
| Change | -387.7 KiB | | | -98.2% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 324.5 KiB | 5.0 KiB | -319.5 KiB | -98.5% |
| Intern transformation time | n/a | 286.5 ms | n/a | n/a |
| YAML serialization time | 24.5 ms | 0.58 ms | -23.89 ms | -97.6% |
| End-to-end YAML time | 24.5 ms | 281.9 ms | 257.4 ms | 1051.7% |

## scaling-duplicate-small-100

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":100,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 400 | 4 | -396 | -99.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 1,000 | 109 | -891 | -89.1% |
| Object properties | 900 | 9 | -891 | -99.0% |
| Array elements | 100 | 100 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 400 | 4 | -396 | -99.0% |
| String code units | 3,000 | 30 | -2,970 | -99.0% |
| Numbers | 200 | 2 | -198 | -99.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 401 | 5 | -396 | -98.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 17.2 KiB | 17.2 KiB | 17.2 KiB | 3 |
| After | 1.9 KiB | 1.9 KiB | 1.9 KiB | 3 |
| Change | -15.3 KiB | | | -88.9% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 15.0 KiB | 1.0 KiB | -14.0 KiB | -93.2% |
| JSON UTF-8 bytes | 13.4 KiB | 13.4 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 20.0 ms | n/a | n/a |
| YAML serialization time | 3.49 ms | 0.32 ms | -3.16 ms | -90.7% |
| End-to-end YAML time | 3.49 ms | 19.1 ms | 15.6 ms | 446.5% |

## scaling-duplicate-small-250

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":250,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,000 | 4 | -996 | -99.6% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 2,500 | 259 | -2,241 | -89.6% |
| Object properties | 2,250 | 9 | -2,241 | -99.6% |
| Array elements | 250 | 250 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 1,000 | 4 | -996 | -99.6% |
| String code units | 7,500 | 30 | -7,470 | -99.6% |
| Numbers | 500 | 2 | -498 | -99.6% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 1,001 | 5 | -996 | -99.5% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 43.0 KiB | 43.0 KiB | 43.0 KiB | 3 |
| After | 3.1 KiB | 3.1 KiB | 3.1 KiB | 3 |
| Change | -39.9 KiB | | | -92.8% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 37.6 KiB | 2.3 KiB | -35.3 KiB | -93.8% |
| JSON UTF-8 bytes | 33.4 KiB | 33.4 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 44.7 ms | n/a | n/a |
| YAML serialization time | 5.08 ms | 0.38 ms | -4.70 ms | -92.6% |
| End-to-end YAML time | 5.08 ms | 42.7 ms | 37.6 ms | 740.8% |

## scaling-duplicate-small-500

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":500,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 2,000 | 4 | -1,996 | -99.8% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 5,000 | 509 | -4,491 | -89.8% |
| Object properties | 4,500 | 9 | -4,491 | -99.8% |
| Array elements | 500 | 500 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 4 | -1,996 | -99.8% |
| String code units | 15,000 | 30 | -14,970 | -99.8% |
| Numbers | 1,000 | 2 | -998 | -99.8% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,001 | 5 | -1,996 | -99.8% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 86.0 KiB | 86.0 KiB | 86.0 KiB | 3 |
| After | 5.0 KiB | 5.0 KiB | 5.0 KiB | 3 |
| Change | -81.0 KiB | | | -94.1% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 75.2 KiB | 4.5 KiB | -70.7 KiB | -94.0% |
| JSON UTF-8 bytes | 66.9 KiB | 66.9 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 84.1 ms | n/a | n/a |
| YAML serialization time | 8.58 ms | 0.45 ms | -8.13 ms | -94.7% |
| End-to-end YAML time | 8.58 ms | 76.4 ms | 67.8 ms | 789.8% |

## scaling-duplicate-small-1000

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":1000,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 4,000 | 4 | -3,996 | -99.9% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 10,000 | 1,009 | -8,991 | -89.9% |
| Object properties | 9,000 | 9 | -8,991 | -99.9% |
| Array elements | 1,000 | 1,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 4,000 | 4 | -3,996 | -99.9% |
| String code units | 30,000 | 30 | -29,970 | -99.9% |
| Numbers | 2,000 | 2 | -1,998 | -99.9% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 4,001 | 5 | -3,996 | -99.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 171.9 KiB | 171.9 KiB | 171.9 KiB | 3 |
| After | 8.9 KiB | 8.9 KiB | 8.9 KiB | 3 |
| Change | -163.0 KiB | | | -94.8% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 150.4 KiB | 8.9 KiB | -141.5 KiB | -94.1% |
| JSON UTF-8 bytes | 133.8 KiB | 133.8 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 153.4 ms | n/a | n/a |
| YAML serialization time | 13.1 ms | 0.54 ms | -12.54 ms | -95.8% |
| End-to-end YAML time | 13.1 ms | 148.6 ms | 135.5 ms | 1036.2% |

## scaling-duplicate-small-2500

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":2500,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 10,000 | 4 | -9,996 | -100.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 25,000 | 2,509 | -22,491 | -90.0% |
| Object properties | 22,500 | 9 | -22,491 | -100.0% |
| Array elements | 2,500 | 2,500 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 10,000 | 4 | -9,996 | -100.0% |
| String code units | 75,000 | 30 | -74,970 | -100.0% |
| Numbers | 5,000 | 2 | -4,998 | -100.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 10,001 | 5 | -9,996 | -100.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 429.7 KiB | 429.7 KiB | 429.7 KiB | 3 |
| After | 20.7 KiB | 20.7 KiB | 20.7 KiB | 3 |
| Change | -409.1 KiB | | | -95.2% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 376.0 KiB | 22.1 KiB | -353.9 KiB | -94.1% |
| JSON UTF-8 bytes | 334.5 KiB | 334.5 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 384.0 ms | n/a | n/a |
| YAML serialization time | 30.5 ms | 1.00 ms | -29.48 ms | -96.7% |
| End-to-end YAML time | 30.5 ms | 372.8 ms | 342.3 ms | 1122.9% |

## scaling-duplicate-small-5000

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":5000,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 20,000 | 4 | -19,996 | -100.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 50,000 | 5,009 | -44,991 | -90.0% |
| Object properties | 45,000 | 9 | -44,991 | -100.0% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 20,000 | 4 | -19,996 | -100.0% |
| String code units | 150,000 | 30 | -149,970 | -100.0% |
| Numbers | 10,000 | 2 | -9,998 | -100.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 20,001 | 5 | -19,996 | -100.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 859.4 KiB | 859.4 KiB | 859.4 KiB | 3 |
| After | 40.2 KiB | 40.2 KiB | 40.2 KiB | 3 |
| Change | -819.2 KiB | | | -95.3% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 752.0 KiB | 44.1 KiB | -707.9 KiB | -94.1% |
| JSON UTF-8 bytes | 668.9 KiB | 668.9 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 822.2 ms | n/a | n/a |
| YAML serialization time | 68.9 ms | 1.54 ms | -67.34 ms | -97.8% |
| End-to-end YAML time | 68.9 ms | 746.7 ms | 677.8 ms | 983.9% |

## scaling-duplicate-small-10000

Parameterized duplicate-small-subtrees scaling fixture.

Parameters: `{"nodes":10000,"scalingFamily":"duplicate-small-subtrees"}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 40,000 | 4 | -39,996 | -100.0% |
| Array nodes | 1 | 1 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 100,000 | 10,009 | -89,991 | -90.0% |
| Object properties | 90,000 | 9 | -89,991 | -100.0% |
| Array elements | 10,000 | 10,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 40,000 | 4 | -39,996 | -100.0% |
| String code units | 300,000 | 30 | -299,970 | -100.0% |
| Numbers | 20,000 | 2 | -19,998 | -100.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 40,001 | 5 | -39,996 | -100.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 1.7 MiB | 1.7 MiB | 1.7 MiB | 3 |
| After | 79.3 KiB | 79.3 KiB | 79.3 KiB | 3 |
| Change | -1.6 MiB | | | -95.4% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 1.5 MiB | 88.0 KiB | -1.4 MiB | -94.1% |
| JSON UTF-8 bytes | 1.3 MiB | 1.3 MiB | 0 B | 0.0% |
| Intern transformation time | n/a | 1622.7 ms | n/a | n/a |
| YAML serialization time | 131.7 ms | 2.47 ms | -129.28 ms | -98.1% |
| End-to-end YAML time | 131.7 ms | 1524.8 ms | 1393.1 ms | 1057.4% |

## seed-mostly-unique

Deterministic property-style graph seed representing mostly unique data.

Parameters: `{"id":"mostly-unique","seed":192837,"shape":"mixed","duplication":0.05,"primitive":"balanced","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 956 | -45 | -4.5% |
| Array nodes | 1,001 | 944 | -57 | -5.7% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 7,695 | -306 | -3.8% |
| Object properties | 3,001 | 2,866 | -135 | -4.5% |
| Array elements | 5,000 | 4,829 | -171 | -3.4% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 1,898 | -102 | -5.1% |
| String code units | 12,000 | 11,388 | -612 | -5.1% |
| Numbers | 2,000 | 1,898 | -102 | -5.1% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 1,900 | -102 | -5.1% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.5 KiB | 351.5 KiB | 351.5 KiB | 3 |
| After | 179.2 KiB | 179.2 KiB | 179.2 KiB | 3 |
| Change | -172.3 KiB | | | -49.0% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 100.1 KiB | 96.9 KiB | -3.3 KiB | -3.3% |
| JSON UTF-8 bytes | 358.6 KiB | 358.6 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 56.4 ms | n/a | n/a |
| YAML serialization time | 9.61 ms | 12.6 ms | 2.98 ms | 31.0% |
| End-to-end YAML time | 9.61 ms | 68.2 ms | 58.6 ms | 610.2% |

## seed-highly-duplicated

Deterministic property-style graph seed representing highly duplicated data.

Parameters: `{"id":"highly-duplicated","seed":918273,"shape":"mixed","duplication":0.85,"primitive":"balanced","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 160 | -841 | -84.0% |
| Array nodes | 1,001 | 135 | -866 | -86.5% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 2,880 | -5,121 | -64.0% |
| Object properties | 3,001 | 478 | -2,523 | -84.1% |
| Array elements | 5,000 | 2,402 | -2,598 | -52.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 293 | -1,707 | -85.4% |
| String code units | 12,000 | 1,758 | -10,242 | -85.4% |
| Numbers | 2,000 | 293 | -1,707 | -85.4% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 295 | -1,707 | -85.3% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.5 KiB | 351.4 KiB | 351.5 KiB | 3 |
| After | 41.2 KiB | 41.2 KiB | 41.2 KiB | 3 |
| Change | -310.3 KiB | | | -88.3% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 84.1 KiB | 32.8 KiB | -51.3 KiB | -60.9% |
| JSON UTF-8 bytes | 206.6 KiB | 206.6 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 50.6 ms | n/a | n/a |
| YAML serialization time | 9.83 ms | 3.03 ms | -6.80 ms | -69.2% |
| End-to-end YAML time | 9.83 ms | 50.4 ms | 40.6 ms | 413.0% |

## seed-deep

Deterministic property-style graph seed representing deep data.

Parameters: `{"id":"deep","seed":41041,"shape":"deep","duplication":0.2,"primitive":"balanced","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 1,001 | 0 | 0.0% |
| Array nodes | 1,001 | 1,001 | 0 | 0.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 8,001 | 0 | 0.0% |
| Object properties | 3,001 | 3,001 | 0 | 0.0% |
| Array elements | 5,000 | 5,000 | 0 | 0.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 2,000 | 0 | 0.0% |
| String code units | 12,000 | 12,000 | 0 | 0.0% |
| Numbers | 2,000 | 2,000 | 0 | 0.0% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 2,002 | 0 | 0.0% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.5 KiB | 351.4 KiB | 351.5 KiB | 3 |
| After | 188.1 KiB | 188.1 KiB | 188.1 KiB | 3 |
| Change | -163.5 KiB | | | -46.5% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| JSON UTF-8 bytes | 50.0 MiB | 50.0 MiB | 0 B | 0.0% |
| Intern transformation time | n/a | 55.2 ms | n/a | n/a |

## seed-wide

Deterministic property-style graph seed representing wide data.

Parameters: `{"id":"wide","seed":88231,"shape":"wide","duplication":0.25,"primitive":"balanced","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 762 | -239 | -23.9% |
| Array nodes | 1,001 | 773 | -228 | -22.8% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 6,600 | -1,401 | -17.5% |
| Object properties | 3,001 | 2,284 | -717 | -23.9% |
| Array elements | 5,000 | 4,316 | -684 | -13.7% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 1,533 | -467 | -23.4% |
| String code units | 12,000 | 9,198 | -2,802 | -23.4% |
| Numbers | 2,000 | 1,533 | -467 | -23.4% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 1,535 | -467 | -23.3% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.5 KiB | 351.5 KiB | 351.5 KiB | 3 |
| After | 148.0 KiB | 148.0 KiB | 148.0 KiB | 3 |
| Change | -203.5 KiB | | | -57.9% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 97.5 KiB | 81.6 KiB | -15.9 KiB | -16.3% |
| JSON UTF-8 bytes | 250.8 KiB | 250.8 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 56.5 ms | n/a | n/a |
| YAML serialization time | 7.23 ms | 8.59 ms | 1.36 ms | 18.9% |
| End-to-end YAML time | 7.23 ms | 59.5 ms | 52.3 ms | 723.6% |

## seed-cyclic

Deterministic property-style graph seed representing cyclic data.

Parameters: `{"id":"cyclic","seed":77191,"shape":"mixed","duplication":0.4,"primitive":"balanced","cyclic":true,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 589 | -412 | -41.2% |
| Array nodes | 1,001 | 620 | -381 | -38.1% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,003 | 5,624 | -2,379 | -29.7% |
| Object properties | 3,002 | 1,766 | -1,236 | -41.2% |
| Array elements | 5,001 | 3,858 | -1,143 | -22.9% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 1,207 | -793 | -39.6% |
| String code units | 12,000 | 7,242 | -4,758 | -39.6% |
| Numbers | 2,000 | 1,207 | -793 | -39.6% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 1,209 | -793 | -39.6% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.8 KiB | 351.8 KiB | 351.8 KiB | 3 |
| After | 120.3 KiB | 120.3 KiB | 120.4 KiB | 3 |
| Change | -231.5 KiB | | | -65.8% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 94.7 KiB | 67.9 KiB | -26.9 KiB | -28.4% |
| Intern transformation time | n/a | 82.2 ms | n/a | n/a |
| YAML serialization time | 13.6 ms | 8.48 ms | -5.15 ms | -37.8% |
| End-to-end YAML time | 13.6 ms | 83.7 ms | 70.1 ms | 514.2% |

## seed-mixed-arrays-objects

Deterministic property-style graph seed representing mixed arrays objects data.

Parameters: `{"id":"mixed-arrays-objects","seed":55661,"shape":"mixed","duplication":0.35,"primitive":"balanced","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 654 | -347 | -34.7% |
| Array nodes | 1,001 | 656 | -345 | -34.5% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 5,925 | -2,076 | -25.9% |
| Object properties | 3,001 | 1,960 | -1,041 | -34.7% |
| Array elements | 5,000 | 3,965 | -1,035 | -20.7% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 2,000 | 1,308 | -692 | -34.6% |
| String code units | 12,000 | 7,848 | -4,152 | -34.6% |
| Numbers | 2,000 | 1,308 | -692 | -34.6% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 1,310 | -692 | -34.6% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 351.4 KiB | 351.4 KiB | 351.5 KiB | 3 |
| After | 128.6 KiB | 128.5 KiB | 128.6 KiB | 3 |
| Change | -222.8 KiB | | | -63.4% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 95.3 KiB | 71.8 KiB | -23.5 KiB | -24.7% |
| JSON UTF-8 bytes | 275.7 KiB | 275.7 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 53.3 ms | n/a | n/a |
| YAML serialization time | 9.94 ms | 9.52 ms | -0.42 ms | -4.2% |
| End-to-end YAML time | 9.94 ms | 57.7 ms | 47.8 ms | 480.4% |

## seed-primitive-heavy

Deterministic property-style graph seed representing primitive heavy data.

Parameters: `{"id":"primitive-heavy","seed":60293,"shape":"wide","duplication":0.2,"primitive":"heavy","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 814 | -187 | -18.7% |
| Array nodes | 3,001 | 2,400 | -601 | -20.0% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 16,001 | 13,235 | -2,766 | -17.3% |
| Object properties | 3,001 | 2,440 | -561 | -18.7% |
| Array elements | 13,000 | 10,795 | -2,205 | -17.0% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 4,000 | 3,212 | -788 | -19.7% |
| String code units | 16,000 | 12,880 | -3,120 | -19.5% |
| Numbers | 2,000 | 1,598 | -402 | -20.1% |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 2,000 | 1,598 | -402 | -20.1% |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 2,000 | 1,598 | -402 | -20.1% |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 4,002 | 3,214 | -788 | -19.7% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 554.6 KiB | 554.5 KiB | 554.6 KiB | 3 |
| After | 317.0 KiB | 317.0 KiB | 317.0 KiB | 3 |
| Change | -237.6 KiB | | | -42.8% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 180.1 KiB | 150.3 KiB | -29.8 KiB | -16.5% |
| JSON UTF-8 bytes | 479.1 KiB | 479.1 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 76.0 ms | n/a | n/a |
| YAML serialization time | 11.4 ms | 11.9 ms | 0.55 ms | 4.8% |
| End-to-end YAML time | 11.4 ms | 86.0 ms | 74.6 ms | 657.0% |

## seed-string-heavy

Deterministic property-style graph seed representing string heavy data.

Parameters: `{"id":"string-heavy","seed":34039,"shape":"wide","duplication":0.45,"primitive":"strings","cyclic":false,"nodes":2000}`

### Structure

| Metric | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| Object nodes | 1,001 | 397 | -604 | -60.3% |
| Array nodes | 1,001 | 386 | -615 | -61.4% |
| Date nodes | 0 | 0 | 0 | n/a |
| RegExp nodes | 0 | 0 | 0 | n/a |
| Edges | 8,001 | 4,344 | -3,657 | -45.7% |
| Object properties | 3,001 | 1,189 | -1,812 | -60.4% |
| Array elements | 5,000 | 3,155 | -1,845 | -36.9% |
| Array holes | 0 | 0 | 0 | n/a |
| String occurrences | 4,000 | 1,562 | -2,438 | -61.0% |
| String code units | 30,185 | 11,845 | -18,340 | -60.8% |
| Numbers | 0 | 0 | 0 | n/a |
| BigInts | 0 | 0 | 0 | n/a |
| Booleans | 0 | 0 | 0 | n/a |
| Symbols | 0 | 0 | 0 | n/a |
| Functions | 0 | 0 | 0 | n/a |
| Nulls | 0 | 0 | 0 | n/a |
| Undefined values | 0 | 0 | 0 | n/a |
| Reference nodes | 2,002 | 783 | -1,219 | -60.9% |

### Retained heap

| State | Median | Minimum | Maximum | Samples |
| --- | ---: | ---: | ---: | ---: |
| Before | 414.0 KiB | 413.9 KiB | 414.0 KiB | 3 |
| After | 107.6 KiB | 107.5 KiB | 107.6 KiB | 3 |
| Change | -306.4 KiB | | | -74.0% |

### Serialization and timing

Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.

| Measurement | Before | After | Absolute delta | Percentage delta |
| --- | ---: | ---: | ---: | ---: |
| YAML UTF-8 bytes | 107.1 KiB | 57.9 KiB | -49.2 KiB | -45.9% |
| JSON UTF-8 bytes | 311.0 KiB | 311.0 KiB | 0 B | 0.0% |
| Intern transformation time | n/a | 54.3 ms | n/a | n/a |
| YAML serialization time | 8.36 ms | 6.64 ms | -1.71 ms | -20.5% |
| End-to-end YAML time | 8.36 ms | 55.0 ms | 46.6 ms | 558.0% |

