import { useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system";
	return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system";
}

function setStoredTheme(theme: Theme) {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function getEffectiveTheme(theme: Theme): "light" | "dark" {
	if (theme === "system") {
		return getSystemTheme();
	}
	return theme;
}

function applyTheme(theme: Theme) {
	const effectiveTheme = getEffectiveTheme(theme);
	const root = document.documentElement;

	// Remove both classes first
	root.classList.remove("light", "dark");

	// Add the effective theme class
	root.classList.add(effectiveTheme);

	// Set data attribute for additional styling if needed
	root.setAttribute("data-theme", effectiveTheme);
}

export function ThemeToggle({ className }: { className?: string }) {
	const [theme, setThemeState] = useState<Theme>(getStoredTheme());

	useEffect(() => {
		// Apply the theme when the component mounts
		applyTheme(theme);

		// Watch for system theme changes if using system preference
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => {
				applyTheme("system");
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [theme]);

	const changeTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		setStoredTheme(newTheme);
	};

	const themes: { value: Theme; label: string; icon: string }[] = [
		{ value: "light", label: "Light", icon: "☀️" },
		{ value: "dark", label: "Dark", icon: "🌙" },
		{ value: "system", label: "System", icon: "💻" },
	];

	return (
		<div
			className={cn(
				"flex items-center gap-1 p-1 rounded-lg bg-muted",
				className,
			)}
		>
			{themes.map(({ value, icon, label }) => (
				<Button
					key={value}
					variant={theme === value ? "primary" : "secondary"}
					size="icon"
					onClick={() => changeTheme(value)}
					title={label}
					className={cn(
						"h-8 w-8 transition-all duration-200",
						theme === value && "shadow-sm",
					)}
				>
					<span className="text-sm">{icon}</span>
				</Button>
			))}
		</div>
	);
}
