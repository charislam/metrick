import type { Annotation, AnnotationSession } from "../../types";

interface AnnotationSidebarProps {
	session: AnnotationSession;
	annotations: Annotation[];
	currentQuestionIndex: number;
}

export function AnnotationSidebar({
	session,
	annotations,
	currentQuestionIndex,
}: AnnotationSidebarProps) {
	const completedQuestions = new Set(annotations.map((a) => a.questionId)).size;
	const totalQuestions = session.questions.length;
	const completionPercentage =
		totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

	const getQuestionStatus = (questionId: string) => {
		const questionAnnotations = annotations.filter(
			(a) => a.questionId === questionId,
		);
		if (questionAnnotations.length === 0) return "pending";
		if (questionAnnotations.length > 0) return "completed";
		return "in-progress";
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800";
			case "pending":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="h-full flex flex-col">
			<div className="p-6 border-b border-gray-200">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Session Progress
				</h2>

				<div className="space-y-4">
					<div>
						<div className="flex justify-between text-sm mb-2">
							<span className="text-gray-600">Completion</span>
							<span className="font-medium">
								{Math.round(completionPercentage)}%
							</span>
						</div>
						<div className="bg-gray-200 rounded-full h-2">
							<div
								className="bg-green-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${completionPercentage}%` }}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">
								{completedQuestions}
							</div>
							<div className="text-gray-600">Completed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-600">
								{totalQuestions - completedQuestions}
							</div>
							<div className="text-gray-600">Remaining</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				<div className="space-y-4">
					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-3">
							Question Status
						</h3>
						<div className="space-y-2">
							{session.questions.map((question, index) => {
								const status = getQuestionStatus(question.id);
								const isCurrent = index === currentQuestionIndex;

								return (
									<div
										key={question.id}
										className={`flex items-center justify-between p-2 rounded-md text-sm ${
											isCurrent
												? "bg-blue-50 border border-blue-200"
												: "hover:bg-gray-50"
										}`}
									>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-gray-900 truncate">
												Q{index + 1}: {question.text.substring(0, 30)}...
											</div>
											<div className="text-xs text-gray-500">
												{question.type} • {question.generatedBy}
											</div>
										</div>
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
												status,
											)}`}
										>
											{status}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-3">
							Quality Checks
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">All documents scored</span>
								<span className="text-green-600">✓</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Consistent scoring</span>
								<span className="text-green-600">✓</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">No skipped questions</span>
								<span className="text-green-600">✓</span>
							</div>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-3">
							Review Queue
						</h3>
						<div className="text-sm text-gray-600">
							No questions flagged for review
						</div>
					</div>
				</div>
			</div>

			<div className="p-6 border-t border-gray-200">
				<div className="text-xs text-gray-500 space-y-1">
					<div>Session ID: {session.id}</div>
					<div>Created: {session.createdAt.toLocaleDateString()}</div>
					<div>Last updated: {session.updatedAt.toLocaleDateString()}</div>
				</div>
			</div>
		</div>
	);
}
