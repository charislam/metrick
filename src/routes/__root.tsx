import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { env } from "../lib/env";

export const Route = createRootRoute({
	component: () => (
		<div className="min-h-screen bg-background text-foreground transition-colors">
			<nav className="px-4 py-4 border-b border-border bg-card/80 dark:bg-card/90 flex items-center gap-2 justify-between shadow-sm">
				<div className="flex items-center gap-2">
					<Button asChild variant="ghost" size="sm">
						<Link
							to="/"
							activeProps={{
								className: "font-bold underline bg-muted dark:bg-muted/40",
							}}
						>
							Home
						</Link>
					</Button>
					<Button asChild variant="ghost" size="sm">
						<Link
							to="/documents"
							activeProps={{
								className: "font-bold underline bg-muted dark:bg-muted/40",
							}}
						>
							Documents
						</Link>
					</Button>
					<Button asChild variant="ghost" size="sm">
						<Link
							to="/questions"
							activeProps={{
								className: "font-bold underline bg-muted dark:bg-muted/40",
							}}
						>
							Questions
						</Link>
					</Button>
					<Button asChild variant="ghost" size="sm">
						<Link
							to="/settings"
							activeProps={{
								className: "font-bold underline bg-muted dark:bg-muted/40",
							}}
						>
							Settings
						</Link>
					</Button>
				</div>
				<ThemeToggle />
			</nav>
			<main className="flex flex-col flex-1">
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
