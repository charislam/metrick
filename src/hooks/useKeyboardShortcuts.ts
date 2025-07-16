import { useCallback, useEffect } from "react";

interface UseKeyboardShortcutsProps {
	enabled: boolean;
	onScoreChange: (score: 0 | 1 | 2 | 3) => void;
	onPrevious: () => void;
	onNext: () => void;
}

const KEYBOARD_SHORTCUT_MAP = {
	h: 0,
	j: 1,
	k: 2,
	l: 3,
} as const;

export const KEYBOARD_SHORTCUT_REVERSE_MAP = {
	0: "h",
	1: "j",
	2: "k",
	3: "l",
} as const;

export const useKeyboardShortcuts = ({
	enabled,
	onScoreChange,
	onPrevious,
	onNext,
}: UseKeyboardShortcutsProps) => {
	const handleKeyboardShortcut = useCallback(
		(e: KeyboardEvent) => {
			if (!enabled) return;

			switch (e.key) {
				case "h":
				case "j":
				case "k":
				case "l":
					e.preventDefault();
					onScoreChange(KEYBOARD_SHORTCUT_MAP[e.key]);
					break;
				case "u":
					e.preventDefault();
					onPrevious();
					break;
				case "i":
					e.preventDefault();
					onNext();
					break;
			}
		},
		[enabled, onScoreChange, onPrevious, onNext],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyboardShortcut);
		return () =>
			document.removeEventListener("keydown", handleKeyboardShortcut);
	}, [handleKeyboardShortcut]);
};
