import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavigationLink } from "@/components/ui/navigation-link";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
	component: () => (
		<div
			className={cn(
				"h-screen flex flex-col",
				"bg-background text-foreground transition-colors",
			)}
		>
			<nav
				className={cn(
					"flex-0",
					"px-4 py-4",
					"border-b border-border shadow-sm",
					"bg-card/80 dark:bg-card/90",
					"flex items-center gap-2 justify-between",
				)}
			>
				<div className="flex items-center gap-2">
					<NavigationLink to="/">Home</NavigationLink>
					<NavigationLink to="/documents">Documents</NavigationLink>
					<NavigationLink to="/questions">Questions</NavigationLink>
					<NavigationLink to="/annotation">Annotation</NavigationLink>
					<NavigationLink to="/settings">Settings</NavigationLink>
				</div>
				<ThemeToggle />
			</nav>
			<main className="flex-1 min-h-0 flex flex-col">
				<Outlet />
			</main>
			{env.DEV && (
				<>
					<TanStackRouterDevtools />
					<ReactQueryDevtools initialIsOpen={false} />
				</>
			)}
		</div>
	),
});
