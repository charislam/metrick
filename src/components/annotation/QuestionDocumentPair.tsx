import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Document, Question } from "@/types";

interface QuestionDocumentPairProps {
	question: Question;
	document: Document;
	className?: string;
}

export const QuestionDocumentPair = ({
	question,
	document,
	className,
}: QuestionDocumentPairProps) => {
	return (
		<div className={cn("space-y-4 h-full flex flex-col", className)}>
			{/* Question Section */}
			<Card className="shadow-sm">
				<CardContent>
					<p className="text-base leading-relaxed text-foreground break-words">
						{question.text}
					</p>
				</CardContent>
			</Card>

			{/* Document Section */}
			<Card className="shadow-sm flex-1 min-h-0 flex flex-col gap-0 pb-0">
				<CardHeader className="pb-3 border-b">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-2 min-w-0">
							<FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
							<h3 className="text-lg font-semibold text-foreground truncate">
								{document.title}
							</h3>
						</div>
						<Badge className="flex-shrink-0">{document.contentType}</Badge>
					</div>
				</CardHeader>
				<CardContent className="flex-1 overflow-auto">
					<div className="py-6 font-mono text-foreground leading-relaxed whitespace-pre-wrap text-sm break-words">
						{document.content}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
