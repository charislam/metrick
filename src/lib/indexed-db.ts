import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { AnnotationSession, DocumentSample, Question } from "../types";

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
}

class IndexedDBManager {
	private db: IDBPDatabase<EvaluationDB> | null = null;

	async init() {
		// 1. Read all questions from the old DB version (if upgrading)
		let oldQuestions: Question[] = [];
		try {
			const oldDb = await openDB<EvaluationDB>("metrick-rag-evals", 2);
			if (oldDb.objectStoreNames.contains("questions")) {
				oldQuestions = await oldDb.getAll("questions");
			}
			oldDb.close();
		} catch {
			// If DB doesn't exist yet, that's fine
		}

		// 2. Open the new DB version and migrate
		this.db = await openDB<EvaluationDB>("metrick-rag-evals", 3, {
			upgrade(db, oldVersion) {
				if (oldVersion < 3) {
					if (db.objectStoreNames.contains("questions")) {
						db.deleteObjectStore("questions");
					}
					const questionStore = db.createObjectStore("questions", {
						keyPath: "id",
					});
					questionStore.createIndex("by-type", "type");
					questionStore.createIndex("by-documentSampleId", "documentSampleId");
				}
				if (!db.objectStoreNames.contains("documentSamples")) {
					db.createObjectStore("documentSamples", { keyPath: "id" });
				}
				if (!db.objectStoreNames.contains("annotationSessions")) {
					db.createObjectStore("annotationSessions", { keyPath: "id" });
				}
			},
		});

		// 3. Re-insert old questions into the new store
		if (oldQuestions.length > 0 && this.db) {
			const tx = this.db.transaction("questions", "readwrite");
			for (const q of oldQuestions) {
				await tx.store.put(q);
			}
			await tx.done;
		}
	}

	async saveQuestion(question: Question) {
		if (!this.db) await this.init();
		return this.db?.put("questions", question);
	}

	async getQuestions(type?: string) {
		if (!this.db) await this.init();
		if (type) {
			return this.db?.getAllFromIndex("questions", "by-type", type);
		}
		return this.db?.getAll("questions");
	}

	async saveDocumentSample(sample: DocumentSample) {
		if (!this.db) await this.init();
		return this.db?.put("documentSamples", sample);
	}

	async getDocumentSamples() {
		if (!this.db) await this.init();
		return this.db?.getAll("documentSamples");
	}

	async deleteDocumentSample(id: string) {
		if (!this.db) await this.init();
		return this.db?.delete("documentSamples", id);
	}

	async saveAnnotationSession(session: AnnotationSession) {
		if (!this.db) await this.init();
		return this.db?.put("annotationSessions", session);
	}

	async getAnnotationSessions() {
		if (!this.db) await this.init();
		return this.db?.getAll("annotationSessions");
	}

	async getQuestionsByDocumentSample(sampleId: string) {
		if (!this.db) await this.init();
		return (
			this.db?.getAllFromIndex("questions", "by-documentSampleId", sampleId) ??
			[]
		);
	}

	async updateQuestionStatus(
		questionId: string,
		status: "pending" | "accepted" | "rejected",
	) {
		if (!this.db) await this.init();
		const question = await this.db?.get("questions", questionId);
		if (question) {
			question.status = status;
			await this.db?.put("questions", question);
			return question;
		}
		return null;
	}

	async getDocumentSample(sampleId: string) {
		if (!this.db) await this.init();
		return this.db?.get("documentSamples", sampleId);
	}
}

export const indexedDB = new IndexedDBManager();
