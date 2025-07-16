import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { indexedDB } from "../lib/indexed-db";
import type { AnnotationSessionWithRelations } from "../types";

export function useAnnotationSessions() {
	return useQuery<AnnotationSessionWithRelations[]>({
		queryKey: queryKeys.annotationSessions(),
		queryFn: async () => {
			const sessions = await indexedDB.getAnnotationSessionsWithRelations();
			return sessions ?? [];
		},
	});
}
