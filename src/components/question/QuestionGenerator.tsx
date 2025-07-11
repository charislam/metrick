import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

	const handleGenerate = ({
		answerableCount,
		nonAnswerableCount,
	}: {
		answerableCount: number;
		nonAnswerableCount: number;
	}) => {
		generateMutation.mutate({ answerableCount, nonAnswerableCount });
	};

	return (
		<div className="flex gap-10 p-8 bg-muted/50 dark:bg-background transition-colors">
			<div className="flex-1 min-w-0">
				<div className="max-w-2xl mx-auto">
					<div className="bg-card rounded-xl shadow-lg p-8 mb-8 border border-muted-200 dark:border-border/60 transition-colors">
						<h2 className="text-2xl font-bold mb-4 text-foreground">
							Generate AI Questions
						</h2>
						<QuestionGenerationControls
							onGenerate={handleGenerate}
							apiKey={apiKey}
							apiKeyLoading={apiKeyLoading}
							isGenerating={generateMutation.isPending}
						/>
						{generateMutation.isError && (
							<div className="text-red-500 dark:text-red-400 mb-2">
								{generateMutation.error instanceof Error
									? generateMutation.error.message
									: String(generateMutation.error)}
							</div>
						)}
						<AddQuestionForm sampleId={sampleId} />
					</div>
					{/* Save Questions Button */}
					<div className="flex items-center gap-4 mb-6">
						<Button
							type="button"
							className="px-6"
							variant={allReviewed ? "default" : "secondary"}
							disabled={!allReviewed || saveMutation.isPending}
							onClick={() => saveMutation.mutate()}
						>
							{saveMutation.isPending ? "Saving..." : "Save Questions"}
						</Button>
						{saveSuccess && (
							<span className="text-green-600 dark:text-green-400 font-medium">
								Questions saved!
							</span>
						)}
						{saveMutation.isError && (
							<span className="text-red-500 dark:text-red-400 text-sm">
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
					<QuestionListReview
						questions={questions}
						onStatusChange={handleStatusChange}
						onTextChange={handleTextChange}
					/>
				</div>
			</div>
			<aside className="w-96 shrink-0 sticky top-8 h-[calc(100vh-10rem)]">
				<Card className="p-0 overflow-hidden h-full flex flex-col gap-0">
					<div className="bg-muted/50 dark:bg-muted/30 px-6 py-4 border-b border-muted-200 dark:border-border/60 shrink-0 transition-colors">
						<h3 className="font-semibold text-lg mb-1 text-foreground">
							Document Sample
						</h3>
						<div className="font-bold text-base text-foreground">
							{sample?.name}
						</div>
						{sample?.description && (
							<div className="text-xs text-muted-foreground mt-1">
								{sample.description}
							</div>
						)}
					</div>
					{sampleLoading ? (
						<div className="text-xs text-muted-foreground px-6 py-4">
							Loading sample...
						</div>
					) : sampleError ? (
						<div className="text-xs text-red-500 dark:text-red-400 px-6 py-4">
							Error loading sample.
						</div>
					) : sample ? (
						<ul className="space-y-4 flex-1 min-h-0 overflow-y-auto px-6 py-4">
							{sample.documents.map((doc: Document) => (
								<li
									key={doc.id}
									className="bg-card dark:bg-card border border-muted-200 dark:border-border/60 rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col gap-1"
								>
									<div className="font-medium text-base mb-2 text-foreground truncate">
										{doc.title}
									</div>
									<Badge variant="secondary" className="w-fit capitalize mb-3">
										{doc.contentType}
									</Badge>
									<div className="text-xs text-muted-foreground font-mono line-clamp-4 whitespace-pre-line">
										{doc.content.slice(0, 240)}
										{doc.content.length > 240 ? "..." : ""}
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="text-xs text-muted-foreground px-6 py-4">
							No sample found.
						</div>
					)}
				</Card>
			</aside>
		</div>
	);
};
