import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KEYBOARD_SHORTCUT_REVERSE_MAP } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

interface RelevancyScorerProps {
	score: 0 | 1 | 2 | 3 | null;
	onScoreChange: (score: 0 | 1 | 2 | 3) => void;
	showKeyboardShortcuts?: boolean;
}

const scoreConfig = {
	0: {
		title: "Not Relevant",
		description:
			"Document does not contain any information related to the question",
		color: "bg-red-500 dark:bg-red-600",
		border: "border-red-200 dark:border-red-800",
		bg: "bg-red-50 dark:bg-red-950/50",
		hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
		hoverBg: "hover:bg-red-50 dark:hover:bg-red-950/50",
	},
	1: {
		title: "Slightly Relevant",
		description: "Document contains minimal or tangential information",
		color: "bg-orange-500 dark:bg-orange-600",
		border: "border-orange-200 dark:border-orange-800",
		bg: "bg-orange-50 dark:bg-orange-950/50",
		hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
		hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-950/50",
	},
	2: {
		title: "Relevant",
		description:
			"Document contains useful information that partially answers the question",
		color: "bg-blue-500 dark:bg-blue-600",
		border: "border-blue-200 dark:border-blue-800",
		bg: "bg-blue-50 dark:bg-blue-950/50",
		hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
		hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/50",
	},
	3: {
		title: "Highly Relevant",
		description:
			"Document contains comprehensive information that directly answers the question",
		color: "bg-green-500 dark:bg-green-600",
		border: "border-green-200 dark:border-green-800",
		bg: "bg-green-50 dark:bg-green-950/50",
		hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
		hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/50",
	},
} as const;

export const RelevancyScorer = ({
	score,
	onScoreChange,
	showKeyboardShortcuts = false,
}: RelevancyScorerProps) => {
	return (
		<div className="space-y-2">
			{([0, 1, 2, 3] as const).map((scoreValue) => {
				const config = scoreConfig[scoreValue];
				const isSelected = score === scoreValue;

				return (
					<Button
						key={scoreValue}
						variant="outline"
						size="sm"
						onClick={() => onScoreChange(scoreValue)}
						className={cn(
							"w-full h-auto p-3 text-left justify-start transition-all duration-200 group relative",
							isSelected
								? `${config.border} ${config.bg} border-2 shadow-sm`
								: `border-border hover:border-2 ${config.hoverBorder} ${config.hoverBg}`,
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						)}
					>
						<div className="flex items-center gap-3 w-full min-w-0">
							<div className="flex-shrink-0">
								<div
									className={cn(
										"w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-200",
										isSelected
											? config.color
											: "bg-muted group-hover:bg-muted-foreground/20",
									)}
								>
									{isSelected ? (
										<Check className="w-4 h-4" />
									) : (
										<span
											className={cn(
												"transition-colors text-xs",
												isSelected
													? "text-white"
													: "text-muted-foreground group-hover:text-foreground",
											)}
										>
											{scoreValue}
										</span>
									)}
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<div className="font-medium text-sm mb-1 truncate">
									{config.title}
								</div>
								<div className="text-xs text-muted-foreground leading-tight line-clamp-2">
									{config.description}
								</div>
							</div>
							{showKeyboardShortcuts && (
								<Badge
									variant="secondary"
									className="text-xs font-mono flex-shrink-0 px-2 py-1"
								>
									{KEYBOARD_SHORTCUT_REVERSE_MAP[scoreValue]}
								</Badge>
							)}
						</div>
					</Button>
				);
			})}
		</div>
	);
};
