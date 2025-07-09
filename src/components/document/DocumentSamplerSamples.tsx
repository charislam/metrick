import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";

export function useDocumentSamples() {
  const {
    data: samples = [],
    isLoading,
    isError,
    error,
  } = useQuery<DocumentSample[]>({
    queryKey: ["document-samples"],
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
        <Button
          variant="secondary"
          size="icon"
          shape="circle"
          aria-label="Delete sample"
        >
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
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
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
      queryClient.invalidateQueries({ queryKey: ["document-samples"] });
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
          className="border border-muted-200 hover:shadow-md transition-shadow"
        >
          <div className="font-bold text-lg mb-1">{sample.name}</div>
          <div className="text-sm text-muted-foreground mb-1">
            {sample.description}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            <span className="font-medium">Size:</span>{" "}
            {sample.samplingCriteria.sampleSize} &bull;{" "}
            <span className="font-medium">Guide:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.guide},{" "}
            <span className="font-medium">Reference:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.reference},{" "}
            <span className="font-medium">Troubleshooting:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.troubleshooting}
          </div>
          <div className="flex gap-2 mt-2">
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
              variant="secondary"
              size="icon"
              shape="circle"
              onClick={() => alert(`Sample info for: ${sample.name}`)}
              aria-label="Sample info"
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button
              variant="primary"
              size="icon"
              shape="circle"
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
