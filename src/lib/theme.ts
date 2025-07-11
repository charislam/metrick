import { atom } from "jotai";
import { atomWithObservable, atomWithStorage } from "jotai/utils";
import { Observable } from "rxjs";

export type Theme = "light" | "dark" | "system";

export const themeAtom = atomWithStorage<Theme>("theme", "system");

// Observable that emits the system color scheme
function createSystemThemeObservable() {
	return new Observable<"light" | "dark">((subscriber) => {
		if (typeof window === "undefined") {
			subscriber.next("dark");
			subscriber.complete();
			return;
		}
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const emit = () => subscriber.next(media.matches ? "dark" : "light");
		emit();
		media.addEventListener("change", emit);
		return () => media.removeEventListener("change", emit);
	});
}

export const systemThemeAtom = atomWithObservable<"light" | "dark">(
	createSystemThemeObservable,
);

export const resolvedThemeAtom = atom((get) => {
	const theme = get(themeAtom);
	if (theme === "system") {
		return get(systemThemeAtom);
	}
	return theme;
});

export function applyTheme(theme: "light" | "dark") {
	const root = document.documentElement;
	if (theme === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
	root.style.colorScheme = theme;
}
