import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAnnotationSessions } from "@/hooks/useAnnotationSessions";
import { useSessionNavigation } from "@/hooks/useSessionNavigation";
import { CreateAnnotationSession } from "./CreateAnnotationSession";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { SessionCard } from "./SessionCard";

export const AnnotationSessionPicker = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const { data: sessions = [], isLoading } = useAnnotationSessions();
	const { navigateToSession } = useSessionNavigation();

	const handleCreateSession = () => {
		setShowCreateForm(true);
	};

	const handleSessionSuccess = (sessionId: string) => {
		setShowCreateForm(false);
		navigateToSession(sessionId);
	};

	if (showCreateForm) {
		return (
			<CreateAnnotationSession
				onCancel={() => setShowCreateForm(false)}
				onSuccess={handleSessionSuccess}
			/>
		);
	}

	return (
		<div className="flex flex-col flex-1 py-12 px-4 justify-center items-center">
			<div className="w-full max-w-4xl rounded-xl shadow-lg p-8 border border-muted-200 dark:border-border/60 transition-colors">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold tracking-tight">
						Annotation Sessions
					</h1>
					{sessions.length > 0 && (
						<Button onClick={handleCreateSession} className="gap-2">
							<Plus className="h-4 w-4" />
							New Session
						</Button>
					)}
				</div>

				{isLoading ? (
					<LoadingState />
				) : sessions.length === 0 ? (
					<EmptyState onCreateSession={handleCreateSession} />
				) : (
					<div className="grid gap-4">
						{sessions.map((session) => (
							<SessionCard
								key={session.id}
								session={session}
								onSelect={navigateToSession}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
