import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { Result, UnknownError } from "../../../lib/error";
import { indexedDB } from "../../../lib/indexed-db";
import type { Question } from "../../../types";

interface UseSaveQuestionsProps {
	questions: Pick<
		Question,
		"id" | "text" | "type" | "status" | "generatedBy"
	>[];
	sampleId: string;
	setSaveSuccess: (success: boolean) => void;
}

export function useSaveQuestions({
	questions,
	sampleId,
	setSaveSuccess,
}: UseSaveQuestionsProps) {
	const queryClient = useQueryClient();

	const saveMutation = useMutation({
		mutationFn: async () => {
			try {
				await Promise.all(
					questions
						.filter((q) => q.status === "accepted")
						.map(async (q) => {
							await indexedDB.saveQuestion({
								...q,
								createdAt: new Date(),
								updatedAt: new Date(),
								documentSampleId: sampleId,
							});
						}),
				);
				return Result.ok(undefined);
			} catch (e) {
				return Result.err(new UnknownError("Failed to save questions", e));
			}
		},
		onSuccess: (result) => {
			if (result.isOk()) {
				setSaveSuccess(true);
				setTimeout(() => setSaveSuccess(false), 2000);
				queryClient.invalidateQueries({
					queryKey: queryKeys.questions(),
				});
				queryClient.invalidateQueries({
					queryKey: queryKeys.questionsBySample(sampleId),
				});
			}
		},
	});

	return saveMutation;
}
