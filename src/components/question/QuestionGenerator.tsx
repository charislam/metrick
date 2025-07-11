import { useState } from "react";
import type { Document } from "../../types";
import { AddQuestionForm } from "./AddQuestionForm";
import { QuestionGenerationControls } from "./QuestionGenerationControls";
import { QuestionListReview } from "./QuestionListReview";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { useSaveQuestions } from "./hooks/useSaveQuestions";

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
		<div className="flex gap-10 p-8 bg-muted/50">
			<div className="flex-1 min-w-0">
				<div className="max-w-2xl mx-auto">
					<div className="bg-card rounded-xl shadow-lg p-8 mb-8 border border-border">
						<h2 className="text-2xl font-bold mb-4 text-card-foreground">
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
							<div className="text-destructive mb-2">
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
							className={`px-6 py-2 rounded-md font-semibold shadow transition text-white ${
								allReviewed
									? "bg-primary hover:bg-primary/90"
									: "bg-muted cursor-not-allowed"
							}`}
							disabled={!allReviewed || saveMutation.isPending}
							onClick={() => saveMutation.mutate()}
						>
							{saveMutation.isPending ? "Saving..." : "Save Questions"}
						</button>
						{saveSuccess && (
							<span className="text-green-600 dark:text-green-400 font-medium">
								Questions saved!
							</span>
						)}
						{saveMutation.isError && (
							<span className="text-destructive text-sm">
								{saveMutation.error instanceof Error
									? saveMutation.error.message
									: String(saveMutation.error)}
							</span>
						)}
						{!allReviewed && questions.length > 0 && (
							<span className="text-sm text-muted-foreground">
								All questions must be reviewed before saving.
							</span>
						)}
					</div>
					<QuestionListReview sampleId={sampleId} />
				</div>
			</div>
			<aside className="w-96 shrink-0">
				<div className="sticky top-8">
					<div className="bg-card rounded-xl shadow-lg border border-border p-6">
						<h3 className="font-semibold text-lg mb-2 text-card-foreground">
							Document Sample
						</h3>
						{sampleLoading ? (
							<div className="text-xs text-muted-foreground">
								Loading sample...
							</div>
						) : sampleError ? (
							<div className="text-xs text-destructive">
								Error loading sample.
							</div>
						) : sample ? (
							<div>
								<div className="font-bold mb-1 text-base text-foreground">
									{sample.name}
								</div>
								<div className="text-xs text-muted-foreground mb-4">
									{sample.description}
								</div>
								<ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
									{sample.documents.map((doc: Document) => (
										<li
											key={doc.id}
											className="border border-border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition"
										>
											<div className="font-medium text-sm mb-1 text-foreground truncate">
												{doc.title}
											</div>
											<div className="text-xs text-primary mb-1 capitalize">
												{doc.contentType}
											</div>
											<div className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-line">
												{doc.content.slice(0, 240)}
												{doc.content.length > 240 ? "..." : ""}
											</div>
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className="text-xs text-muted-foreground">
								No sample found.
							</div>
						)}
					</div>
				</div>
			</aside>
		</div>
	);
};
