import { useAtom } from "jotai";
import { resolvedThemeAtom, themeAtom } from "./theme";

export function useTheme() {
	const [theme, setTheme] = useAtom(themeAtom);
	const [resolvedTheme] = useAtom(resolvedThemeAtom);
	return {
		theme,
		setTheme,
		resolvedTheme,
		isDark: resolvedTheme === "dark",
		isLight: resolvedTheme === "light",
	};
}
