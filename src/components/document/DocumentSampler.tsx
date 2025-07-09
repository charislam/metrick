import { DocumentSamplerForm } from "./DocumentSamplerForm";
import { DocumentSamplerSamples } from "./DocumentSamplerSamples";

export function DocumentSampler() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Create Document Sample</h2>
      <DocumentSamplerForm />
      <h3 className="text-lg font-semibold mb-2">Existing Samples</h3>
      <DocumentSamplerSamples />
    </div>
  );
}
