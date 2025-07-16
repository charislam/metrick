import { Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KeyboardShortcut {
	key: string;
	action: string;
	color?: string;
}

const shortcuts: KeyboardShortcut[] = [
	{
		key: "h",
		action: "Score 0",
		color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	},
	{
		key: "j",
		action: "Score 1",
		color:
			"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
	},
	{
		key: "k",
		action: "Score 2",
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	},
	{
		key: "l",
		action: "Score 3",
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	},
	{ key: "u", action: "Previous pair" },
	{ key: "i", action: "Next pair" },
];

export const KeyboardShortcutsHelp = ({
	className,
}: {
	className?: string;
}) => {
	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-center gap-2 text-xs font-medium text-foreground">
				<Keyboard className="w-3 h-3" />
				Shortcuts
			</div>

			<div className="grid grid-cols-2 gap-1 text-xs">
				{shortcuts.map((shortcut) => (
					<div key={shortcut.key} className="flex items-center gap-1.5">
						<Badge
							variant="secondary"
							className={cn(
								"font-mono text-xs px-1.5 py-0.5 min-w-[18px] h-5 justify-center flex-shrink-0",
								shortcut.color,
							)}
						>
							{shortcut.key}
						</Badge>
						<span className="text-muted-foreground text-xs truncate">
							{shortcut.action}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
