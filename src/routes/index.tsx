import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
	return (
		<div className="flex flex-1 items-center justify-center min-h-[60vh] bg-background text-foreground transition-colors">
			<div className="bg-card rounded-xl shadow-lg p-8 border border-muted-200 dark:border-border/60 text-center">
				<h1 className="text-2xl font-bold mb-2">Home Page</h1>
				<p className="text-muted-foreground">
					Welcome to the LLM Evaluation Frontend App.
				</p>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
