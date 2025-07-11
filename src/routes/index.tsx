import { Link, createFileRoute } from "@tanstack/react-router";

function HomePage() {
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						LLM Evaluation Frontend
					</h1>
					<p className="text-xl text-gray-600">
						Evaluate search quality using nDCG and MAP metrics
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Link
						to="/documents"
						className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Document Management
							</h3>
							<p className="text-gray-600">
								Sample and manage document collections for evaluation
							</p>
						</div>
					</Link>

					<Link
						to="/questions"
						className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Question Generation
							</h3>
							<p className="text-gray-600">
								Generate and curate questions for evaluation
							</p>
						</div>
					</Link>

					<Link
						to="/annotation"
						className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Annotation Interface
							</h3>
							<p className="text-gray-600">
								Score document relevancy for questions
							</p>
						</div>
					</Link>
				</div>

				<div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Getting Started
					</h2>
					<div className="space-y-3 text-gray-600">
						<p>
							1. <strong>Document Management:</strong> Start by sampling
							documents from your database
						</p>
						<p>
							2. <strong>Question Generation:</strong> Generate questions using
							LLM or create them manually
						</p>
						<p>
							3. <strong>Annotation:</strong> Score document relevancy for each
							question
						</p>
						<p>
							4. <strong>Evaluation:</strong> Run evaluations and analyze
							results
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
