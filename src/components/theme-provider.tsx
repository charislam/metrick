import { useAtom } from "jotai";
import { useEffect } from "react";
import { applyTheme, resolvedThemeAtom } from "../lib/theme";

interface ThemeProviderProps {
	children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [resolvedTheme] = useAtom(resolvedThemeAtom);

	useEffect(() => {
		applyTheme(resolvedTheme);
	}, [resolvedTheme]);

	return <>{children}</>;
}
