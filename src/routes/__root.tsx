import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import { env } from "../lib/env";

export const Route = createRootRoute({
	component: () => (
		<div>
			<nav className="px-4 py-4 border-b border-gray-200 flex gap-2">
				<Button asChild variant="ghost" size="sm">
					<Link
						to="/"
						activeProps={{ className: "font-bold underline bg-muted" }}
					>
						Home
					</Link>
				</Button>
				<Button asChild variant="ghost" size="sm">
					<Link
						to="/documents"
						activeProps={{ className: "font-bold underline bg-muted" }}
					>
						Documents
					</Link>
				</Button>
				<Button asChild variant="ghost" size="sm">
					<Link
						to="/questions"
						activeProps={{ className: "font-bold underline bg-muted" }}
					>
						Questions
					</Link>
				</Button>
				<Button asChild variant="ghost" size="sm">
					<Link
						to="/settings"
						activeProps={{ className: "font-bold underline bg-muted" }}
					>
						Settings
					</Link>
				</Button>
			</nav>
			<Outlet />
			{env.DEV && (
				<>
					<TanStackRouterDevtools />
					<ReactQueryDevtools initialIsOpen={false} />
				</>
			)}
		</div>
	),
});
