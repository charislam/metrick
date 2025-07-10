import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<div>
			<nav className="px-4 py-4 border-b border-gray-200 mb-8">
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
			</nav>
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	),
});
