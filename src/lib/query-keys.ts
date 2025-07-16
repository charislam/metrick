/**
 * Centralized TanStack Query key factory
 * Provides type-safe, consistent query keys across the application
 */

export const queryKeys = {
	// Dummy key - used when the query is not actually enabled but need a key
	// to satisfy the signature
	dummy: () => ["DUMMY_SHOULD_NOT_EVER_BE_ACTUALLY_USED"],

	// Settings
	openaiApiKey: () => ["openai-api-key"] as const,

	// Documents
	documentSamples: () => ["document-samples"] as const,
	documentSample: (id: string) => ["document-sample", id] as const,
	allDocumentsStats: () => ["all-documents-stats"] as const,
	validateSample: (sample: unknown) => ["validate-sample", sample] as const,

	// Questions
	questions: () => ["questions"] as const,
	questionsBySample: (sampleId: string) =>
		["questions-by-sample", sampleId] as const,

	// Annotations
	annotationSessions: () => ["annotation-sessions"] as const,
	annotationSession: (sessionId: string) =>
		["annotation-session", sessionId] as const,
} as const;

/**
 * Type-safe query key utilities
 */
export type QueryKeys = typeof queryKeys;
export type QueryKey<T extends keyof QueryKeys> = ReturnType<QueryKeys[T]>;
