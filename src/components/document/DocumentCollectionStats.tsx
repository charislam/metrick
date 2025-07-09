import { useQuery } from "@tanstack/react-query";
import { fetchAllDocuments } from "../../lib/supabase";

export function DocumentCollectionStats() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<{
    guides: number;
    references: number;
    troubleshootings: number;
  }>({
    queryKey: ["all-documents-stats"],
    queryFn: async () => {
      const result = await fetchAllDocuments();
      const { guides, references, troubleshootings } = result.unwrap();
      return {
        guides: guides.length,
        references: references.length,
        troubleshootings: troubleshootings.length,
      };
    },
  });

  if (isLoading) {
    return <div>Loading document stats...</div>;
  }
  if (isError || !stats) {
    return <div className="text-red-500">Error loading document stats.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight mb-4">
        Document Collection Stats
      </h2>
      <div className="flex flex-col gap-4">
        <div className="bg-muted/30 rounded p-4 flex items-center justify-between">
          <span className="font-medium">Guides</span>
          <span className="font-bold text-lg">{stats.guides}</span>
        </div>
        <div className="bg-muted/30 rounded p-4 flex items-center justify-between">
          <span className="font-medium">References</span>
          <span className="font-bold text-lg">{stats.references}</span>
        </div>
        <div className="bg-muted/30 rounded p-4 flex items-center justify-between">
          <span className="font-medium">Troubleshooting Articles</span>
          <span className="font-bold text-lg">{stats.troubleshootings}</span>
        </div>
      </div>
    </div>
  );
}
