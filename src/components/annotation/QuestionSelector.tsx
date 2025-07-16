import type { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import type { Question } from "@/types";

interface QuestionSelectorProps {
	control: Control<{ documentSampleId: string; questionIds: string[] }>;
	questions: Question[];
}

export const QuestionSelector = ({
	control,
	questions,
}: QuestionSelectorProps) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Questions</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<FormField
					control={control}
					name="questionIds"
					render={({ field }) => {
						const selectedIds = field.value || [];

						const handleQuestionToggle = (questionId: string) => {
							const newIds = selectedIds.includes(questionId)
								? selectedIds.filter((id) => id !== questionId)
								: [...selectedIds, questionId];
							field.onChange(newIds);
						};

						const handleSelectAll = () => {
							field.onChange(questions.map((q) => q.id));
						};

						const handleDeselectAll = () => {
							field.onChange([]);
						};

						return (
							<FormItem>
								<div className="flex justify-end items-center gap-2 mb-4">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleSelectAll}
										disabled={questions.length === 0}
									>
										Select All
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleDeselectAll}
										disabled={selectedIds.length === 0}
									>
										Deselect All
									</Button>
								</div>
								<div className="max-h-60 overflow-y-auto border rounded-lg p-4">
									{questions.length === 0 ? (
										<p className="text-gray-500">
											No questions found for this sample.
										</p>
									) : (
										<div className="space-y-2">
											{questions.map((question) => (
												<Label
													key={question.id}
													className="flex items-start gap-3 cursor-pointer"
												>
													<input
														type="checkbox"
														checked={selectedIds.includes(question.id)}
														onChange={() => handleQuestionToggle(question.id)}
														className="mt-1"
													/>
													<div className="flex-1">
														<p className="text-sm font-medium">
															{question.text}
														</p>
														<p className="text-xs text-gray-500">
															Type: {question.type} | Status: {question.status}
														</p>
													</div>
												</Label>
											))}
										</div>
									)}
								</div>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</CardContent>
		</Card>
	);
};
