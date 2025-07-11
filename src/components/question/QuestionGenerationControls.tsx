import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
	<div className="mb-6">
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
			<div className="flex flex-col gap-2">
				<Label htmlFor="answerable-count">Answerable</Label>
				<Input
					id="answerable-count"
					type="number"
					min={0}
					value={answerableCount}
					onChange={(e) => setAnswerableCount(Number(e.target.value))}
					className="w-full"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="non-answerable-count">Non-Answerable</Label>
				<Input
					id="non-answerable-count"
					type="number"
					min={0}
					value={nonAnswerableCount}
					onChange={(e) => setNonAnswerableCount(Number(e.target.value))}
					className="w-full"
				/>
			</div>
			<div className="flex flex-col gap-2 md:items-end">
				<Button
					type="button"
					variant="default"
					disabled={!apiKey || isGenerating}
					onClick={onGenerate}
					className="w-full md:w-auto"
				>
					{isGenerating ? "Generating..." : "Generate"}
				</Button>
			</div>
		</div>
		<div className="mt-2 min-h-[1.5em]">
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
		</div>
	</div>
);
