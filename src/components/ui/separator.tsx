import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	thickness?: string;
}

export function Separator({
	className,
	orientation = "horizontal",
	thickness,
	...props
}: SeparatorProps) {
	return (
		<div
			className={cn(
				"bg-border",
				orientation === "horizontal"
					? thickness || "h-px w-full"
					: thickness || "w-px h-full",
				className,
			)}
			{...props}
		/>
	);
}
