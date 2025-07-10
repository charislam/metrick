export interface Document {
	id: string;
	title: string;
	content: string;
	contentType: "guide" | "reference" | "troubleshooting";
	metadata: Record<string, unknown>;
}

export interface Question {
	id: string;
	text: string;
	type: "answerable" | "non-answerable";
	generatedBy: "llm" | "manual";
	createdAt: Date;
	updatedAt: Date;
	documentSampleId: string; // Associated document sample
	status: "pending" | "accepted" | "rejected"; // Curation status
}

export interface Annotation {
	id: string;
	questionId: string;
	documentId: string;
	relevancyScore: 0 | 1 | 2 | 3;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface DocumentSample {
	id: string;
	name: string;
	description: string;
	documents: Document[];
	samplingCriteria: SamplingCriteria;
	createdAt: Date;
	updatedAt: Date;
}

export interface SamplingCriteria {
	sampleSize: number;
	contentTypeDistribution: {
		guide: number;
		reference: number;
		troubleshooting: number;
	};
	additionalFilters?: Record<string, unknown>;
}

export interface AnnotationSession {
	id: string;
	name: string;
	description: string;
	documentSampleId: string;
	questions: Question[];
	annotations: Annotation[];
	progress: {
		total: number;
		completed: number;
		remaining: number;
	};
	createdAt: Date;
	updatedAt: Date;
}
