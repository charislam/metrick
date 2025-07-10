import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { generateQuestions } from "../../lib/ai-question-generator";
import { useApiKeyQuery } from "../../lib/api-key";
import { indexedDB } from "../../lib/indexed-db";
import type { Question } from "../../types";
import { AddQuestionForm } from "./AddQuestionForm";
import { QuestionReviewCard } from "./QuestionReviewCard";

export const QuestionGenerator: React.FC<{ sampleId: string }> = ({
	sampleId,
}) => {
	const [answerableCount, setAnswerableCount] = useState(12);
	const [nonAnswerableCount, setNonAnswerableCount] = useState(8);
	const [questions, setQuestions] = useState<
		Pick<Question, "id" | "text" | "type" | "status" | "generatedBy">[]
	>([]);

	const { data: apiKey = "", isLoading: apiKeyLoading } = useApiKeyQuery();

	const generateMutation = useMutation({
		mutationFn: async () => {
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

			const answerableQs = answerable.map((text) => ({
				id: crypto.randomUUID(),
				text,
				type: "answerable" as const,
				status: "pending" as const,
				generatedBy: "llm" as const,
			}));
			const nonAnswerableQs = nonAnswerable.map((text) => ({
				id: crypto.randomUUID(),
				text,
				type: "non-answerable" as const,
				status: "pending" as const,
				generatedBy: "llm" as const,
			}));
			setQuestions([...answerableQs, ...nonAnswerableQs]);
		},
	});

	return (
		<div className="p-4">
			<h2 className="text-lg font-bold mb-2">Generate AI Questions</h2>
			<div className="flex gap-4 mb-4">
				<label>
					Answerable:
					<input
						type="number"
						min={0}
						value={answerableCount}
						onChange={(e) => setAnswerableCount(Number(e.target.value))}
						className="ml-2 border rounded px-2 py-1 w-16"
					/>
				</label>
				<label>
					Non-Answerable:
					<input
						type="number"
						min={0}
						value={nonAnswerableCount}
						onChange={(e) => setNonAnswerableCount(Number(e.target.value))}
						className="ml-2 border rounded px-2 py-1 w-16"
					/>
				</label>
				{apiKeyLoading ? (
					<span className="ml-2 text-gray-500">Loading API key...</span>
				) : !apiKey ? (
					<span className="ml-2 text-red-500">
						Missing OpenAI API key. Configure your API key in Settings.
					</span>
				) : (
					<span className="ml-2 text-green-600">
						API key loaded from settings
					</span>
				)}
				<button
					type="button"
					className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
					onClick={() => generateMutation.mutate()}
					disabled={!apiKey || generateMutation.isPending}
				>
					{generateMutation.isPending ? "Generating..." : "Generate"}
				</button>
			</div>
			{generateMutation.isError && (
				<div className="text-red-500 mb-2">
					{generateMutation.error instanceof Error
						? generateMutation.error.message
						: String(generateMutation.error)}
				</div>
			)}
			<div className="mb-4">
				<AddQuestionForm sampleId={sampleId} />
			</div>
			<div>
				{questions.map((q) => (
					<QuestionReviewCard key={q.id} question={q} />
				))}
			</div>
		</div>
	);
};
