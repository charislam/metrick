import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AnnotationSessionPicker } from "@/components/annotation/AnnotationSessionPicker";
import { AnnotationWorkspace } from "@/components/annotation/AnnotationWorkspace";
import { useAnnotationSession } from "@/hooks/useAnnotationSession";

const AnnotationSearchSchema = z.object({
	session: z.string().optional(),
});

const AnnotationPage = () => {
	const { session: requestedSession } = Route.useSearch();

	const { session, isLoading, error } = useAnnotationSession(requestedSession);

	if (error) {
		return (
			<div className="p-4">
				<div className="text-red-500 mb-2">
					{error.message ||
						"An error occurred while fetching the Annotation Session."}
				</div>
				<AnnotationSessionPicker />
			</div>
		);
	}
	if (isLoading) {
		return <div className="p-4">Loading annotation session...</div>;
	}
	if (!requestedSession || !session) {
		return <AnnotationSessionPicker />;
	}
	return <AnnotationWorkspace sessionId={session.id} />;
};

export const Route = createFileRoute("/annotation/")({
	component: AnnotationPage,
	validateSearch: zodValidator(AnnotationSearchSchema),
});
