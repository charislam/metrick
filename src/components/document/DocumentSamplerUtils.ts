import { z } from "zod";
import type { Document } from "../../types";

export const schema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	guide: z.number().min(0),
	reference: z.number().min(0),
	troubleshooting: z.number().min(0),
});

export type FormValues = z.infer<typeof schema>;

export function stratifiedSample(
	guides: Document[],
	references: Document[],
	troubleshootings: Document[],
	guideCount: number,
	referenceCount: number,
	troubleshootingCount: number,
): Document[] {
	function sampleFrom(arr: Document[], n: number): Document[] {
		if (n <= 0 || arr.length === 0) return [];
		const result: Document[] = [];
		const used = new Set<number>();
		while (result.length < Math.min(n, arr.length)) {
			const idx = Math.floor(Math.random() * arr.length);
			if (!used.has(idx) && arr[idx] !== undefined) {
				used.add(idx);
				result.push(arr[idx]);
			}
		}
		return result;
	}
	return [
		...sampleFrom(guides, guideCount),
		...sampleFrom(references, referenceCount),
		...sampleFrom(troubleshootings, troubleshootingCount),
	];
}
