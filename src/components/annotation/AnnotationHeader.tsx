import type { AnnotationSession } from "../../types";

interface AnnotationHeaderProps {
	session: AnnotationSession;
	currentQuestionIndex: number;
	totalQuestions: number;
}

export function AnnotationHeader({
	session,
	currentQuestionIndex,
	totalQuestions,
}: AnnotationHeaderProps) {
	const progressPercentage =
		totalQuestions > 0
			? ((currentQuestionIndex + 1) / totalQuestions) * 100
			: 0;

	return (
		<div className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<h1 className="text-xl font-semibold text-gray-900">
						{session.name}
					</h1>
					<p className="text-sm text-gray-600 mt-1">{session.description}</p>
				</div>

				<div className="flex items-center space-x-6">
					<div className="text-right">
						<div className="text-sm font-medium text-gray-900">
							Question {currentQuestionIndex + 1} of {totalQuestions}
						</div>
						<div className="text-xs text-gray-500">
							{Math.round(progressPercentage)}% complete
						</div>
					</div>

					<div className="w-32">
						<div className="bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
