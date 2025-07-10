import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { generateQuestions } from "../../lib/ai-question-generator";
import { useApiKeyQuery } from "../../lib/api-key";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample, Question } from "../../types";
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
	const [saveSuccess, setSaveSuccess] = useState(false);
	const queryClient = useQueryClient();

	const { data: apiKey = "", isLoading: apiKeyLoading } = useApiKeyQuery();

	const {
		data: sample,
		isLoading: sampleLoading,
		isError: sampleError,
	} = useQuery<DocumentSample | null>({
		queryKey: ["document-sample", sampleId],
		queryFn: async () => (await indexedDB.getDocumentSample(sampleId)) ?? null,
	});

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

	// Determine if all questions are reviewed
	const allReviewed =
		questions.length > 0 &&
		questions.every((q) => q.status === "accepted" || q.status === "rejected");

	// Save questions mutation
	const saveMutation = useMutation({
		mutationFn: async () => {
			await Promise.all(
				questions
					.filter((q) => q.status === "accepted")
					.map(async (q) => {
						await indexedDB.saveQuestion({
							...q,
							createdAt: new Date(),
							updatedAt: new Date(),
							documentSampleId: sampleId,
						});
					}),
			);
		},
		onSuccess: () => {
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 2000);
			queryClient.invalidateQueries({ queryKey: ["questions", sampleId] });
		},
	});

	// Handler to update question status in parent state
	const handleStatusChange = (
		id: string,
		newStatus: "accepted" | "rejected",
	) => {
		setQuestions((prev) =>
			prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q)),
		);
	};

	return (
		<div className="flex gap-10 p-8 bg-gray-50">
			<div className="flex-1 min-w-0">
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Generate AI Questions
						</h2>
						<div className="flex flex-wrap gap-6 items-end mb-6">
							<div>
								<label
									htmlFor="answerable-count"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Answerable
								</label>
								<input
									id="answerable-count"
									type="number"
									min={0}
									value={answerableCount}
									onChange={(e) => setAnswerableCount(Number(e.target.value))}
									className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label
									htmlFor="non-answerable-count"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Non-Answerable
								</label>
								<input
									id="non-answerable-count"
									type="number"
									min={0}
									value={nonAnswerableCount}
									onChange={(e) =>
										setNonAnswerableCount(Number(e.target.value))
									}
									className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex-1" />
							<div className="flex items-center gap-2">
								{apiKeyLoading ? (
									<span className="text-gray-500">Loading API key...</span>
								) : !apiKey ? (
									<span className="text-red-500 text-sm">
										Missing OpenAI API key. Configure your API key in Settings.
									</span>
								) : (
									<span className="text-green-600 text-sm font-medium">
										API key loaded from settings
									</span>
								)}
								<button
									type="button"
									className="px-5 py-2 bg-green-600 text-white rounded-md font-semibold shadow hover:bg-green-700 transition"
									onClick={() => generateMutation.mutate()}
									disabled={!apiKey || generateMutation.isPending}
								>
									{generateMutation.isPending ? "Generating..." : "Generate"}
								</button>
							</div>
						</div>
						{generateMutation.isError && (
							<div className="text-red-500 mb-2">
								{generateMutation.error instanceof Error
									? generateMutation.error.message
									: String(generateMutation.error)}
							</div>
						)}
						<AddQuestionForm sampleId={sampleId} />
					</div>
					{/* Save Questions Button */}
					<div className="flex items-center gap-4 mb-6">
						<button
							type="button"
							className={`px-6 py-2 rounded-md font-semibold shadow transition text-white ${allReviewed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
							disabled={!allReviewed || saveMutation.isPending}
							onClick={() => saveMutation.mutate()}
						>
							{saveMutation.isPending ? "Saving..." : "Save Questions"}
						</button>
						{saveSuccess && (
							<span className="text-green-600 font-medium">
								Questions saved!
							</span>
						)}
						{!allReviewed && questions.length > 0 && (
							<span className="text-sm text-gray-500">
								All questions must be reviewed before saving.
							</span>
						)}
					</div>
					<div className="space-y-4">
						{questions.length === 0 && (
							<div className="text-center text-gray-400 py-12 text-lg bg-white rounded-xl border border-dashed border-gray-200">
								No questions generated yet. Use the controls above to generate
								or add questions.
							</div>
						)}
						{questions.map((q) => (
							<QuestionReviewCard
								key={q.id}
								question={q}
								onStatusChange={handleStatusChange}
							/>
						))}
					</div>
				</div>
			</div>
			<aside className="w-96 shrink-0">
				<div className="sticky top-8">
					<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
						<h3 className="font-semibold text-lg mb-2 text-gray-900">
							Document Sample
						</h3>
						{sampleLoading ? (
							<div className="text-xs text-gray-400">Loading sample...</div>
						) : sampleError ? (
							<div className="text-xs text-red-500">Error loading sample.</div>
						) : sample ? (
							<div>
								<div className="font-bold mb-1 text-base text-gray-800">
									{sample.name}
								</div>
								<div className="text-xs text-muted-foreground mb-4 text-gray-500">
									{sample.description}
								</div>
								<ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
									{sample.documents.map((doc) => (
										<li
											key={doc.id}
											className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
										>
											<div className="font-medium text-sm mb-1 text-gray-900 truncate">
												{doc.title}
											</div>
											<div className="text-xs text-blue-700 mb-1 capitalize">
												{doc.contentType}
											</div>
											<div className="text-xs text-gray-700 line-clamp-4 whitespace-pre-line">
												{doc.content.slice(0, 240)}
												{doc.content.length > 240 ? "..." : ""}
											</div>
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className="text-xs text-gray-400">No sample found.</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
};
