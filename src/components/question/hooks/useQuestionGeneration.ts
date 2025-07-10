import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { generateQuestions } from "../../../lib/ai-question-generator";
import { useApiKeyQuery } from "../../../lib/api-key";
import { indexedDB } from "../../../lib/indexed-db";
import type { DocumentSample, Question } from "../../../types";

export function useQuestionGeneration(sampleId: string) {
	const [answerableCount, setAnswerableCount] = useState<number>(12);
	const [nonAnswerableCount, setNonAnswerableCount] = useState<number>(8);
	const [questions, setQuestions] = useState<
		Pick<Question, "id" | "text" | "type" | "status" | "generatedBy">[]
	>([]);

	const { data: apiKey = "", isLoading: apiKeyLoading } = useApiKeyQuery();

	const {
		data: sample,
		isLoading: sampleLoading,
		isError: sampleError,
	} = useQuery<DocumentSample | null>({
		queryKey: ["document-sample", sampleId],
		queryFn: async (): Promise<DocumentSample | null> =>
			(await indexedDB.getDocumentSample(sampleId)) ?? null,
	});

	const generateMutation = useMutation({
		mutationFn: async (): Promise<void> => {
			if (!apiKey)
				throw new Error(
					"Missing OpenAI API key. Configure your API key in Settings.",
				);
			const sample = await indexedDB.getDocumentSample(sampleId);
			if (!sample)
				throw new Error(
					`Expected to find sample for ID ${sampleId} but none found`,
				);

			const { answerable, nonAnswerable } = (
				await generateQuestions(
					sample.documents,
					{ answerableCount, nonAnswerableCount },
					apiKey,
				)
			).unwrapRaw();

			const answerableQs = answerable.map((text: string) => ({
				id: crypto.randomUUID(),
				text,
				type: "answerable" as const,
				status: "pending" as const,
				generatedBy: "llm" as const,
			}));
			const nonAnswerableQs = nonAnswerable.map((text: string) => ({
				id: crypto.randomUUID(),
				text,
				type: "non-answerable" as const,
				status: "pending" as const,
				generatedBy: "llm" as const,
			}));
			setQuestions([...answerableQs, ...nonAnswerableQs]);
		},
	});

	return {
		answerableCount,
		setAnswerableCount,
		nonAnswerableCount,
		setNonAnswerableCount,
		questions,
		setQuestions,
		apiKey,
		apiKeyLoading,
		sampleLoading,
		sampleError,
		generateMutation,
		sample,
	};
}
