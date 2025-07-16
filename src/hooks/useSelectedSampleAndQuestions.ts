import { useQuery } from "@tanstack/react-query";
import { indexedDB } from "@/lib/indexed-db";
import { queryKeys } from "@/lib/query-keys";
import type { DocumentSample, Question } from "@/types";

export const useSelectedSampleAndQuestions = (selectedSampleId: string) => {
	const { data: documentSamples = [] } = useQuery<DocumentSample[]>({
		queryKey: queryKeys.documentSamples(),
		queryFn: () => indexedDB.getDocumentSamples(),
	});

	const { data: questions = [] } = useQuery<Question[]>({
		queryKey: queryKeys.questionsBySample(selectedSampleId),
		enabled: !!selectedSampleId,
		queryFn: () => indexedDB.getQuestionsByDocumentSample(selectedSampleId),
	});

	const selectedSample = documentSamples.find((s) => s.id === selectedSampleId);

	return {
		documentSamples,
		questions,
		selectedSample,
	};
};
