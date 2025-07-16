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

// Normalized version stored in DB - references by ID only
export interface AnnotationSession {
	id: string;
	documentSampleId: string;
	questionIds: string[];
	annotationIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

// Denormalized version for components - includes full objects
export interface AnnotationSessionWithRelations
	extends Omit<AnnotationSession, "questionIds" | "documentSampleId"> {
	documentSample: DocumentSample;
	questions: Question[];
	annotations: Annotation[];
	hasUnsavedChanges?: boolean;
}
