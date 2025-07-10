import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
	} = useForm<QuestionFormValues>({
		resolver: zodResolver(questionSchema),
		defaultValues: {
			text: "",
			type: "answerable",
		},
	});

	const onSubmit = async (data: QuestionFormValues) => {
		await indexedDB.saveQuestion({
			id: crypto.randomUUID(),
			text: data.text,
			type: data.type,
			category: "custom",
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
				<input
					className="border rounded px-2 py-1 w-64"
					placeholder="Add custom question..."
					{...register("text")}
				/>
				{errors.text && (
					<span className="text-xs text-red-500">{errors.text.message}</span>
				)}
			</div>
			<div className="flex flex-col">
				<select className="border rounded px-2 py-1" {...register("type")}>
					<option value="answerable">Answerable</option>
					<option value="non-answerable">Non-Answerable</option>
				</select>
				{errors.type && (
					<span className="text-xs text-red-500">{errors.type.message}</span>
				)}
			</div>
			<button
				type="submit"
				className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
				disabled={isSubmitting}
			>
				Add
			</button>
		</form>
	);
};
