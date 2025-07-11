import { createFileRoute } from "@tanstack/react-router";
import { AnnotationWorkspace } from "../components/annotation/AnnotationWorkspace";

export const Route = createFileRoute("/annotation")({
	component: AnnotationPage,
});

function AnnotationPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<AnnotationWorkspace />
		</div>
	);
}
