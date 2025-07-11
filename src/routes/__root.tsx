import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeToggle } from "../components/ui/theme-toggle";

export const Route = createRootRoute({
	component: () => (
		<div>
			<nav className="px-4 py-4 border-b border-border mb-8 flex justify-between items-center bg-background">
				<div className="flex gap-4">
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
