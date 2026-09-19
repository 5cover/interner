export const BENCHMARK_SCHEMA_VERSION = '1.0.0'

export type BenchmarkFamily = 'synthetic' | 'test-derived' | 'application' | 'calibration'
export type BenchmarkParameters = Readonly<Record<string, string | number | boolean>>

export interface FixtureCapabilities {
  readonly yaml: boolean
  readonly json: boolean
}

export interface BenchmarkFixture {
  readonly id: string
  readonly family: BenchmarkFamily
  readonly description: string
  readonly parameters?: BenchmarkParameters
  readonly capabilities: FixtureCapabilities
  readonly create: () => unknown
}

export interface StructuralMetrics {
  readonly objectNodes: number
  readonly arrayNodes: number
  readonly dateNodes: number
  readonly regexpNodes: number
  readonly edges: number
  readonly objectProperties: number
  readonly arrayElements: number
  readonly arrayHoles: number
  readonly strings: number
  readonly stringCodeUnits: number
  readonly numbers: number
  readonly bigints: number
  readonly booleans: number
  readonly nulls: number
  readonly undefineds: number
  readonly totalReferenceNodes: number
}

export interface TimingMetrics {
  readonly medianMilliseconds: number
  readonly minimumMilliseconds: number
  readonly maximumMilliseconds: number
  readonly samplesMilliseconds: readonly number[]
}

export interface RetainedHeapMetrics {
  readonly beforeBytes: number | null
  readonly afterBytes: number | null
  readonly beforeSamplesBytes: readonly number[]
  readonly afterSamplesBytes: readonly number[]
  readonly beforeMinimumBytes: number | null
  readonly beforeMaximumBytes: number | null
  readonly afterMinimumBytes: number | null
  readonly afterMaximumBytes: number | null
}

export interface SerializationMetrics {
  readonly beforeBytes: number
  readonly afterBytes: number
}

export interface BenchmarkEnvironment {
  readonly node: string
  readonly nodeMajor: number
  readonly v8: string
  readonly platform: NodeJS.Platform
  readonly architecture: string
  readonly packageVersion: string
  readonly commit?: string
  readonly benchmarkSchemaVersion: string
  readonly structuralSizeModelVersion: string | null
  readonly memlabVersion: string
  readonly yamlLibrary: string
  readonly yamlVersion: string
  readonly zodVersion: string
}

export interface BenchmarkResult {
  readonly fixture: {
    readonly id: string
    readonly family: BenchmarkFamily
    readonly description: string
    readonly parameters?: BenchmarkParameters
  }
  readonly environment: BenchmarkEnvironment
  readonly structure: {
    readonly before: StructuralMetrics
    readonly after: StructuralMetrics
  }
  readonly retainedHeap: RetainedHeapMetrics
  readonly serialization: {
    readonly json?: SerializationMetrics
    readonly yaml?: SerializationMetrics
  }
  readonly timing: {
    readonly intern: TimingMetrics
    readonly yamlBefore?: TimingMetrics
    readonly yamlAfter?: TimingMetrics
    readonly internAndYaml?: TimingMetrics
  }
}

export interface BenchmarkRun {
  readonly schemaVersion: string
  readonly run: {
    readonly id: string
    readonly createdAt: string
    readonly profile: 'quick' | 'full'
    readonly only: 'all' | 'memory'
  }
  readonly environment: BenchmarkEnvironment
  readonly results: readonly BenchmarkResult[]
}

export interface SummaryFixture {
  readonly id: string
  readonly family: BenchmarkFamily
  readonly description: string
  readonly parameters?: BenchmarkParameters
  readonly referenceNodes: { readonly before: number; readonly after: number; readonly deltaPercent: number | null }
  readonly edges: { readonly before: number; readonly after: number; readonly deltaPercent: number | null }
  readonly retainedHeap: {
    readonly before: number | null
    readonly after: number | null
    readonly deltaPercent: number | null
  }
  readonly yaml: { readonly before: number | null; readonly after: number | null; readonly deltaPercent: number | null }
  readonly internMedianMilliseconds: number
  readonly yamlBeforeMedianMilliseconds: number | null
  readonly yamlAfterMedianMilliseconds: number | null
  readonly internAndYamlMedianMilliseconds: number | null
}

export interface BenchmarkSummary {
  readonly schemaVersion: string
  readonly run: BenchmarkRun['run']
  readonly environment: BenchmarkEnvironment
  readonly fixtures: readonly SummaryFixture[]
}
