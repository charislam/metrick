import { atom } from "jotai";
import type { AnnotationSessionWithRelations } from "@/types";

// Primary annotation session atom - single source of truth
export const currentAnnotationSessionAtom =
	atom<AnnotationSessionWithRelations | null>(null);

// Derived atom for unsaved changes tracking
export const hasUnsavedChangesAtom = atom((get) => {
	const session = get(currentAnnotationSessionAtom);
	return session?.hasUnsavedChanges ?? false;
});

// Simple navigation state (separate from data state)
export const annotationNavigationAtom = atom({
	currentIndex: 0,
});

// Sync status tracking
export const annotationSyncStatusAtom = atom<
	"idle" | "saving" | "saved" | "error"
>("idle");
