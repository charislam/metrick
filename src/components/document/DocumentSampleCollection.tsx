import { useQuery } from "@tanstack/react-query";
import { indexedDB } from "../../lib/indexed-db";
import type { DocumentSample } from "../../types";
import { Card } from "../ui/Card";

export function DocumentSampleCollection() {
  const {
    data: samples = [],
    isLoading,
    isError,
  } = useQuery<DocumentSample[]>({
    queryKey: ["document-samples"],
    queryFn: async () => (await indexedDB.getDocumentSamples()) || [],
  });

  if (isLoading) {
    return <div>Loading document samples...</div>;
  }
  if (isError) {
    return <div className="text-red-500">Error loading document samples.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Document Collection</h2>
      {samples.length === 0 && (
        <div className="text-gray-500">No samples found.</div>
      )}
      {samples.map((sample) => (
        <div key={sample.id} className="mb-6">
          <div className="font-semibold mb-2">Sample: {sample.name}</div>
          {sample.documents.length === 0 ? (
            <div className="text-gray-400 text-sm mb-2">
              No documents in this sample.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sample.documents.map((doc) => (
                <Card key={doc.id}>
                  <div className="font-bold">{doc.title}</div>
                  <div className="text-xs text-gray-600 mb-1">
                    Type: {doc.contentType}
                  </div>
                  <div className="text-sm line-clamp-2">{doc.content}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
