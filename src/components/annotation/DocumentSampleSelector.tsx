import type { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { DocumentSample } from "@/types";

interface DocumentSampleSelectorProps {
	control: Control<{ documentSampleId: string; questionIds: string[] }>;
	documentSamples: DocumentSample[];
}

export const DocumentSampleSelector = ({
	control,
	documentSamples,
}: DocumentSampleSelectorProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Document Sample</CardTitle>
			</CardHeader>
			<CardContent>
				<FormField
					control={control}
					name="documentSampleId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Select Document Sample</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a document sample" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{documentSamples.map((sample) => (
										<SelectItem key={sample.id} value={sample.id}>
											{sample.name} ({sample.documents.length} documents)
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};
