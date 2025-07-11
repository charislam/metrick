import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
		<div className="max-w-lg min-w-md mx-auto mt-10 p-6 bg-card rounded shadow border border-muted-200 dark:border-border/60 transition-colors">
			<h1 className="text-2xl font-bold mb-4 text-foreground">Settings</h1>
			<form onSubmit={handleSave} className="space-y-4">
				<Label htmlFor="api-key" className="block text-foreground">
					OpenAI API Key
				</Label>
				<Input
					id="api-key"
					type="password"
					className="mt-1"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="sk-..."
					autoComplete="off"
				/>
				<div className="flex gap-2">
					<Button type="submit" disabled={saveMutation.isPending}>
						Save Key
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={!apiKey || deleteMutation.isPending}
					>
						Delete Key
					</Button>
				</div>
				{justSaved && (
					<div className="text-green-600 dark:text-green-400">Key saved!</div>
				)}
				<div className="text-muted-foreground mt-2">
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
