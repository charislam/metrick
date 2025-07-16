import {
	AlertCircle,
	CheckCircle,
	Loader2,
	RotateCcw,
	Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SaveControlsProps {
	hasUnsavedChanges: boolean;
	syncStatus: "idle" | "saving" | "saved" | "error";
	onSave: () => void;
	onDiscard: () => void;
}

export function SaveControls({
	hasUnsavedChanges,
	syncStatus,
	onSave,
	onDiscard,
}: SaveControlsProps) {
	const getSyncStatusBadge = () => {
		switch (syncStatus) {
			case "saving":
				return (
					<Badge variant="secondary" className="gap-1">
						<Loader2 className="w-3 h-3 animate-spin" />
						Saving...
					</Badge>
				);
			case "saved":
				return (
					<Badge
						variant="default"
						className="gap-1 bg-green-100 text-green-800 hover:bg-green-100"
					>
						<CheckCircle className="w-3 h-3" />
						Saved
					</Badge>
				);
			case "error":
				return (
					<Badge variant="destructive" className="gap-1">
						<AlertCircle className="w-3 h-3" />
						Error
					</Badge>
				);
			default:
				return null;
		}
	};

	if (!hasUnsavedChanges && syncStatus === "idle") {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			{getSyncStatusBadge()}

			{hasUnsavedChanges && (
				<>
					<Button
						onClick={onSave}
						disabled={syncStatus === "saving"}
						size="sm"
						className="gap-1"
					>
						<Save className="w-3 h-3" />
						Save Changes
					</Button>

					<Button
						onClick={onDiscard}
						disabled={syncStatus === "saving"}
						variant="outline"
						size="sm"
						className="gap-1"
					>
						<RotateCcw className="w-3 h-3" />
						Discard
					</Button>
				</>
			)}
		</div>
	);
}
