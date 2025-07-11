import { cn } from "./cn";

interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export function Card({ children, className }: CardProps) {
	return (
		<div
			className={cn(
				"bg-card rounded shadow p-4 border border-border",
				className,
			)}
		>
			{children}
		</div>
	);
}
