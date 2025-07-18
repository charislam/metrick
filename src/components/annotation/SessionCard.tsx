import { Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnnotationSession } from "@/hooks/useAnnotationSession";
import type { AnnotationSessionWithRelations } from "@/types";

interface SessionCardProps {
	session: AnnotationSessionWithRelations;
	onSelect: (sessionId: string) => void;
}

export const SessionCard = ({ session, onSelect }: SessionCardProps) => {
	const status = useAnnotationSession(session.id);
	const { completed, total } = status.getProgress();
	const isComplete = completed >= total;

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onSelect(session.id);
	};

	return (
		<Card
			className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/30 hover:border-l-primary group"
			onClick={handleClick}
		>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg group-hover:text-primary transition-colors">
						Session {session.id.slice(-8)}
					</CardTitle>
					<Badge variant={isComplete ? "default" : "secondary"}>
						{isComplete ? "Complete" : "In Progress"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Target className="h-4 w-4" />
						<span className="font-medium text-foreground">
							{completed}/{total}
						</span>
						<span>completed</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>
							Created {new Date(session.createdAt).toLocaleDateString()}
						</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>
							Updated {new Date(session.updatedAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
