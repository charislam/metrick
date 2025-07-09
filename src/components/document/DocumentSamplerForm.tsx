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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="sample-name"
            className="block text-sm font-medium text-muted-foreground"
          >
            Sample Name
          </label>
          <Input
            id="sample-name"
            placeholder="Sample Name"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-destructive text-xs mt-1">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="sample-description"
            className="block text-sm font-medium text-muted-foreground"
          >
            Description
          </label>
          <Input
            id="sample-description"
            placeholder="Description"
            {...register("description")}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="sample-guide"
          className="block text-sm font-medium text-muted-foreground mb-2"
        >
          Content Type Distribution
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label htmlFor="sample-guide" className="sr-only">
              Guide
            </label>
            <Input
              id="sample-guide"
              type="number"
              placeholder="Guide"
              min={0}
              {...register("guide", { valueAsNumber: true })}
            />
            <span className="block text-xs text-muted-foreground">Guide</span>
          </div>
          <div className="space-y-1">
            <label htmlFor="sample-reference" className="sr-only">
              Reference
            </label>
            <Input
              id="sample-reference"
              type="number"
              placeholder="Reference"
              min={0}
              {...register("reference", { valueAsNumber: true })}
            />
            <span className="block text-xs text-muted-foreground">
              Reference
            </span>
          </div>
          <div className="space-y-1">
            <label htmlFor="sample-troubleshooting" className="sr-only">
              Troubleshooting
            </label>
            <Input
              id="sample-troubleshooting"
              type="number"
              placeholder="Troubleshooting"
              min={0}
              {...register("troubleshooting", { valueAsNumber: true })}
            />
            <span className="block text-xs text-muted-foreground">
              Troubleshooting
            </span>
          </div>
        </div>
        {(errors.guide || errors.reference || errors.troubleshooting) && (
          <div className="text-destructive text-xs mt-1">
            Check your content type counts.
          </div>
        )}
      </div>
      {localError && (
        <div className="text-destructive text-xs">{localError}</div>
      )}
      {saveSampleMutation.isError && (
        <div className="text-destructive text-xs">
          {saveSampleMutation.error instanceof Error
            ? saveSampleMutation.error.message
            : "Failed to save sample."}
        </div>
      )}
      <Button
        type="submit"
        className="w-full mt-2"
        disabled={saveSampleMutation.status === "pending"}
      >
        {saveSampleMutation.status === "pending"
          ? "Creating..."
          : "Create Sample"}
      </Button>
    </form>
  );
}
