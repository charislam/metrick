import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DocumentSamplePicker } from "../../components/question/DocumentSamplePicker";
import { QuestionGenerator } from "../../components/question/QuestionGenerator";
import { DatabaseError } from "../../lib/error";
import { indexedDB } from "../../lib/indexed-db";

const QuestionsSearchSchema = z.object({
	sample: z.string().optional(),
});

const QuestionsPage = () => {
	const { sample } = Route.useSearch();

	const {
		data: validSample,
		isLoading,
		isError,
		error,
	} = useQuery<boolean, Error | null>({
		queryKey: ["validate-sample", sample],
		enabled: !!sample,
		queryFn: async () => {
			if (!sample) return false;
			try {
				const docSample = await indexedDB.getDocumentSample(sample);
				return !!docSample;
			} catch (err) {
				throw err instanceof Error
					? err
					: new DatabaseError("Unknown error", err);
			}
		},
	});

	if (!sample) {
		return <DocumentSamplePicker />;
	}
	if (isLoading) {
		return <div className="p-4">Loading...</div>;
	}
	if (isError || validSample === false) {
		return (
			<div className="p-4">
				<div className="text-red-500 mb-2">
					{error instanceof Error
						? error.message
						: "Invalid sample ID. Please select a valid sample."}
				</div>
				<DocumentSamplePicker />
			</div>
		);
	}
	return <QuestionGenerator sampleId={sample} />;
};

export const Route = createFileRoute("/questions/")({
	component: QuestionsPage,
	validateSearch: zodValidator(QuestionsSearchSchema),
});
