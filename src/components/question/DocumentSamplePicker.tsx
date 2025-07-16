import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample } from "../../types";

export const DocumentSamplePicker: React.FC = () => {
	const navigate = useNavigate();
	const {
		data: samples = [],
		isLoading,
		isError,
		error,
	} = useQuery<DocumentSample[]>({
		queryKey: queryKeys.documentSamples(),
		queryFn: async () => (await indexedDB.getDocumentSamples()) || [],
	});

	if (isLoading) {
		return <div className="p-4">Loading samples...</div>;
	}
	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Error loading samples:{" "}
				{error instanceof Error ? error.message : String(error)}
			</div>
		);
	}

	return (
		<div className="p-4">
			<h2 className="text-lg font-bold mb-2">Select a Document Sample</h2>
			<ul>
				{samples.map((sample) => (
					<li key={sample.id} className="mb-2">
						<Button
							type="button"
							className="w-full"
							variant="secondary"
							onClick={() =>
								navigate({ to: "/questions", search: { sample: sample.id } })
							}
						>
							{sample.name}
						</Button>
					</li>
				))}
			</ul>
			{samples.length === 0 && (
				<div className="text-muted-foreground italic text-center py-4 bg-muted/30 rounded">
					No samples yet.
				</div>
			)}
		</div>
	);
};
