import { useQuery } from "@tanstack/react-query";

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
		queryKey: ["openai-api-key"],
		queryFn: getApiKeyFromStorage,
	});
}
