import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { AnnotationSession, DocumentSample, Question } from "../types";

interface EvaluationDB extends DBSchema {
	questions: {
		key: string;
		value: Question;
		indexes: { "by-type": string; "by-category": string };
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
		this.db = await openDB<EvaluationDB>("metrick-rag-evals", 1, {
			upgrade(db) {
				const questionStore = db.createObjectStore("questions", {
					keyPath: "id",
				});
				questionStore.createIndex("by-type", "type");
				questionStore.createIndex("by-category", "category");

				db.createObjectStore("documentSamples", { keyPath: "id" });
				db.createObjectStore("annotationSessions", { keyPath: "id" });
			},
		});
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
}

export const indexedDB = new IndexedDBManager();
