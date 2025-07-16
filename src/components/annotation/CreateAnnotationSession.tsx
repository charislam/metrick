import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DocumentSampleSelector } from "@/components/annotation/DocumentSampleSelector";
import { QuestionSelector } from "@/components/annotation/QuestionSelector";
import { SessionSummary } from "@/components/annotation/SessionSummary";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSelectedSampleAndQuestions } from "@/hooks/useSelectedSampleAndQuestions";
import { indexedDB } from "@/lib/indexed-db";
import { queryKeys } from "@/lib/query-keys";
import type { AnnotationSession } from "@/types";

const formSchema = z.object({
	documentSampleId: z.string().min(1, "Document sample is required"),
	questionIds: z
		.array(z.string())
		.min(1, "At least one question must be selected"),
});

type FormData = z.infer<typeof formSchema>;

function useSelectionForm({
	onSuccess,
}: {
	onSuccess: (sessionId: string) => void;
}) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			documentSampleId: "",
			questionIds: [],
		},
	});

	const queryClient = useQueryClient();
	const saveAnnotationMutation = useMutation({
		mutationFn: async (session: AnnotationSession) => {
			await indexedDB.saveAnnotationSession(session);
		},
		onSuccess: (_data, session) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.annotationSessions(),
			});
			onSuccess(session.id);
		},
	});

	const onSubmit = async (data: FormData) => {
		const session: AnnotationSession = {
			id: crypto.randomUUID(),
			documentSampleId: data.documentSampleId,
			questionIds: data.questionIds,
			annotationIds: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await saveAnnotationMutation.mutateAsync(session);
	};

	return {
		form,
		onSubmit,
	};
}

interface CreateAnnotationSessionProps {
	onCancel: () => void;
	onSuccess: (sessionId: string) => void;
}

export const CreateAnnotationSession = ({
	onCancel,
	onSuccess,
}: CreateAnnotationSessionProps) => {
	const { form, onSubmit } = useSelectionForm({ onSuccess });

	const watchedSampleId = form.watch("documentSampleId");
	const watchedQuestionIds = form.watch("questionIds");

	const { documentSamples, questions, selectedSample } =
		useSelectedSampleAndQuestions(watchedSampleId);

	const selectedQuestions = questions.filter((q) =>
		watchedQuestionIds.includes(q.id),
	);

	// Clear questions when sample changes
	const prevSampleIdRef = useRef(watchedSampleId);
	useEffect(() => {
		if (
			prevSampleIdRef.current !== watchedSampleId &&
			prevSampleIdRef.current !== ""
		) {
			form.setValue("questionIds", [], { shouldValidate: true });
		}
		prevSampleIdRef.current = watchedSampleId;
	}, [watchedSampleId, form.setValue]);

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex items-center gap-4 mb-6">
				<Button
					variant="ghost"
					onClick={onCancel}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>
				<h1 className="text-2xl font-bold">Create Annotation Session</h1>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<DocumentSampleSelector
						control={form.control}
						documentSamples={documentSamples}
					/>

					{watchedSampleId && (
						<QuestionSelector control={form.control} questions={questions} />
					)}

					{selectedSample && selectedQuestions.length > 0 && (
						<SessionSummary
							selectedSample={selectedSample}
							selectedQuestions={selectedQuestions}
						/>
					)}

					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit" disabled={!form.formState.isValid}>
							<Save className="w-4 h-4 mr-2" />
							Create Session
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
