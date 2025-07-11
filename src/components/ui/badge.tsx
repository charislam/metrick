import type * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "secondary" | "destructive";
}

export function Badge({
	className,
	variant = "default",
	...props
}: BadgeProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
				{
					"bg-primary text-primary-foreground": variant === "default",
					"bg-muted text-muted-foreground": variant === "secondary",
					"bg-destructive text-destructive-foreground":
						variant === "destructive",
				},
				className,
			)}
			{...props}
		/>
	);
}
