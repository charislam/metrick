import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
	answerableCount: z
		.number({ invalid_type_error: "Required" })
		.min(0, "Must be non-negative"),
	nonAnswerableCount: z
		.number({ invalid_type_error: "Required" })
		.min(0, "Must be non-negative"),
});

type FormValues = z.infer<typeof schema>;

interface QuestionGenerationControlsProps {
	onGenerate: (values: FormValues) => void;
	apiKey: string;
	apiKeyLoading: boolean;
	isGenerating: boolean;
}

export const QuestionGenerationControls: React.FC<
	QuestionGenerationControlsProps
> = ({ onGenerate, apiKey, apiKeyLoading, isGenerating }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { answerableCount: 12, nonAnswerableCount: 8 },
		mode: "onChange",
	});

	return (
		<form className="mb-6" onSubmit={handleSubmit(onGenerate)}>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
				<div className="flex flex-col gap-2">
					<Label htmlFor="answerable-count">Answerable</Label>
					<Input
						id="answerable-count"
						type="number"
						min={0}
						{...register("answerableCount", { valueAsNumber: true })}
						className="w-full"
					/>
					{errors.answerableCount && (
						<span className="text-xs text-red-500">
							{errors.answerableCount.message}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="non-answerable-count">Non-Answerable</Label>
					<Input
						id="non-answerable-count"
						type="number"
						min={0}
						{...register("nonAnswerableCount", { valueAsNumber: true })}
						className="w-full"
					/>
					{errors.nonAnswerableCount && (
						<span className="text-xs text-red-500">
							{errors.nonAnswerableCount.message}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-2 md:items-end">
					<Button
						type="submit"
						variant="default"
						disabled={!apiKey || isGenerating}
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
		</form>
	);
};
