import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { queryKeys } from "@/lib/query-keys";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample } from "../../types";

export function useDocumentSamples() {
	const {
		data: samples = [],
		isLoading,
		isError,
		error,
	} = useQuery<DocumentSample[]>({
		queryKey: queryKeys.documentSamples(),
		queryFn: async () => (await indexedDB.getDocumentSamples()) || [],
	});
	return { samples, isLoading, isError, error };
}

function DocumentSampleDeleteButton({
	sample,
	open,
	onOpenChange,
	onConfirm,
	loading,
}: {
	sample: DocumentSample;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	loading: boolean;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant="circle" size="icon" aria-label="Delete sample">
					<Trash2 className="w-5 h-5" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Sample</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the sample "{sample.name}"? This
						action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="default" onClick={onConfirm} disabled={loading}>
						Confirm
					</Button>
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DocumentSamplerSamples() {
	const { samples, isLoading, isError, error } = useDocumentSamples();
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await indexedDB.deleteDocumentSample(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.documentSamples() });
			setDeleteId(null);
		},
	});
	if (isLoading)
		return <div className="text-muted-foreground">Loading samples...</div>;
	if (isError)
		return (
			<div className="text-destructive text-xs">
				{error instanceof Error ? error.message : String(error)}
			</div>
		);
	return (
		<div className="space-y-3">
			{samples.map((sample) => (
				<Card
					key={sample.id}
					className="border border-muted-200 hover:shadow-md transition-shadow p-0 overflow-hidden"
				>
					<div className="bg-muted/50 px-6 py-3 flex items-center justify-between">
						<div className="font-bold text-lg">{sample.name}</div>
						<div className="flex gap-2">
							<Badge variant="secondary">
								Size: {sample.samplingCriteria.sampleSize}
							</Badge>
							<Badge variant="default">
								Guide: {sample.samplingCriteria.contentTypeDistribution.guide}
							</Badge>
							<Badge variant="default">
								Reference:{" "}
								{sample.samplingCriteria.contentTypeDistribution.reference}
							</Badge>
							<Badge variant="default">
								Troubleshooting:{" "}
								{
									sample.samplingCriteria.contentTypeDistribution
										.troubleshooting
								}
							</Badge>
						</div>
					</div>
					{sample.description && (
						<div className="px-6 pt-2 pb-1 text-muted-foreground text-sm">
							{sample.description}
						</div>
					)}
					<div className="flex justify-end gap-2 px-6 pb-4">
						<DocumentSampleDeleteButton
							sample={sample}
							open={deleteId === sample.id}
							onOpenChange={(open: boolean) =>
								setDeleteId(open ? sample.id : null)
							}
							onConfirm={() => deleteMutation.mutate(sample.id)}
							loading={deleteMutation.isPending}
						/>
						<Button
							variant="circle"
							size="icon"
							onClick={() => alert(`Sample info for: ${sample.name}`)}
							aria-label="Sample info"
						>
							<Info className="w-5 h-5" />
						</Button>
						<Button
							variant="circle"
							size="icon"
							onClick={() => alert(`Annotate sample: ${sample.name}`)}
							aria-label="Annotate sample"
						>
							<Pencil className="w-5 h-5" />
						</Button>
					</div>
				</Card>
			))}
			{samples.length === 0 && (
				<div className="text-muted-foreground italic text-center py-4 bg-muted/30 rounded">
					No samples yet.
				</div>
			)}
		</div>
	);
}
