import { useState } from "react";
import type { Document } from "../../types";
import { AddQuestionForm } from "./AddQuestionForm";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { useSaveQuestions } from "./hooks/useSaveQuestions";
import { QuestionGenerationControls } from "./QuestionGenerationControls";
import { QuestionListReview } from "./QuestionListReview";

export const QuestionGenerator: React.FC<{ sampleId: string }> = ({
	sampleId,
}) => {
	const {
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
	} = useQuestionGeneration(sampleId);
	const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
	const saveMutation = useSaveQuestions({
		questions,
		sampleId,
		setSaveSuccess,
	});

	// Handler to update question status in parent state
	const handleStatusChange = (
		id: string,
		newStatus: "accepted" | "rejected",
	) => {
		setQuestions((prev: typeof questions) =>
			prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q)),
		);
	};

	// Handler to update question text in parent state
	const handleTextChange = (id: string, newText: string) => {
		setQuestions((prev: typeof questions) =>
			prev.map((q) => (q.id === id ? { ...q, text: newText } : q)),
		);
	};

	const allReviewed =
		questions.length > 0 &&
		questions.every((q) => q.status === "accepted" || q.status === "rejected");

	return (
		<div className="flex gap-10 p-8 bg-gray-50">
			<div className="flex-1 min-w-0">
				<div className="max-w-2xl mx-auto">
					<div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Generate AI Questions
						</h2>
						<QuestionGenerationControls
							answerableCount={answerableCount}
							setAnswerableCount={setAnswerableCount}
							nonAnswerableCount={nonAnswerableCount}
							setNonAnswerableCount={setNonAnswerableCount}
							apiKey={apiKey}
							apiKeyLoading={apiKeyLoading}
							onGenerate={() => generateMutation.mutate()}
							isGenerating={generateMutation.isPending}
						/>
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
						{saveMutation.isError && (
							<span className="text-red-500 text-sm">
								{saveMutation.error instanceof Error
									? saveMutation.error.message
									: String(saveMutation.error)}
							</span>
						)}
						{!allReviewed && questions.length > 0 && (
							<span className="text-sm text-gray-500">
								All questions must be reviewed before saving.
							</span>
						)}
					</div>
					<QuestionListReview
						questions={questions}
						onStatusChange={handleStatusChange}
						onTextChange={handleTextChange}
					/>
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
									{sample.documents.map((doc: Document) => (
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
