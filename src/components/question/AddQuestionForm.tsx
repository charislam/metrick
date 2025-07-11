import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { indexedDB } from "../../lib/indexed-db";

const questionSchema = z.object({
	text: z.string().min(3, "Question must be at least 3 characters"),
	type: z.enum(["answerable", "non-answerable"]),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export const AddQuestionForm: React.FC<{ sampleId: string }> = ({
	sampleId,
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<QuestionFormValues>({
		resolver: zodResolver(questionSchema),
		defaultValues: {
			text: "",
			type: "answerable",
		},
	});

	const type = watch("type");

	const onSubmit = async (data: QuestionFormValues) => {
		await indexedDB.saveQuestion({
			id: crypto.randomUUID(),
			text: data.text,
			type: data.type,
			generatedBy: "manual",
			createdAt: new Date(),
			updatedAt: new Date(),
			documentSampleId: sampleId,
			status: "accepted",
		});
		reset();
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex gap-2 items-center mb-2"
		>
			<div className="flex flex-col">
				<Input
					className="w-64"
					placeholder="Add custom question..."
					{...register("text")}
				/>
				{errors.text && (
					<span className="text-xs text-red-500">{errors.text.message}</span>
				)}
			</div>
			<div className="flex flex-col">
				<Label htmlFor="type" className="sr-only">
					Type
				</Label>
				<Select
					value={type}
					onValueChange={(value) => {
						setValue("type", value as "answerable" | "non-answerable");
					}}
				>
					<SelectTrigger id="type">
						<SelectValue placeholder="Select type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="answerable">Answerable</SelectItem>
						<SelectItem value="non-answerable">Non-Answerable</SelectItem>
					</SelectContent>
				</Select>
				{errors.type && (
					<span className="text-xs text-red-500">{errors.type.message}</span>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting}>
				Add
			</Button>
		</form>
	);
};
