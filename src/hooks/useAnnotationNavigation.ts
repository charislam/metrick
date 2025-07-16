import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import {
	annotationNavigationAtom,
	currentAnnotationSessionAtom,
} from "@/lib/annotation-atoms";
import { useAnnotationSession } from "./useAnnotationSession";

export function useAnnotationNavigation() {
	const [navigation, setNavigation] = useAtom(annotationNavigationAtom);
	const session = useAtomValue(currentAnnotationSessionAtom);
	const { getProgress } = useAnnotationSession(session?.id)

	const total = getProgress().total;
	const currentIndex = navigation.currentIndex;

	const goToNext = useCallback(() => {
		const maxIndex = total - 1;
		setNavigation((prev) => ({
			...prev,
			currentIndex: Math.min(prev.currentIndex + 1, maxIndex),
		}));
	}, [total, setNavigation]);

	const goToPrevious = useCallback(() => {
		setNavigation((prev) => ({
			...prev,
			currentIndex: Math.max(prev.currentIndex - 1, 0),
		}));
	}, [setNavigation]);

	const goToIndex = useCallback(
		(index: number) => {
			const maxIndex = total - 1;
			const clampedIndex = Math.max(0, Math.min(index, maxIndex));
			setNavigation((prev) => ({ ...prev, currentIndex: clampedIndex }));
		},
		[total, setNavigation],
	);

	// Reset navigation when switching sessions
	const resetNavigation = useCallback(() => {
		setNavigation({ currentIndex: 0 });
	}, [setNavigation]);

	return {
		currentIndex,
		total,
		canGoNext: currentIndex < total - 1,
		canGoPrevious: currentIndex > 0,
		goToNext,
		goToPrevious,
		goToIndex,
		resetNavigation,
	};
}
