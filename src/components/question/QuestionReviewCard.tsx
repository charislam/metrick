import type React from "react";
import type { ChangeEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Question } from "../../types";

export const QuestionReviewCard: React.FC<{
	question: Pick<Question, "id" | "text" | "type" | "status" | "generatedBy">;
	onStatusChange: (id: string, newStatus: "accepted" | "rejected") => void;
	onTextChange: (id: string, newText: string) => void;
}> = ({ question, onStatusChange, onTextChange }) => {
	const handleAccept = () => onStatusChange(question.id, "accepted");
	const handleReject = () => onStatusChange(question.id, "rejected");
	const handleEdit = (e: ChangeEvent<HTMLInputElement>) =>
		onTextChange(question.id, e.target.value);

	return (
		<div className="border rounded p-4 mb-3 bg-white shadow">
			<div className="flex items-center justify-between mb-2">
				<div className="text-sm text-gray-500">
					Source: {question.generatedBy}
				</div>
				<Badge
					variant={question.type === "answerable" ? "default" : "secondary"}
					className="ml-2"
				>
					{question.type === "answerable" ? "Answerable" : "Non-Answerable"}
				</Badge>
			</div>
			<Input className="mb-2" value={question.text} onChange={handleEdit} />
			<div className="flex gap-2">
				<Button
					type="button"
					variant={question.status === "accepted" ? "default" : "outline"}
					onClick={handleAccept}
				>
					Accept
				</Button>
				<Button
					type="button"
					variant={question.status === "rejected" ? "destructive" : "outline"}
					onClick={handleReject}
				>
					Reject
				</Button>
				<span className="ml-4 text-xs text-gray-400">
					Status: {question.status}
				</span>
			</div>
		</div>
	);
};
