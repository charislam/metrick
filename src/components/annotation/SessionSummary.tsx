import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentSample, Question } from "@/types";

interface SessionSummaryProps {
	selectedSample: DocumentSample;
	selectedQuestions: Question[];
}

export const SessionSummary = ({
	selectedSample,
	selectedQuestions,
}: SessionSummaryProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Session Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-sm space-y-1">
					<p>Document Sample: {selectedSample.name}</p>
					<p>Documents: {selectedSample.documents.length}</p>
					<p>Questions: {selectedQuestions.length}</p>
					<p>
						Total Annotations:{" "}
						{selectedSample.documents.length * selectedQuestions.length}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
