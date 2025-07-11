export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

export function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system";
	return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system";
}

export function setStoredTheme(theme: Theme) {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function getEffectiveTheme(theme: Theme): "light" | "dark" {
	if (theme === "system") {
		return getSystemTheme();
	}
	return theme;
}

export function applyTheme(theme: Theme) {
	const effectiveTheme = getEffectiveTheme(theme);
	const root = document.documentElement;

	// Remove both classes first
	root.classList.remove("light", "dark");

	// Add the effective theme class
	root.classList.add(effectiveTheme);

	// Set data attribute for additional styling if needed
	root.setAttribute("data-theme", effectiveTheme);
}

export function initializeTheme() {
	const theme = getStoredTheme();
	applyTheme(theme);
	return theme;
}

export function watchSystemTheme(callback: (theme: "light" | "dark") => void) {
	if (typeof window === "undefined") return () => {};

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	const handleChange = (e: MediaQueryListEvent) => {
		callback(e.matches ? "dark" : "light");
	};

	mediaQuery.addEventListener("change", handleChange);

	return () => mediaQuery.removeEventListener("change", handleChange);
}
