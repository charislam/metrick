import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6 text-foreground">
				LLM Evaluation Frontend
			</h1>
			<p className="text-lg text-muted-foreground mb-8">
				Welcome to the LLM evaluation platform. Use the navigation above to
				explore documents, questions, and settings.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="p-6 bg-card border border-border rounded-lg">
					<h2 className="text-xl font-semibold mb-3 text-card-foreground">
						Documents
					</h2>
					<p className="text-muted-foreground">
						Manage and organize your evaluation documents.
					</p>
				</div>
				<div className="p-6 bg-card border border-border rounded-lg">
					<h2 className="text-xl font-semibold mb-3 text-card-foreground">
						Questions
					</h2>
					<p className="text-muted-foreground">
						Create and manage evaluation questions.
					</p>
				</div>
				<div className="p-6 bg-card border border-border rounded-lg">
					<h2 className="text-xl font-semibold mb-3 text-card-foreground">
						Settings
					</h2>
					<p className="text-muted-foreground">
						Configure your application preferences.
					</p>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
