import { Button } from "../ui/button";

interface EmptyStateProps {
	onCreateSession: () => void;
}

export const EmptyState = ({ onCreateSession }: EmptyStateProps) => {
	return (
		<div className="text-center py-8">
			<p className="text-gray-600 mb-4">No annotation sessions found.</p>
			<Button onClick={onCreateSession} variant="default">
				Create Your First Session
			</Button>
		</div>
	);
};
