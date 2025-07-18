import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	onCreateSession: () => void;
}

export const EmptyState = ({ onCreateSession }: EmptyStateProps) => {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="rounded-full bg-muted p-6 mb-6">
				<FileText className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-semibold mb-2">No sessions yet</h2>
			<p className="text-muted-foreground mb-6 max-w-sm">
				Create your first annotation session to start evaluating
				document-question pairs.
			</p>
			<Button onClick={onCreateSession} size="lg" className="gap-2">
				<Plus className="h-4 w-4" />
				Create Your First Session
			</Button>
		</div>
	);
};
