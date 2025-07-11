import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Theme, applyTheme, getStoredTheme } from "../../lib/theme";

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		// Get the current theme on mount
		const currentTheme = getStoredTheme() || "system";
		setTheme(currentTheme);
	}, []);

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme);
		applyTheme(newTheme);
	};

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => handleThemeChange("light")}
				className={`p-2 rounded-md transition-colors ${
					theme === "light"
						? "bg-primary text-primary-foreground"
						: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
				}`}
				title="Light mode"
			>
				<Sun className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handleThemeChange("dark")}
				className={`p-2 rounded-md transition-colors ${
					theme === "dark"
						? "bg-primary text-primary-foreground"
						: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
				}`}
				title="Dark mode"
			>
				<Moon className="h-4 w-4" />
			</button>
			<button
				type="button"
				onClick={() => handleThemeChange("system")}
				className={`p-2 rounded-md transition-colors ${
					theme === "system"
						? "bg-primary text-primary-foreground"
						: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
				}`}
				title="System preference"
			>
				<Monitor className="h-4 w-4" />
			</button>
		</div>
	);
}
