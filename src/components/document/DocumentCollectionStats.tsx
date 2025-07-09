import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { fetchAllDocuments } from "../../lib/supabase";
import { Button } from "../ui/Button";

export function DocumentCollectionStats() {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
    isFetching,
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
    staleTime: Infinity, // Cache indefinitely
    gcTime: Infinity, // Keep in memory indefinitely
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Loading document stats...</div>;
  }
  if (isError || !stats) {
    return <div className="text-red-500">Error loading document stats.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Document Collection Stats
        </h2>
        <Button
          variant="secondary"
          size="default"
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
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
