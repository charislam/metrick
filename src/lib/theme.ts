export type Theme = "dark" | "light" | "system";

const THEME_STORAGE_KEY = "theme";

export function getSystemTheme(): "dark" | "light" {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") return null;
	return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || null;
}

export function setStoredTheme(theme: Theme) {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getEffectiveTheme(): "dark" | "light" {
	const storedTheme = getStoredTheme();
	if (storedTheme === "system") {
		return getSystemTheme();
	}
	return storedTheme || getSystemTheme();
}

export function applyTheme(theme: Theme) {
	const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

	// Remove both classes first
	document.documentElement.classList.remove("dark", "light");
	// Add the effective theme class
	document.documentElement.classList.add(effectiveTheme);

	// Store the preference
	setStoredTheme(theme);
}

export function initializeTheme() {
	// Get the stored theme or default to system
	const theme = getStoredTheme() || "system";
	applyTheme(theme);

	// Listen for system theme changes
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", () => {
		if (getStoredTheme() === "system") {
			applyTheme("system");
		}
	});
}
