import { useQuery } from "@tanstack/react-query";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample } from "../../types";
import { Card } from "../ui/Card";

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

export function DocumentSamplerSamples() {
  const { samples, isLoading, isError, error } = useDocumentSamples();
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
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Size:</span>{" "}
            {sample.samplingCriteria.sampleSize} &bull;{" "}
            <span className="font-medium">Guide:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.guide},{" "}
            <span className="font-medium">Reference:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.reference},{" "}
            <span className="font-medium">Troubleshooting:</span>{" "}
            {sample.samplingCriteria.contentTypeDistribution.troubleshooting}
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
