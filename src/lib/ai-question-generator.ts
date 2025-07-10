import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { Result, UnknownError } from "../lib/error";
import type { Document } from "../types";

export interface GenerateQuestionsOptions {
	answerableCount: number;
	nonAnswerableCount: number;
}

const systemPrompt = `You are a helpful assistant who is familiar with software engineering using Supabase. You are provided with sets of documents. For each set, you will be asked to generate two sets of questions:

1. Answerable questions: questions that can be answered by the documents.
2. Non-answerable questions: questions that cannot be answered by the documents.

Before generating any questions, evaluate each documentation carefully to determine what information it contains. Generate a range of answerable questions, including questions that are obviously answerable, and questions that require a deeper understanding of the content in one or several of the documents. Generate a range of non-answerable questions that differ from each other, but make them all related to software engineering using Supabase.

Return your response as a JSON object with exactly two fields:
- 'answerable': an array of answerable question strings
- 'nonAnswerable': an array of non-answerable question strings

## Example

### Example documents

Document 1 (ID: 1):
Title: Supabase overview
Content: Supabase is a modern, open-source database platform that provides a comprehensive set of tools for building web and mobile applications. It offers a range of features, including real-time data synchronization, authentication, and storage.

Document 2 (ID: 2):
Title: Supabase authentication
Content: Supabase provides a range of authentication options, including email/password, social login (Google, GitHub, etc.), and magic links. It also supports multi-factor authentication (MFA) for enhanced security.

### Example output

{
  "answerable": ["What is Supabase?", "How can I secure user logins using Supabase?"],
  "nonAnswerable": ["How do you deploy to AWS Lambda?", "How do I add a new column to a table in Postgres?"]
}`;

const questionsSchema = z.object({
	answerable: z.array(z.string()),
	nonAnswerable: z.array(z.string()),
});

/**
 * Generates AI questions for a set of documents using an LLM.
 * @param documents Array of Document objects to generate questions from
 * @param options Generation options (answerable/non-answerable counts)
 * @param apiKey User's OpenAI API key
 * @returns Promise resolving to an object with answerable and nonAnswerable arrays
 */
export async function generateQuestions(
	documents: Document[],
	options: GenerateQuestionsOptions,
	apiKey: string,
): Promise<
	Result<{ answerable: string[]; nonAnswerable: string[] }, UnknownError>
> {
	const { answerableCount, nonAnswerableCount } = options;
	const docSummaries = documents
		.map(
			(doc, i) =>
				`Document ${i + 1} (ID: ${doc.id}):\nTitle: ${doc.title}\nContent: ${doc.content}...\n`,
		)
		.join("\n");

	const prompt = `Here are the documents. Generate ${answerableCount} answerable and ${nonAnswerableCount} non-answerable questions.

Documents:
${docSummaries}`;

	try {
		const openai = createOpenAI({ apiKey });
		const result = await generateObject({
			model: openai.chat("gpt-4o"),
			schema: questionsSchema,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: prompt },
			],
		});
		return Result.ok(result.object);
	} catch (err) {
		return Result.err(new UnknownError(`AI question generation failed`, err));
	}
}
