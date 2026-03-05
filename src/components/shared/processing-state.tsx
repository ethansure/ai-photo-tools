"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStateProps {
  progress: number;
  message?: string;
  subMessage?: string;
  icon?: "wand" | "sparkles" | "loader";
  className?: string;
}

export function ProcessingState({ 
  progress, 
  message = "Processing...", 
  subMessage = "This usually takes about 30 seconds",
  icon = "wand",
  className 
}: ProcessingStateProps) {
  const IconComponent = {
    wand: Wand2,
    sparkles: Sparkles,
    loader: Loader2,
  }[icon];

  return (
    <div className={cn("py-12 text-center", className)}>
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center animate-pulse">
        <IconComponent className={cn(
          "h-12 w-12 text-white",
          icon === "loader" ? "animate-spin" : "animate-bounce"
        )} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6">{subMessage}</p>
      <div className="max-w-md mx-auto">
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}
