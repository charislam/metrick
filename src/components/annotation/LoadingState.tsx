import { Loader2 } from "lucide-react";

export const LoadingState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
			<Loader2 className="h-8 w-8 animate-spin mb-4" />
			<p className="text-lg">Loading sessions...</p>
		</div>
	);
};
