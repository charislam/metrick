import type React from "react";
import type { Question } from "../../types";
import { QuestionReviewCard } from "./QuestionReviewCard";

interface QuestionListReviewProps {
	questions: Pick<
		Question,
		"id" | "text" | "type" | "status" | "generatedBy"
	>[];
	onStatusChange: (id: string, newStatus: "accepted" | "rejected") => void;
	onTextChange: (id: string, newText: string) => void;
}

export const QuestionListReview: React.FC<QuestionListReviewProps> = ({
	questions,
	onStatusChange,
	onTextChange,
}) => (
	<div className="space-y-4">
		{questions.length === 0 ? (
			<div className="text-center text-gray-400 py-12 text-lg bg-white rounded-xl border border-dashed border-gray-200">
				No questions generated yet. Use the controls above to generate or add
				questions.
			</div>
		) : (
			questions.map((q) => (
				<QuestionReviewCard
					key={q.id}
					question={q}
					onStatusChange={onStatusChange}
					onTextChange={onTextChange}
				/>
			))
		)}
	</div>
);
