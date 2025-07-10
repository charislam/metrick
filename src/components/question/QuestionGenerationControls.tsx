import type React from "react";

interface QuestionGenerationControlsProps {
	answerableCount: number;
	setAnswerableCount: (n: number) => void;
	nonAnswerableCount: number;
	setNonAnswerableCount: (n: number) => void;
	apiKey: string;
	apiKeyLoading: boolean;
	onGenerate: () => void;
	isGenerating: boolean;
}

export const QuestionGenerationControls: React.FC<
	QuestionGenerationControlsProps
> = ({
	answerableCount,
	setAnswerableCount,
	nonAnswerableCount,
	setNonAnswerableCount,
	apiKey,
	apiKeyLoading,
	onGenerate,
	isGenerating,
}) => (
	<div className="flex flex-wrap gap-6 items-end mb-6">
		<div>
			<label
				htmlFor="answerable-count"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Answerable
			</label>
			<input
				id="answerable-count"
				type="number"
				min={0}
				value={answerableCount}
				onChange={(e) => setAnswerableCount(Number(e.target.value))}
				className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div>
			<label
				htmlFor="non-answerable-count"
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				Non-Answerable
			</label>
			<input
				id="non-answerable-count"
				type="number"
				min={0}
				value={nonAnswerableCount}
				onChange={(e) => setNonAnswerableCount(Number(e.target.value))}
				className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div className="flex-1" />
		<div className="flex items-center gap-2">
			{apiKeyLoading ? (
				<span className="text-gray-500">Loading API key...</span>
			) : !apiKey ? (
				<span className="text-red-500 text-sm">
					Missing OpenAI API key. Configure your API key in Settings.
				</span>
			) : (
				<span className="text-green-600 text-sm font-medium">
					API key loaded from settings
				</span>
			)}
			<button
				type="button"
				className="px-5 py-2 bg-green-600 text-white rounded-md font-semibold shadow hover:bg-green-700 transition"
				onClick={onGenerate}
				disabled={!apiKey || isGenerating}
			>
				{isGenerating ? "Generating..." : "Generate"}
			</button>
		</div>
	</div>
);
