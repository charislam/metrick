import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	removeApiKeyFromStorage,
	setApiKeyToStorage,
	useApiKeyQuery,
} from "../../lib/api-key";

export default function SettingsPage() {
	const queryClient = useQueryClient();
	const { data: apiKey = "", isLoading } = useApiKeyQuery();
	const [input, setInput] = useState("");
	const [justSaved, setJustSaved] = useState(false);

	const saveMutation = useMutation({
		mutationFn: async (key: string) => {
			setApiKeyToStorage(key);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["openai-api-key"] });
			setJustSaved(true);
			setInput("");
			setTimeout(() => setJustSaved(false), 1500);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async () => {
			removeApiKeyFromStorage();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["openai-api-key"] });
		},
	});

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			saveMutation.mutate(input.trim());
		}
	};

	const handleDelete = () => {
		deleteMutation.mutate();
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Settings</h1>
			<form onSubmit={handleSave} className="space-y-4">
				<label className="block">
					<span className="text-gray-700">OpenAI API Key</span>
					<input
						type="password"
						className="mt-1 block w-full border rounded px-3 py-2"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="sk-..."
						autoComplete="off"
					/>
				</label>
				<div className="flex gap-2">
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						disabled={saveMutation.isPending}
					>
						Save Key
					</button>
					<button
						type="button"
						className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
						onClick={handleDelete}
						disabled={!apiKey || deleteMutation.isPending}
					>
						Delete Key
					</button>
				</div>
				{justSaved && <div className="text-green-600">Key saved!</div>}
				<div className="text-gray-600 mt-2">
					{isLoading
						? "Loading keys..."
						: apiKey
							? "A key is saved (hidden for security)."
							: "No key saved."}
				</div>
			</form>
		</div>
	);
}

export const Route = createFileRoute("/settings/")({
	component: SettingsPage,
});
