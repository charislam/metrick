import { useNavigate } from "@tanstack/react-router";

export function useSessionNavigation() {
	const navigate = useNavigate();

	const navigateToSession = (sessionId: string) => {
		navigate({
			to: "/annotation",
			search: { session: sessionId },
		});
	};

	return { navigateToSession };
}
