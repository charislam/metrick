export const LoadingState = () => {
	return (
		<div className="p-4 text-center">
			<p>Loading annotation workspace...</p>
		</div>
	);
};

export const EmptyState = () => {
	return (
		<div className="p-4 text-center">
			<p>No question-document pairs found.</p>
		</div>
	);
};
