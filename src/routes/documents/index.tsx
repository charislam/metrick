import { createFileRoute } from "@tanstack/react-router";
import { DocumentCollectionStats } from "../../components/document/DocumentCollectionStats";
import { DocumentSampler } from "../../components/document/DocumentSampler";

function DocumentsPage() {
	return (
		<div className="flex flex-col flex-1 bg-muted/50 py-12 px-4 justify-center items-center">
			<div className="w-full max-w-3xl space-y-10">
				<section className="bg-card rounded-xl shadow-lg p-8 border border-border">
					<DocumentSampler />
				</section>
				<section className="bg-card rounded-xl shadow-lg p-8 border border-border">
					<DocumentCollectionStats />
				</section>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/documents/")({
	component: DocumentsPage,
});
