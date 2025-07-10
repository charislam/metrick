import type React from "react";
import { useState } from "react";
import type { Question } from "../../types";

export const QuestionReviewCard: React.FC<{
	question: Pick<Question, "id" | "text" | "type" | "status" | "generatedBy">;
	onStatusChange: (id: string, newStatus: "accepted" | "rejected") => void;
}> = ({ question, onStatusChange }) => {
	const [editText, setEditText] = useState(question.text);

	const handleAccept = () => onStatusChange(question.id, "accepted");
	const handleReject = () => onStatusChange(question.id, "rejected");
	const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) =>
		setEditText(e.target.value);

	return (
		<div className="border rounded p-4 mb-3 bg-white shadow">
			<div className="flex items-center justify-between mb-2">
				<div className="text-sm text-gray-500">
					Source: {question.generatedBy}
				</div>
				<span
					className={`px-2 py-0.5 rounded text-xs font-semibold ${question.type === "answerable" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
				>
					{question.type === "answerable" ? "Answerable" : "Non-Answerable"}
				</span>
			</div>
			<input
				className="w-full border rounded px-2 py-1 mb-2"
				value={editText}
				onChange={handleEdit}
			/>
			<div className="flex gap-2">
				<button
					type="button"
					className={`px-3 py-1 rounded ${question.status === "accepted" ? "bg-green-500 text-white" : "bg-gray-200"}`}
					onClick={handleAccept}
				>
					Accept
				</button>
				<button
					type="button"
					className={`px-3 py-1 rounded ${question.status === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"}`}
					onClick={handleReject}
				>
					Reject
				</button>
				<span className="ml-4 text-xs text-gray-400">
					Status: {question.status}
				</span>
			</div>
		</div>
	);
};
