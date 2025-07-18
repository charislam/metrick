import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";

function HomePage() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Bot size={200} className="animate-wiggle" />
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
