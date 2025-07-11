import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeToggle } from "../components/ui/theme-toggle";

export const Route = createRootRoute({
	component: () => (
		<div>
			<nav className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						to="/"
						activeProps={{
							className: "font-bold underline",
						}}
					>
						Home
					</Link>
					{" | "}
					<Link
						to="/documents"
						activeProps={{
							className: "font-bold underline",
						}}
					>
						Documents
					</Link>
					{" | "}
					<Link
						to="/questions"
						activeProps={{
							className: "font-bold underline",
						}}
					>
						Questions
					</Link>
					{" | "}
					<Link
						to="/settings"
						activeProps={{
							className: "font-bold underline",
						}}
					>
						Settings
					</Link>
				</div>
				<ThemeToggle />
			</nav>
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	),
});
