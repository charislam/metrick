import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  return <div>Home Page</div>;
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
