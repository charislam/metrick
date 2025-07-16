import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/lib/query-keys";
import { indexedDB } from "../../lib/indexed-db";
import { fetchAllDocuments } from "../../lib/supabase";
import type { DocumentSample } from "../../types";
import type { FormValues } from "./DocumentSamplerUtils";
import { schema, stratifiedSample } from "./DocumentSamplerUtils";

// Arrays for random name generation
const adjectives = [
	"purple",
	"electric",
	"cosmic",
	"golden",
	"silver",
	"crystal",
	"emerald",
	"sapphire",
	"midnight",
	"azure",
	"crimson",
	"amber",
	"jade",
	"ruby",
	"pearl",
	"diamond",
	"stellar",
	"lunar",
	"solar",
	"mystical",
	"ethereal",
	"radiant",
	"luminous",
	"brilliant",
	"serene",
	"vibrant",
	"majestic",
	"elegant",
	"graceful",
	"fierce",
	"bold",
	"swift",
	"gentle",
	"powerful",
	"ancient",
	"modern",
	"classic",
	"futuristic",
	"digital",
	"quantum",
	"blazing",
	"frozen",
	"velvet",
	"marble",
	"obsidian",
	"titanium",
	"platinum",
	"bronze",
	"copper",
	"iron",
	"steel",
	"chrome",
	"neon",
	"plasma",
	"ionic",
	"atomic",
	"nuclear",
	"kinetic",
	"magnetic",
	"gravity",
	"spiral",
	"vortex",
	"prism",
	"fractal",
	"holographic",
	"synthetic",
	"organic",
	"bio",
	"cyber",
	"nano",
	"micro",
	"macro",
	"ultra",
	"mega",
	"giga",
	"terra",
	"infinite",
	"eternal",
	"temporal",
	"spatial",
	"dimensional",
	"parallel",
	"alternate",
	"virtual",
	"augmented",
	"enhanced",
	"amplified",
	"maximized",
	"optimized",
	"refined",
	"polished",
	"pristine",
	"flawless",
	"perfect",
	"ideal",
	"ultimate",
	"supreme",
	"prime",
	"alpha",
	"beta",
	"gamma",
	"delta",
	"omega",
	"sigma",
	"zero",
	"one",
	"binary",
	"hexagonal",
	"octagonal",
	"triangular",
	"spherical",
	"cubic",
	"linear",
	"curved",
	"twisted",
	"spiral",
	"coiled",
	"woven",
	"braided",
	"knotted",
	"smooth",
	"rough",
	"sharp",
	"blunt",
	"fine",
	"coarse",
	"dense",
	"sparse",
	"thick",
	"thin",
	"wide",
	"narrow",
	"tall",
	"short",
	"deep",
	"shallow",
	"high",
	"low",
	"fast",
	"slow",
	"quick",
	"rapid",
	"instant",
	"gradual",
	"sudden",
	"smooth",
	"abrupt",
	"fluid",
	"rigid",
	"flexible",
	"elastic",
	"plastic",
	"ceramic",
	"glass",
	"wooden",
	"stone",
	"rock",
	"sand",
	"clay",
	"mud",
	"ice",
	"snow",
	"rain",
	"storm",
	"wind",
	"fire",
	"earth",
	"air",
	"light",
	"dark",
	"bright",
	"dim",
	"clear",
	"cloudy",
	"foggy",
	"misty",
	"transparent",
	"opaque",
	"translucent",
	"reflective",
	"refractive",
	"absorbing",
	"emitting",
	"radiating",
	"pulsing",
	"beating",
	"throbbing",
	"vibrating",
	"oscillating",
	"resonating",
	"echoing",
	"reverberating",
	"flowing",
	"streaming",
	"rushing",
	"trickling",
	"dripping",
	"splashing",
	"crashing",
	"rolling",
	"spinning",
	"rotating",
	"revolving",
	"orbiting",
	"circling",
	"looping",
	"cycling",
	"recurring",
	"emerging",
	"rising",
	"ascending",
	"climbing",
	"soaring",
	"floating",
	"hovering",
	"gliding",
	"diving",
	"plunging",
	"falling",
	"descending",
	"sinking",
	"settling",
	"resting",
	"sleeping",
	"dreaming",
	"awakening",
	"stirring",
	"moving",
	"shifting",
	"changing",
	"transforming",
	"evolving",
];

const nouns = [
	"cloud",
	"water",
	"mountain",
	"star",
	"moon",
	"sun",
	"ocean",
	"forest",
	"valley",
	"river",
	"storm",
	"flame",
	"crystal",
	"diamond",
	"pearl",
	"gem",
	"beacon",
	"tower",
	"bridge",
	"garden",
	"meadow",
	"harbor",
	"island",
	"cascade",
	"aurora",
	"nebula",
	"galaxy",
	"comet",
	"meteor",
	"prism",
	"echo",
	"whisper",
	"dream",
	"vision",
	"horizon",
	"sanctuary",
	"oasis",
	"fortress",
	"citadel",
	"haven",
	"realm",
	"kingdom",
	"empire",
	"domain",
	"territory",
	"region",
	"zone",
	"sector",
	"district",
	"quarter",
	"plaza",
	"square",
	"circle",
	"triangle",
	"polygon",
	"sphere",
	"cube",
	"pyramid",
	"cone",
	"cylinder",
	"spiral",
	"helix",
	"matrix",
	"grid",
	"network",
	"web",
	"mesh",
	"lattice",
	"framework",
	"structure",
	"architecture",
	"design",
	"pattern",
	"template",
	"blueprint",
	"schema",
	"model",
	"prototype",
	"sample",
	"specimen",
	"fragment",
	"particle",
	"atom",
	"molecule",
	"element",
	"compound",
	"mixture",
	"solution",
	"formula",
	"equation",
	"algorithm",
	"protocol",
	"sequence",
	"series",
	"chain",
	"link",
	"node",
	"vertex",
	"edge",
	"path",
	"route",
	"trail",
	"track",
	"line",
	"curve",
	"arc",
	"circle",
	"ring",
	"loop",
	"cycle",
	"orbit",
	"revolution",
	"rotation",
	"spin",
	"twist",
	"turn",
	"bend",
	"fold",
	"crease",
	"wave",
	"pulse",
	"beat",
	"rhythm",
	"tempo",
	"frequency",
	"wavelength",
	"amplitude",
	"phase",
	"signal",
	"transmission",
	"broadcast",
	"message",
	"code",
	"cipher",
	"key",
	"lock",
	"vault",
	"chamber",
	"room",
	"hall",
	"corridor",
	"passage",
	"tunnel",
	"cave",
	"cavern",
	"grotto",
	"alcove",
	"niche",
	"corner",
	"edge",
	"border",
	"boundary",
	"limit",
	"threshold",
	"gateway",
	"portal",
	"entrance",
	"exit",
	"door",
	"window",
	"mirror",
	"lens",
	"prism",
	"crystal",
	"glass",
	"window",
	"screen",
	"display",
	"interface",
	"panel",
	"board",
	"deck",
	"platform",
	"stage",
	"arena",
	"field",
	"ground",
	"floor",
	"ceiling",
	"roof",
	"wall",
	"fence",
	"barrier",
	"shield",
	"armor",
	"weapon",
	"tool",
	"instrument",
	"device",
	"machine",
	"engine",
	"motor",
	"generator",
	"reactor",
	"battery",
	"cell",
	"core",
	"heart",
	"soul",
	"spirit",
	"essence",
	"nature",
	"character",
	"personality",
	"identity",
	"signature",
	"mark",
	"sign",
	"symbol",
	"icon",
	"emblem",
	"badge",
	"token",
	"coin",
	"medallion",
	"trophy",
	"prize",
	"reward",
	"gift",
	"treasure",
	"fortune",
	"wealth",
	"riches",
	"jewel",
	"crown",
	"throne",
	"scepter",
	"staff",
	"wand",
	"rod",
	"pole",
	"mast",
	"pillar",
	"column",
	"beam",
	"support",
	"foundation",
	"base",
	"root",
	"stem",
	"branch",
	"leaf",
	"flower",
	"petal",
	"seed",
	"fruit",
	"tree",
	"plant",
	"herb",
	"grass",
	"moss",
	"fern",
	"vine",
	"shrub",
	"bush",
	"hedge",
];

function generateRandomName(): string {
	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective}-${randomNoun}`;
}

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
			queryClient.invalidateQueries({ queryKey: queryKeys.documentSamples() });
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
					"Not enough documents available for the requested sample size.",
				);
				return;
			}
			const sampledDocs = stratifiedSample(
				guides,
				references,
				troubleshootings,
				guide,
				reference,
				troubleshooting,
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
		setValue,
		formState: { errors },
		onSubmit,
		localError,
		saveSampleMutation,
	} = useDocumentSamplerForm();

	const handleGenerateName = () => {
		const randomName = generateRandomName();
		setValue("name", randomName);
	};

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
					<div className="flex gap-2">
						<Input
							id="sample-name"
							placeholder="Sample Name"
							{...register("name")}
							className="flex-1"
						/>
						<Button
							type="button"
							variant="circle"
							size="icon"
							onClick={handleGenerateName}
							title="Generate random name"
						>
							<Bot size={16} />
						</Button>
					</div>
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
