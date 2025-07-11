import { useState } from "react";

interface AnnotationFooterProps {
	onPrevious: () => void;
	onNext: () => void;
	onSave: () => void;
	canGoPrevious: boolean;
	canGoNext: boolean;
}

export function AnnotationFooter({
	onPrevious,
	onNext,
	onSave,
	canGoPrevious,
	canGoNext,
}: AnnotationFooterProps) {
	const [notes, setNotes] = useState("");

	return (
		<div className="bg-white border-t border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<button
						type="button"
						onClick={onPrevious}
						disabled={!canGoPrevious}
						className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
							canGoPrevious
								? "bg-gray-100 text-gray-700 hover:bg-gray-200"
								: "bg-gray-50 text-gray-400 cursor-not-allowed"
						}`}
					>
						Previous
					</button>

					<button
						type="button"
						onClick={onSave}
						className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						Save
					</button>

					<button
						type="button"
						onClick={onNext}
						disabled={!canGoNext}
						className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
							canGoNext
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "bg-gray-50 text-gray-400 cursor-not-allowed"
						}`}
					>
						Save & Next
					</button>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<label
							htmlFor="notes"
							className="text-sm font-medium text-gray-700"
						>
							Notes:
						</label>
						<input
							type="text"
							id="notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Add notes about this question..."
							className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<button
						type="button"
						className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
					>
						Skip
					</button>
				</div>
			</div>

			<div className="mt-3 text-xs text-gray-500">
				Keyboard shortcuts: 0-3 for scoring, Enter to save & next, Escape to
				skip
			</div>
		</div>
	);
}
