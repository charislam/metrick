import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationControlsProps {
	currentPairIndex: number;
	totalPairs: number;
	onPrevious: () => void;
	onNext: () => void;
}

export const NavigationControls = ({
	currentPairIndex,
	totalPairs,
	onPrevious,
	onNext,
}: NavigationControlsProps) => {
	return (
		<div className="space-y-3">
			<div className="text-center space-y-2">
				<div className="text-xs text-muted-foreground font-medium">
					Currently annotating: {currentPairIndex + 1} of {totalPairs}
				</div>
				<div className="w-full bg-muted rounded-full h-1.5">
					<div
						className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${((currentPairIndex + 1) / totalPairs) * 100}%` }}
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onPrevious}
					disabled={currentPairIndex === 0}
					className="flex-1 h-8"
				>
					<ArrowLeft className="w-3 h-3 mr-1" />
					<span className="text-xs">Previous</span>
				</Button>
				<Button
					variant="default"
					size="sm"
					onClick={onNext}
					disabled={currentPairIndex >= totalPairs - 1}
					className="flex-1 h-8"
				>
					<span className="text-xs">Next</span>
					<ArrowRight className="w-3 h-3 ml-1" />
				</Button>
			</div>
		</div>
	);
};
