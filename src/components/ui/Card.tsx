import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ children, className = "", ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("bg-white rounded shadow p-4", className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);
Card.displayName = "Card";
