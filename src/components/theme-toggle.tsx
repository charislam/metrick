import { useAtom } from "jotai";
import { Monitor, Moon, Sun } from "lucide-react";
import type React from "react";
import { type Theme, themeAtom } from "../lib/theme";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const [theme, setTheme] = useAtom(themeAtom);
	const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
		{ value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
		{ value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
		{ value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
	];
	return (
		<div className="flex items-center gap-1 rounded-md border p-1">
			{themes.map((t) => (
				<Button
					key={t.value}
					variant={theme === t.value ? "default" : "secondary"}
					size="icon"
					onClick={() => setTheme(t.value)}
					title={t.label}
					className="h-8 w-8"
				>
					{t.icon}
				</Button>
			))}
		</div>
	);
}
