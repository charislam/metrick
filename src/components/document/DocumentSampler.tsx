import { DocumentSamplerForm } from "./DocumentSamplerForm";
import { DocumentSamplerSamples } from "./DocumentSamplerSamples";

export function DocumentSampler() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight mb-1">
					Create Document Sample
				</h2>
				<p className="text-muted-foreground mb-4 text-sm">
					Generate a new sample set of documents for annotation or review.
				</p>
				<DocumentSamplerForm />
			</div>
			<div className="border-t pt-6">
				<h3 className="text-lg font-semibold mb-2">Existing Samples</h3>
				<DocumentSamplerSamples />
			</div>
		</div>
	);
}
