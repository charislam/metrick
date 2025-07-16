import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const LOCAL_STORAGE_KEY = "OPENAI_API_KEY";

export function getApiKeyFromStorage(): string {
	return localStorage.getItem(LOCAL_STORAGE_KEY) || "";
}

export function setApiKeyToStorage(key: string): void {
	localStorage.setItem(LOCAL_STORAGE_KEY, key);
}

export function removeApiKeyFromStorage(): void {
	localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function useApiKeyQuery() {
	return useQuery({
		queryKey: queryKeys.openaiApiKey(),
		queryFn: getApiKeyFromStorage,
	});
}
