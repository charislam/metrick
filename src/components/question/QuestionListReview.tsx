import { useQuery } from "@tanstack/react-query";
import { indexedDB } from "../../lib/indexed-db";
import { QuestionReviewCard } from "./QuestionReviewCard";

export function QuestionListReview({ sampleId }: { sampleId: string }) {
	const {
		data: questions = [],
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["questions", sampleId],
		queryFn: async () => {
			const sample = await indexedDB.getDocumentSample(sampleId);
			return sample?.questions || [];
		},
	});

	if (isLoading) {
		return (
			<div className="text-center py-12 text-lg text-foreground">
				Loading questions...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-12 text-lg text-destructive">
				Error loading questions.
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className="text-center text-muted-foreground py-12 text-lg bg-card rounded-xl border border-dashed border-border">
				No questions generated yet.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{questions.map((question, index) => (
				<QuestionReviewCard key={index} question={question} />
			))}
		</div>
	);
}
