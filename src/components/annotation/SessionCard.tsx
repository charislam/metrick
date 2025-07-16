import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnnotationSession } from "@/hooks/useAnnotationSession";
import type { AnnotationSessionWithRelations } from "@/types";

interface SessionCardProps {
	session: AnnotationSessionWithRelations;
	onSelect: (sessionId: string) => void;
}

export const SessionCard = ({ session, onSelect }: SessionCardProps) => {
	const status = useAnnotationSession(session.id)
	const { completed, total } = status.getProgress()
	const isComplete = completed >= total;

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onSelect(session.id);
	};

	return (
		<button type="button" onClick={handleClick}>
			<Card className="hover:shadow-md transition-shadow cursor-pointer">
				<CardHeader>
					<CardTitle>Session {session.id}</CardTitle>
					<div className="flex gap-4 text-sm text-gray-500">
						<span>
							Progress: {completed}/{total}
						</span>
						<span>Status: {isComplete ? "Complete" : "In Progress"}</span>
						<span>
							Created: {new Date(session.createdAt).toLocaleDateString()}
						</span>
						<span>
							Updated: {new Date(session.updatedAt).toLocaleDateString()}
						</span>
					</div>
				</CardHeader>
			</Card>
		</button>
	);
};
