import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import {
	annotationSyncStatusAtom,
	currentAnnotationSessionAtom,
	hasUnsavedChangesAtom,
} from "@/lib/annotation-atoms";
import { indexedDB } from "@/lib/indexed-db";
import { queryKeys } from "@/lib/query-keys";
import type {
	Annotation,
	AnnotationSessionWithRelations,
	Document,
	Question,
} from "@/types";

export function useAnnotationSession(sessionId: string | undefined) {
	const [session, setSession] = useAtom(currentAnnotationSessionAtom);
	const [syncStatus, setSyncStatus] = useAtom(annotationSyncStatusAtom);
	const hasUnsavedChanges = useAtomValue(hasUnsavedChangesAtom);
	const queryClient = useQueryClient();

	// TanStack Query for initial load and background persistence
	const sessionQuery = useQuery({
		queryKey: sessionId
			? queryKeys.annotationSession(sessionId)
			: queryKeys.dummy(),
		queryFn: async () => {
			if (!sessionId) return undefined;
			return await indexedDB.getAnnotationSessionWithRelations(sessionId);
		},
		// Only enable if a session is not already loaded
		enabled: !!sessionId && (!session || session.id !== sessionId),
	});

	const saveMutation = useMutation({
		mutationFn: async (sessionToSave: AnnotationSessionWithRelations) => {
			const result =
				await indexedDB.saveAnnotationSessionWithRelations(sessionToSave);
			return result.unwrapRaw();
		},
		onMutate: () => setSyncStatus("saving"),
		onSuccess: () => {
			setSyncStatus("saved");
			// Mark session as saved in atom
			setSession((prev) =>
				prev ? { ...prev, hasUnsavedChanges: false } : null,
			);
			// Invalidate the cache to keep it in sync
			if (sessionId) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.annotationSessions(),
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.annotationSession(sessionId),
				});
			}
		},
		onError: () => setSyncStatus("error"),
	});

	// Initialize atom when query succeeds
	useEffect(() => {
		if (
			sessionQuery.data &&
			sessionId &&
			(!session || session.id !== sessionId)
		) {
			setSession({ ...sessionQuery.data, hasUnsavedChanges: false });
		}
	}, [sessionQuery.data, session, sessionId, setSession]);

	// Update or create annotation for a question-document pair
	const updateAnnotation = useCallback(
		(questionId: string, documentId: string, score: 0 | 1 | 2 | 3) => {
			setSession((prev) => {
				if (!prev) return null;

				const now = new Date();

				// Find existing annotation for this question-document pair
				const existingAnnotationIndex = prev.annotations.findIndex(
					(ann: Annotation) =>
						ann.questionId === questionId && ann.documentId === documentId,
				);

				let updatedAnnotations: Annotation[];
				let updatedAnnotationIds: string[];

				if (existingAnnotationIndex >= 0) {
					// Update existing annotation
					updatedAnnotations = prev.annotations.map(
						(ann: Annotation, index: number) =>
							index === existingAnnotationIndex
								? { ...ann, relevancyScore: score, updatedAt: now }
								: ann,
					);
					updatedAnnotationIds = prev.annotationIds; // No change to IDs
				} else {
					// Create new annotation
					const newAnnotation: Annotation = {
						id: crypto.randomUUID(),
						questionId,
						documentId,
						relevancyScore: score,
						createdAt: now,
						updatedAt: now,
					};

					updatedAnnotations = [...prev.annotations, newAnnotation];
					updatedAnnotationIds = [...prev.annotationIds, newAnnotation.id];
				}

				return {
					...prev,
					annotations: updatedAnnotations,
					annotationIds: updatedAnnotationIds,
					hasUnsavedChanges: true,
					updatedAt: now,
				};
			});
		},
		[setSession],
	);

	// Get annotation for a specific question-document pair
	const getAnnotation = useCallback(
		(questionId: string, documentId: string) => {
			if (!session) return undefined;
			return session.annotations.find(
				(ann: Annotation) =>
					ann.questionId === questionId && ann.documentId === documentId,
			);
		},
		[session],
	);

	// Get all question-document pairs for the session
	const getQuestionDocPairs = useCallback(() => {
		if (!session) return [];

		return session.questions.flatMap((question: Question) =>
			session.documentSample.documents.map((document: Document) => ({
				questionId: question.id,
				documentId: document.id,
				question,
				document,
				annotation: getAnnotation(question.id, document.id),
			})),
		);
	}, [session, getAnnotation]);

	// Get current question-document pair based on navigation
	const getCurrentPair = useCallback(
		(currentIndex: number) => {
			const pairs = getQuestionDocPairs();
			return pairs[currentIndex] || null;
		},
		[getQuestionDocPairs],
	);

	// Get progress information
	const getProgress = useCallback(() => {
		if (!session) return { completed: 0, total: 0, percentage: 0 };

		const pairs = getQuestionDocPairs();
		const completed = pairs.filter(
			(pair) => pair.annotation !== undefined,
		).length;
		const total = pairs.length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

		return { completed, total, percentage };
	}, [session, getQuestionDocPairs]);

	// Explicit save function
	const saveChanges = useCallback(() => {
		if (session && hasUnsavedChanges) {
			saveMutation.mutate(session);
		}
	}, [session, hasUnsavedChanges, saveMutation]);

	// Discard changes (reload from cache/DB)
	const discardChanges = useCallback(() => {
		if (sessionQuery.data) {
			setSession({ ...sessionQuery.data, hasUnsavedChanges: false });
			setSyncStatus("idle");
		}
	}, [sessionQuery.data, setSession, setSyncStatus]);

	return {
		session,
		isLoading: sessionQuery.isLoading,
		isError: sessionQuery.isError,
		error: sessionQuery.error,
		hasUnsavedChanges,
		syncStatus,

		// Actions
		updateAnnotation,
		saveChanges,
		discardChanges,

		// Data helpers
		getAnnotation,
		getQuestionDocPairs,
		getCurrentPair,
		getProgress,
	};
}
