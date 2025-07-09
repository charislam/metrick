import { DocumentSampleCollection } from "../../components/document/DocumentSampleCollection";
import { DocumentSampler } from "../../components/document/DocumentSampler";

export default function DocumentsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 flex flex-col gap-8">
      <DocumentSampler />
      <DocumentSampleCollection />
    </div>
  );
}
