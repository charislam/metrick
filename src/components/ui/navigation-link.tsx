import { Link, type LinkProps } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button, type buttonVariants } from "./button";

export interface NavigationLinkProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	to: LinkProps["to"];
	children: React.ReactNode;
	linkProps?: Omit<LinkProps, "to" | "children">;
}

export const NavigationLink = React.forwardRef<
	HTMLButtonElement,
	NavigationLinkProps
>(({ to, children, linkProps, ...buttonProps }, ref) => (
	<Button asChild variant="ghost" size="sm" {...buttonProps} ref={ref}>
		<Link
			to={to}
			activeProps={{
				className: "font-bold underline bg-muted dark:bg-muted/40",
			}}
			{...linkProps}
		>
			{children}
		</Link>
	</Button>
));

NavigationLink.displayName = "NavigationLink";
