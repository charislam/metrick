import { useState } from "react";
import type { Annotation, Document } from "../../types";

interface DocumentListProps {
	documents: Document[];
	annotations: Annotation[];
	onAnnotationChange: (documentId: string, score: 0 | 1 | 2 | 3) => void;
}

export function DocumentList({
	documents,
	annotations,
	onAnnotationChange,
}: DocumentListProps) {
	const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(
		new Set(),
	);

	// Mock documents for development
	const mockDocuments: Document[] = [
		{
			id: "doc1",
			title: "Installation Guide",
			content:
				"This guide will walk you through the installation process step by step. First, download the installer from our website. Make sure you have administrator privileges on your system. Run the installer and follow the on-screen instructions. The installation typically takes 5-10 minutes depending on your system specifications.",
			contentType: "guide",
			metadata: {},
		},
		{
			id: "doc2",
			title: "System Requirements",
			content:
				"Before installing the application, ensure your system meets the following requirements: Windows 10 or later, 4GB RAM minimum, 2GB free disk space, DirectX 11 compatible graphics card. For optimal performance, we recommend Windows 11 with 8GB RAM and an SSD.",
			contentType: "reference",
			metadata: {},
		},
		{
			id: "doc3",
			title: "Troubleshooting Common Issues",
			content:
				"If you encounter problems during installation, try these common solutions. Check your antivirus settings and temporarily disable it during installation. Ensure you have sufficient disk space. Run the installer as administrator. If the problem persists, check our support forum for specific error codes.",
			contentType: "troubleshooting",
			metadata: {},
		},
	];

	const displayDocuments = documents.length > 0 ? documents : mockDocuments;

	const toggleDocumentExpansion = (documentId: string) => {
		const newExpanded = new Set(expandedDocuments);
		if (newExpanded.has(documentId)) {
			newExpanded.delete(documentId);
		} else {
			newExpanded.add(documentId);
		}
		setExpandedDocuments(newExpanded);
	};

	const getAnnotationForDocument = (documentId: string) => {
		return annotations.find((a) => a.documentId === documentId);
	};

	const getContentTypeColor = (contentType: string) => {
		switch (contentType) {
			case "guide":
				return "bg-blue-100 text-blue-800";
			case "reference":
				return "bg-green-100 text-green-800";
			case "troubleshooting":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="h-full overflow-y-auto p-6">
			<div className="space-y-4">
				{displayDocuments.map((document) => {
					const annotation = getAnnotationForDocument(document.id);
					const isExpanded = expandedDocuments.has(document.id);
					const previewLength = 150;
					const displayContent = isExpanded
						? document.content
						: document.content.length > previewLength
						? `${document.content.substring(0, previewLength)}...`
						: document.content;

					return (
						<div
							key={document.id}
							className="bg-white border border-gray-200 rounded-lg p-4"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										{document.title}
									</h3>
									<div className="flex items-center space-x-2 mb-2">
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(
												document.contentType,
											)}`}
										>
											{document.contentType}
										</span>
									</div>
								</div>
							</div>

							<div className="mb-4">
								<p className="text-sm text-gray-700 leading-relaxed">
									{displayContent}
								</p>
								{document.content.length > previewLength && (
									<button
										type="button"
										onClick={() => toggleDocumentExpansion(document.id)}
										className="text-blue-600 hover:text-blue-800 text-sm mt-2"
									>
										{isExpanded ? "Show less" : "Show more"}
									</button>
								)}
							</div>

							<div className="border-t border-gray-200 pt-4">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-gray-900">
										Relevancy Score:
									</label>
									<div className="flex space-x-2">
										{[0, 1, 2, 3].map((score) => (
											<button
												key={score}
												type="button"
												onClick={() =>
													onAnnotationChange(
														document.id,
														score as 0 | 1 | 2 | 3,
													)
												}
												className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
													annotation?.relevancyScore === score
														? "bg-blue-600 border-blue-600 text-white"
														: "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
												}`}
											>
												{score}
											</button>
										))}
									</div>
								</div>
								{annotation?.relevancyScore !== undefined && (
									<div className="mt-2 text-xs text-gray-600">
										{annotation.relevancyScore === 0 &&
											"Not Relevant: No information related to the question"}
										{annotation.relevancyScore === 1 &&
											"Slightly Relevant: Minimal or tangential information"}
										{annotation.relevancyScore === 2 &&
											"Relevant: Useful information that partially answers"}
										{annotation.relevancyScore === 3 &&
											"Highly Relevant: Comprehensive information that directly answers"}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
