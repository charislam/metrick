import { useEffect, useState } from "react";
import type { Annotation, AnnotationSession, Document } from "../../types";
import { AnnotationFooter } from "./AnnotationFooter";
import { AnnotationHeader } from "./AnnotationHeader";
import { AnnotationSidebar } from "./AnnotationSidebar";
import { DocumentList } from "./DocumentList";
import { QuestionPanel } from "./QuestionPanel";

interface AnnotationWorkspaceProps {
	sessionId?: string;
}

export function AnnotationWorkspace({ sessionId }: AnnotationWorkspaceProps) {
	const [session, setSession] = useState<AnnotationSession | null>(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [annotations, setAnnotations] = useState<Annotation[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Mock data for development
	useEffect(() => {
		// TODO: Load session data from IndexedDB or API
		const mockSession: AnnotationSession = {
			id: "session-1",
			name: "Sample Annotation Session",
			description: "Testing annotation interface",
			documentSampleId: "sample-1",
			questions: [
				{
					id: "q1",
					text: "How do I install the application?",
					type: "answerable",
					generatedBy: "llm",
					createdAt: new Date(),
					updatedAt: new Date(),
					documentSampleId: "sample-1",
					status: "accepted",
				},
				{
					id: "q2",
					text: "What are the system requirements?",
					type: "answerable",
					generatedBy: "llm",
					createdAt: new Date(),
					updatedAt: new Date(),
					documentSampleId: "sample-1",
					status: "accepted",
				},
			],
			annotations: [],
			progress: {
				total: 2,
				completed: 0,
				remaining: 2,
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const mockDocuments: Document[] = [
			{
				id: "doc1",
				title: "Installation Guide",
				content:
					"This guide will walk you through the installation process step by step. First, download the installer from our website...",
				contentType: "guide",
				metadata: {},
			},
			{
				id: "doc2",
				title: "System Requirements",
				content:
					"Before installing the application, ensure your system meets the following requirements: Windows 10 or later, 4GB RAM minimum...",
				contentType: "reference",
				metadata: {},
			},
			{
				id: "doc3",
				title: "Troubleshooting Common Issues",
				content:
					"If you encounter problems during installation, try these common solutions. Check your antivirus settings...",
				contentType: "troubleshooting",
				metadata: {},
			},
		];

		setSession(mockSession);
		setIsLoading(false);
	}, []);

	const currentQuestion = session?.questions[currentQuestionIndex];
	const currentAnnotations = annotations.filter(
		(a) => a.questionId === currentQuestion?.id,
	);

	const handleAnnotationChange = (documentId: string, score: 0 | 1 | 2 | 3) => {
		const existingIndex = annotations.findIndex(
			(a) =>
				a.questionId === currentQuestion?.id && a.documentId === documentId,
		);

		if (existingIndex >= 0) {
			const updatedAnnotations = [...annotations];
			updatedAnnotations[existingIndex] = {
				...updatedAnnotations[existingIndex],
				relevancyScore: score,
				updatedAt: new Date(),
			};
			setAnnotations(updatedAnnotations);
		} else if (currentQuestion) {
			const newAnnotation: Annotation = {
				id: `annotation-${Date.now()}`,
				questionId: currentQuestion.id,
				documentId,
				relevancyScore: score,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			setAnnotations([...annotations, newAnnotation]);
		}
	};

	const handleNext = () => {
		if (currentQuestionIndex < (session?.questions.length || 0) - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleSave = () => {
		// TODO: Save annotations to IndexedDB
		console.log("Saving annotations:", annotations);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading annotation session...</div>
			</div>
		);
	}

	if (!session || !currentQuestion) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">No annotation session found</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<AnnotationHeader
					session={session}
					currentQuestionIndex={currentQuestionIndex}
					totalQuestions={session.questions.length}
				/>

				<div className="flex-1 flex overflow-hidden">
					{/* Question Panel */}
					<div className="w-1/3 border-r border-gray-200 bg-white">
						<QuestionPanel question={currentQuestion} />
					</div>

					{/* Document List */}
					<div className="flex-1 bg-white">
						<DocumentList
							documents={[]} // TODO: Load documents for current question
							annotations={currentAnnotations}
							onAnnotationChange={handleAnnotationChange}
						/>
					</div>
				</div>

				<AnnotationFooter
					onPrevious={handlePrevious}
					onNext={handleNext}
					onSave={handleSave}
					canGoPrevious={currentQuestionIndex > 0}
					canGoNext={currentQuestionIndex < session.questions.length - 1}
				/>
			</div>

			{/* Sidebar */}
			<div className="w-80 border-l border-gray-200 bg-white">
				<AnnotationSidebar
					session={session}
					annotations={annotations}
					currentQuestionIndex={currentQuestionIndex}
				/>
			</div>
		</div>
	);
}
