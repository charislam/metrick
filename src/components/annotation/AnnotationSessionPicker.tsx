import { useState } from "react";
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
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold">Annotation Sessions</h1>

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
	);
};
