import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type {
	Annotation,
	AnnotationSession,
	AnnotationSessionWithRelations,
	DocumentSample,
	Question,
} from "../types";
import { DatabaseEntryNotFoundError, DatabaseError, Result } from "./error";

const DB_NAME = "metrick-rag-evals";
const CURRENT_VERSION = 5;
const LEGACY_VERSION_WITHOUT_QUESTION_INDEXES = 2;

interface EvaluationDB extends DBSchema {
	questions: {
		key: string;
		value: Question;
		indexes: {
			"by-type": string;
			"by-documentSampleId": string;
		};
	};
	documentSamples: {
		key: string;
		value: DocumentSample;
	};
	annotationSessions: {
		key: string;
		value: AnnotationSession;
	};
	annotations: {
		key: string;
		value: Annotation;
		indexes: {
			"by-sessionId": string;
			"by-questionDocumentIds": string;
		};
	};
}

class IndexedDBManager {
	private db: IDBPDatabase<EvaluationDB> | null = null;

	async init() {
		const legacyData = await this.readLegacyData();
		this.db = await this.openDatabase();
		await this.migrateLegacyData(legacyData);
	}

	private async readLegacyData(): Promise<Question[]> {
		try {
			const oldDb = await openDB<EvaluationDB>(
				DB_NAME,
				LEGACY_VERSION_WITHOUT_QUESTION_INDEXES,
			);
			const questions = oldDb.objectStoreNames.contains("questions")
				? await oldDb.getAll("questions")
				: [];
			oldDb.close();
			return questions;
		} catch {
			return [];
		}
	}

	private async openDatabase(): Promise<IDBPDatabase<EvaluationDB>> {
		return openDB<EvaluationDB>(DB_NAME, CURRENT_VERSION, {
			upgrade: (db, oldVersion) => this.handleDatabaseUpgrade(db, oldVersion),
		});
	}

	private handleDatabaseUpgrade(
		db: IDBPDatabase<EvaluationDB>,
		oldVersion: number,
	) {
		const questionStoreMigrationRequired =
			oldVersion <= LEGACY_VERSION_WITHOUT_QUESTION_INDEXES;
		this.createQuestionsStore(db, questionStoreMigrationRequired);
		this.createDocumentSamplesStore(db);
		this.createAnnotationSessionsStore(db);
		this.createAnnotationsStore(db);
	}

	private createQuestionsStore(
		db: IDBPDatabase<EvaluationDB>,
		migrate = false,
	) {
		if (migrate && db.objectStoreNames.contains("questions")) {
			db.deleteObjectStore("questions");
		}
		if (!db.objectStoreNames.contains("questions")) {
			const questionStore = db.createObjectStore("questions", {
				keyPath: "id",
			});
			questionStore.createIndex("by-type", "type");
			questionStore.createIndex("by-documentSampleId", "documentSampleId");
		}
	}

	private createDocumentSamplesStore(db: IDBPDatabase<EvaluationDB>) {
		if (!db.objectStoreNames.contains("documentSamples")) {
			db.createObjectStore("documentSamples", { keyPath: "id" });
		}
	}

	private createAnnotationSessionsStore(db: IDBPDatabase<EvaluationDB>) {
		if (!db.objectStoreNames.contains("annotationSessions")) {
			db.createObjectStore("annotationSessions", { keyPath: "id" });
		}
	}

	private createAnnotationsStore(db: IDBPDatabase<EvaluationDB>) {
		if (!db.objectStoreNames.contains("annotations")) {
			const annotationStore = db.createObjectStore("annotations", {
				keyPath: "id",
			});
			annotationStore.createIndex("by-sessionId", "sessionId");
			annotationStore.createIndex(
				"by-questionDocumentIds",
				["questionId", "documentId"],
				{ unique: true },
			);
		}
	}

	private async migrateLegacyData(legacyQuestions: Question[]) {
		if (legacyQuestions.length === 0 || !this.db) return;

		const tx = this.db.transaction("questions", "readwrite");
		for (const question of legacyQuestions) {
			await tx.store.put(question);
		}
		await tx.done;
	}

	private async ensureConnection() {
		if (!this.db) await this.init();
		if (!this.db) throw new Error("Failed to initialize database");
		return this.db;
	}

	async saveQuestion(question: Question) {
		const db = await this.ensureConnection();
		return db.put("questions", question);
	}

	async getQuestions(type?: string) {
		const db = await this.ensureConnection();
		if (type) {
			return db.getAllFromIndex("questions", "by-type", type);
		}
		return db.getAll("questions");
	}

	async saveDocumentSample(sample: DocumentSample) {
		const db = await this.ensureConnection();
		return db.put("documentSamples", sample);
	}

	async getDocumentSamples() {
		const db = await this.ensureConnection();
		return db.getAll("documentSamples");
	}

	async deleteDocumentSample(id: string) {
		const db = await this.ensureConnection();
		return db.delete("documentSamples", id);
	}

	async saveAnnotationSession(session: AnnotationSession) {
		const db = await this.ensureConnection();
		return db.put("annotationSessions", session);
	}

	async getAnnotationSessions() {
		const db = await this.ensureConnection();
		return db.getAll("annotationSessions");
	}

	async getQuestionsByDocumentSample(sampleId: string) {
		const db = await this.ensureConnection();
		return db.getAllFromIndex("questions", "by-documentSampleId", sampleId);
	}

	async updateQuestionStatus(
		questionId: string,
		status: "pending" | "accepted" | "rejected",
	) {
		const db = await this.ensureConnection();
		const question = await db.get("questions", questionId);
		if (question) {
			question.status = status;
			await db.put("questions", question);
			return question;
		}
		return null;
	}

	async getDocumentSample(sampleId: string) {
		const db = await this.ensureConnection();
		return db.get("documentSamples", sampleId);
	}

	async saveAnnotation(annotation: Annotation) {
		const db = await this.ensureConnection();
		return db.put("annotations", annotation);
	}

	async getAnnotationsBySession(sessionId: string) {
		const db = await this.ensureConnection();
		return db.getAllFromIndex("annotations", "by-sessionId", sessionId);
	}

	async getAnnotationSession(sessionId: string) {
		const db = await this.ensureConnection();
		return db.get("annotationSessions", sessionId);
	}

	async updateAnnotationSession(session: AnnotationSession) {
		const db = await this.ensureConnection();
		return db.put("annotationSessions", session);
	}

	async getAnnotationByQuestionAndDocument(
		questionId: string,
		documentId: string,
	) {
		const db = await this.ensureConnection();
		return db.getFromIndex(
			"annotations",
			"by-questionDocumentIds",
			IDBKeyRange.only([questionId, documentId]),
		);
	}

	private normalizeSession(
		session: AnnotationSessionWithRelations,
	): AnnotationSession {
		return {
			...session,
			documentSampleId: session.documentSample.id,
			questionIds: session.questions.map((q) => q.id),
			annotationIds: session.annotations.map((a) => a.id),
		};
	}

	private async denormalizeSession(
		session: AnnotationSession,
	): Promise<AnnotationSessionWithRelations> {
		const db = await this.ensureConnection();

		const documentSamplePromise = db.get(
			"documentSamples",
			session.documentSampleId,
		);

		const questionsPromise = Promise.all(
			session.questionIds.map((questionId) => db.get("questions", questionId)),
		);

		const annotationsPromise = Promise.all(
			session.annotationIds.map((annotationId) =>
				db.get("annotations", annotationId),
			),
		);

		const [documentSample, questionsRaw, annotationsRaw] = await Promise.all([
			documentSamplePromise,
			questionsPromise,
			annotationsPromise,
		]);

		if (!documentSample) {
			throw new DatabaseEntryNotFoundError(
				`Document sample with ID ${session.documentSampleId} not found`,
			);
		}

		const questions: Question[] = questionsRaw.filter(
			(entry) => entry !== undefined,
		);
		const annotations: Annotation[] = annotationsRaw.filter(
			(entry) => entry !== undefined,
		);

		return {
			...session,
			documentSample,
			questions,
			annotations,
		};
	}

	async getAnnotationSessionsWithRelations(): Promise<
		AnnotationSessionWithRelations[]
	> {
		const db = await this.ensureConnection();
		const sessions = await db.getAll("annotationSessions");
		return Promise.all(
			sessions.map((session) => this.denormalizeSession(session)),
		);
	}

	async getAnnotationSessionWithRelations(
		sessionId: string,
	): Promise<AnnotationSessionWithRelations | undefined> {
		const session = await this.getAnnotationSession(sessionId);
		if (!session) return undefined;
		return this.denormalizeSession(session);
	}

	async saveAnnotationSessionWithRelations(
		session: AnnotationSessionWithRelations,
	): Promise<Result<AnnotationSession, DatabaseError>> {
		try {
			const db = await this.ensureConnection();
			const tx = db.transaction(
				["annotationSessions", "documentSamples", "questions", "annotations"],
				"readwrite",
			);

			// Save document sample if it has changes
			await tx.objectStore("documentSamples").put(session.documentSample);

			// Save all questions if they have changes
			for (const question of session.questions) {
				await tx.objectStore("questions").put(question);
			}

			// Save all annotations if they have changes
			for (const annotation of session.annotations) {
				await tx.objectStore("annotations").put(annotation);
			}

			// Save the normalized session
			const normalizedSession = this.normalizeSession(session);
			await tx.objectStore("annotationSessions").put(normalizedSession);

			await tx.done;
			return Result.ok(normalizedSession);
		} catch (error) {
			return Result.err(
				new DatabaseError(
					"Failed to save annotation session with relations",
					error,
				),
			);
		}
	}
}

export const indexedDB = new IndexedDBManager();
