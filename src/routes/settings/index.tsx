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
		<div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-lg shadow border">
			<h1 className="text-2xl font-bold mb-6 text-foreground">Settings</h1>

			{/* Theme Section */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold mb-4 text-foreground">Theme</h2>
				<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
					<div>
						<p className="text-sm text-muted-foreground">Current theme</p>
						<p className="text-foreground font-medium">
							{(typeof window !== "undefined" &&
								localStorage.getItem("theme")) ||
								"system"}
						</p>
					</div>
					<div className="text-xs text-muted-foreground">
						Use the theme toggle in the navigation bar to change themes
					</div>
				</div>
			</div>

			{/* API Key Section */}
			<div>
				<h2 className="text-lg font-semibold mb-4 text-foreground">
					OpenAI API Key
				</h2>
				<form onSubmit={handleSave} className="space-y-4">
					<label className="block">
						<span className="text-foreground">API Key</span>
						<input
							type="password"
							className="mt-1 block w-full border border-input rounded px-3 py-2 bg-background text-foreground"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="sk-..."
							autoComplete="off"
						/>
					</label>
					<div className="flex gap-2">
						<button
							type="submit"
							className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
							disabled={saveMutation.isPending}
						>
							Save Key
						</button>
						<button
							type="button"
							className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 transition-colors"
							onClick={handleDelete}
							disabled={!apiKey || deleteMutation.isPending}
						>
							Delete Key
						</button>
					</div>
					{justSaved && <div className="text-green-600">Key saved!</div>}
					<div className="text-muted-foreground mt-2">
						{isLoading
							? "Loading keys..."
							: apiKey
							? "A key is saved (hidden for security)."
							: "No key saved."}
					</div>
				</form>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/settings/")({
	component: SettingsPage,
});
