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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight mb-4">
        Document Collection
      </h2>
      {samples.length === 0 && (
        <div className="text-muted-foreground italic text-center py-4 bg-muted/30 rounded">
          No samples found.
        </div>
      )}
      {samples.map((sample) => (
        <div key={sample.id} className="mb-8">
          <div className="font-semibold mb-2 text-lg">
            Sample: {sample.name}
          </div>
          {sample.documents.length === 0 ? (
            <div className="text-muted-foreground text-sm mb-2">
              No documents in this sample.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sample.documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="border border-muted-200 hover:shadow-md transition-shadow"
                >
                  <div className="font-bold text-base mb-1">{doc.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Type: {doc.contentType}
                  </div>
                  <div className="text-sm line-clamp-2 text-muted-foreground">
                    {doc.content}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
