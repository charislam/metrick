import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
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
					to="/annotation"
					activeProps={{
						className: "font-bold underline",
					}}
				>
					Annotation
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
			</nav>
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	),
});
