import type { Question } from "../../types";

interface QuestionReviewCardProps {
	question: Pick<Question, "id" | "text" | "type" | "status" | "generatedBy">;
}

export function QuestionReviewCard({ question }: QuestionReviewCardProps) {
	return (
		<div className="border border-border rounded p-4 mb-3 bg-card shadow">
			<div className="flex justify-between items-start mb-2">
				<span className="text-sm font-medium text-muted-foreground">
					{question.type}
				</span>
				<span className="text-sm text-muted-foreground">
					{question.generatedBy}
				</span>
			</div>
			<p className="text-foreground mb-2">{question.text}</p>
			<div className="flex gap-2">
				<button
					type="button"
					className={`px-3 py-1 rounded text-sm ${
						question.status === "accepted"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
					}`}
				>
					{question.status === "accepted" ? "Accepted" : "Pending"}
				</button>
			</div>
		</div>
	);
}
