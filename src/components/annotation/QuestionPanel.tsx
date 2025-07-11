import type { Question } from "../../types";

interface QuestionPanelProps {
	question: Question;
}

export function QuestionPanel({ question }: QuestionPanelProps) {
	return (
		<div className="h-full flex flex-col">
			<div className="p-6 border-b border-gray-200">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-2">
						<span
							className={`px-2 py-1 text-xs font-medium rounded-full ${
								question.type === "answerable"
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{question.type}
						</span>
						<span className="text-xs text-gray-500">
							{question.generatedBy}
						</span>
					</div>
					<button
						type="button"
						className="text-gray-400 hover:text-gray-600"
						aria-label="View question details"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					</button>
				</div>

				<h2 className="text-lg font-medium text-gray-900 mb-4">
					{question.text}
				</h2>

				<div className="text-xs text-gray-500">
					Created: {question.createdAt.toLocaleDateString()}
				</div>
			</div>

			<div className="flex-1 p-6">
				<div className="space-y-4">
					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-2">
							Question Actions
						</h3>
						<div className="space-y-2">
							<button
								type="button"
								className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
							>
								Flag for review
							</button>
							<button
								type="button"
								className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
							>
								Add notes
							</button>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-2">
							Annotation Guidelines
						</h3>
						<div className="text-xs text-gray-600 space-y-1">
							<div>
								<strong>0 - Not Relevant:</strong> No information related to the
								question
							</div>
							<div>
								<strong>1 - Slightly Relevant:</strong> Minimal or tangential
								information
							</div>
							<div>
								<strong>2 - Relevant:</strong> Useful information that partially
								answers
							</div>
							<div>
								<strong>3 - Highly Relevant:</strong> Comprehensive information
								that directly answers
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
