import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "./cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
				secondary:
					"bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
			},
			size: {
				default: "h-10 px-4 py-2",
				icon: "h-9 w-9 p-0",
			},
			shape: {
				default: "rounded-md",
				circle: "rounded-full border border-muted-300",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
			shape: "default",
		},
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, shape, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, shape, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";
