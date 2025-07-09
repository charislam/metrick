import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { indexedDB } from "../../lib/indexed-db";
import { fetchAllDocuments } from "../../lib/supabase";
import type { DocumentSample } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { FormValues } from "./DocumentSamplerUtils";
import { schema, stratifiedSample } from "./DocumentSamplerUtils";

export function useDocumentSamplerForm() {
  const queryClient = useQueryClient();
  const [localError, setLocalError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      guide: 12,
      reference: 8,
      troubleshooting: 5,
    },
  });

  const saveSampleMutation = useMutation({
    mutationFn: async (sample: DocumentSample) => {
      await indexedDB.saveDocumentSample(sample);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-samples"] });
      form.reset();
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLocalError(null);
    try {
      const result = await fetchAllDocuments();
      if (result.isErr()) {
        setLocalError(result.unwrapErr().message);
        return;
      }
      const { guides, references, troubleshootings } = result.unwrap();
      const { guide, reference, troubleshooting } = values;
      const totalRequested = guide + reference + troubleshooting;
      if (
        totalRequested >
        guides.length + references.length + troubleshootings.length
      ) {
        setLocalError(
          "Not enough documents available for the requested sample size."
        );
        return;
      }
      const sampledDocs = stratifiedSample(
        guides,
        references,
        troubleshootings,
        guide,
        reference,
        troubleshooting
      );
      if (sampledDocs.length < totalRequested) {
        setLocalError("Not enough documents of the requested types available.");
        return;
      }
      const sample: DocumentSample = {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description || "",
        documents: sampledDocs,
        samplingCriteria: {
          sampleSize: totalRequested,
          contentTypeDistribution: {
            guide,
            reference,
            troubleshooting,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveSampleMutation.mutate(sample);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError(`An unknown error occurred: ${err}`);
      }
    }
  };

  return {
    ...form,
    onSubmit,
    localError,
    saveSampleMutation,
  };
}

export function DocumentSamplerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    localError,
    saveSampleMutation,
  } = useDocumentSamplerForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-6">
      <Input placeholder="Sample Name" {...register("name")} />
      {errors.name && (
        <div className="text-red-500 text-xs">{errors.name.message}</div>
      )}
      <Input placeholder="Description" {...register("description")} />
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Guide"
          {...register("guide", { valueAsNumber: true })}
          min={0}
        />
        <Input
          type="number"
          placeholder="Reference"
          {...register("reference", { valueAsNumber: true })}
          min={0}
        />
        <Input
          type="number"
          placeholder="Troubleshooting"
          {...register("troubleshooting", { valueAsNumber: true })}
          min={0}
        />
      </div>
      {(errors.guide || errors.reference || errors.troubleshooting) && (
        <div className="text-red-500 text-xs">
          Check your content type counts.
        </div>
      )}
      {localError && <div className="text-red-500 text-xs">{localError}</div>}
      {saveSampleMutation.isError && (
        <div className="text-red-500 text-xs">
          {saveSampleMutation.error instanceof Error
            ? saveSampleMutation.error.message
            : "Failed to save sample."}
        </div>
      )}
      <Button type="submit" disabled={saveSampleMutation.status === "pending"}>
        {saveSampleMutation.status === "pending"
          ? "Creating..."
          : "Create Sample"}
      </Button>
    </form>
  );
}
