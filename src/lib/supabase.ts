import { createClient } from "@supabase/supabase-js";
import { env } from "./env";
import { DatabaseError, Result, UnknownError } from "./error";

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabasePublicKey = env.VITE_SUPABASE_PUBLIC_KEY;

export const supabase = createClient(supabaseUrl, supabasePublicKey);

export async function fetchAllDocuments(): Promise<
	Result<
		{
			guides: import("../types").Document[];
			references: import("../types").Document[];
			troubleshootings: import("../types").Document[];
		},
		Error
	>
> {
	try {
		// Fetch guides/references
		const pagePromise = supabase
			.from("page")
			.select("id, meta, source, content");
		// Fetch troubleshooting entries
		const troubleshootingPromise = supabase
			.from("troubleshooting_entries")
			.select("id, title, api, errors, github_url, topics, keywords");

		const [pageRes, troubleshootingRes] = await Promise.all([
			pagePromise,
			troubleshootingPromise,
		]);
		if (pageRes.error) {
			return Result.err(
				new DatabaseError(
					"Error fetching documents from 'page' table in fetchAllDocuments",
					pageRes.error,
				),
			);
		}
		if (troubleshootingRes.error) {
			return Result.err(
				new DatabaseError(
					"Error fetching documents from 'troubleshooting_entries' table in fetchAllDocuments",
					troubleshootingRes.error,
				),
			);
		}

		const guides: import("../types").Document[] = [];
		const references: import("../types").Document[] = [];
		(pageRes.data ?? []).forEach((doc: unknown) => {
			if (typeof doc !== "object" || doc === null) return;
			const { id, meta, source, content } = doc as Record<string, unknown>;
			if (typeof id === "undefined" || typeof meta !== "object") return;
			const metaObj = (meta ?? {}) as Record<string, unknown>;
			const document: import("../types").Document = {
				id: String(id),
				title: typeof metaObj.title === "string" ? metaObj.title : "Untitled",
				content: typeof content === "string" ? content : "",
				contentType: source === "guide" ? "guide" : "reference",
				metadata: metaObj,
			};
			if (document.contentType === "guide") {
				guides.push(document);
			} else {
				references.push(document);
			}
		});

		const troubleshootings: import("../types").Document[] = [];
		(troubleshootingRes.data ?? []).forEach((doc: unknown) => {
			if (typeof doc !== "object" || doc === null) return;
			const { id, title, api, errors, github_url, topics, keywords } =
				doc as Record<string, unknown>;
			if (typeof id === "undefined") return;
			troubleshootings.push({
				id: String(id),
				title: typeof title === "string" ? title : "Untitled",
				content: "",
				contentType: "troubleshooting",
				metadata: {
					api,
					errors,
					github_url,
					topics,
					keywords,
				},
			});
		});

		return Result.ok({ guides, references, troubleshootings });
	} catch (err) {
		return Result.err(
			new UnknownError("Unknown error in fetchAllDocuments", err),
		);
	}
}
