import { useEffect } from "react";
import { useAnnotationNavigation } from "@/hooks/useAnnotationNavigation";
import { useAnnotationSession } from "@/hooks/useAnnotationSession";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { EmptyState, LoadingState } from "./AnnotationStates";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { NavigationControls } from "./NavigationControls";
import { QuestionDocumentPair } from "./QuestionDocumentPair";
import { RelevancyScorer } from "./RelevancyScorer";
import { SaveControls } from "./SaveControls";

interface AnnotationWorkspaceProps {
	sessionId: string;
}

export const AnnotationWorkspace = ({
	sessionId,
}: AnnotationWorkspaceProps) => {
	const {
		session,
		isLoading,
		error,
		hasUnsavedChanges,
		syncStatus,
		updateAnnotation,
		saveChanges,
		discardChanges,
		getCurrentPair,
		getProgress,
	} = useAnnotationSession(sessionId);

	const { currentIndex, total, goToNext, goToPrevious, resetNavigation } =
		useAnnotationNavigation();

	// Reset navigation when switching sessions
	useEffect(() => {
		resetNavigation();
	}, [resetNavigation]);

	const currentPair = getCurrentPair(currentIndex);
	const progress = getProgress();

	useKeyboardShortcuts({
		enabled: !!session && !!currentPair,
		onScoreChange: (score) => {
			if (currentPair) {
				updateAnnotation(currentPair.questionId, currentPair.documentId, score);
			}
		},
		onPrevious: goToPrevious,
		onNext: goToNext,
	});

	if (isLoading || !session) {
		return <LoadingState />;
	}

	if (error) {
		return <EmptyState />;
	}

	if (!currentPair) {
		return <EmptyState />;
	}

	return (
		<div className="flex-1 min-h-0 flex flex-col">
			{/* Header with Save Controls */}
			<div className="p-4 border-b">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-lg font-semibold">Annotation Session</h1>
						<p className="text-sm text-muted-foreground">
							{progress.completed} of {progress.total} pairs annotated (
							{progress.percentage}%)
						</p>
					</div>
					<SaveControls
						hasUnsavedChanges={hasUnsavedChanges}
						syncStatus={syncStatus}
						onSave={saveChanges}
						onDiscard={discardChanges}
					/>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex min-h-0">
				<div className="flex-1 p-4">
					<QuestionDocumentPair
						className="max-w-2xl mx-auto"
						question={currentPair.question}
						document={currentPair.document}
					/>
				</div>

				{/* Compact Right Sidebar */}
				<div className="w-80 border-l flex flex-col">
					<div className="p-4 border-b">
						<h3 className="font-semibold text-sm">Score Relevancy</h3>
					</div>

					<div className="flex-1 overflow-auto p-4 space-y-4">
						<RelevancyScorer
							score={currentPair.annotation?.relevancyScore ?? null}
							onScoreChange={(score) =>
								updateAnnotation(
									currentPair.questionId,
									currentPair.documentId,
									score,
								)
							}
							showKeyboardShortcuts={true}
						/>
					</div>

					<div className="p-4 border-t space-y-4">
						<NavigationControls
							currentPairIndex={currentIndex}
							totalPairs={total}
							onPrevious={goToPrevious}
							onNext={goToNext}
						/>

						<KeyboardShortcutsHelp />
					</div>
				</div>
			</div>
		</div>
	);
};
