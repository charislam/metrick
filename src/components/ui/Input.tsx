import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					"border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
					className,
				)}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";
