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
  if (isLoading) return <div>Loading samples...</div>;
  if (isError)
    return (
      <div className="text-red-500 text-xs">
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  return (
    <div className="space-y-2">
      {samples.map((sample) => (
        <Card key={sample.id}>
          <div className="font-bold">{sample.name}</div>
          <div className="text-sm text-gray-600">{sample.description}</div>
          <div className="text-xs mt-1">
            Size: {sample.samplingCriteria.sampleSize} | Guide:{" "}
            {sample.samplingCriteria.contentTypeDistribution.guide}, Reference:{" "}
            {sample.samplingCriteria.contentTypeDistribution.reference},
            Troubleshooting:{" "}
            {sample.samplingCriteria.contentTypeDistribution.troubleshooting}
          </div>
        </Card>
      ))}
      {samples.length === 0 && (
        <div className="text-gray-500">No samples yet.</div>
      )}
    </div>
  );
}
