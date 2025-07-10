import { z } from "zod";

const envSchema = z.object({
	VITE_SUPABASE_URL: z.string().url(),
	VITE_SUPABASE_PUBLIC_KEY: z.string().min(1),
});

// biome-ignore lint/plugin: this is where we validate the environment variables
const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
	// Print errors and crash early
	console.error(
		"Environment variable validation error:",
		parsed.error.format(),
	);
	throw new Error(
		"Missing or invalid environment variables. See above for details.",
	);
}

export const env = parsed.data;
