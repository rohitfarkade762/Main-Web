import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HighlightCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "success" | "warning" | "destructive" | "primary";
  icon?: ReactNode;
  className?: string;
}

export function HighlightCard({
  title,
  value,
  subtitle,
  variant = "success",
  icon,
  className,
}: HighlightCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group",
        variant === "success" && "border-success/30 bg-gradient-to-br from-success/10 via-success/5 to-card hover:border-success/50",
        variant === "warning" && "border-warning/30 bg-gradient-to-br from-warning/10 via-warning/5 to-card hover:border-warning/50",
        variant === "destructive" && "border-destructive/30 bg-gradient-to-br from-destructive/10 via-destructive/5 to-card hover:border-destructive/50",
        variant === "primary" && "border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-card hover:border-primary/50",
        className
      )}
    >
      {/* Top accent line */}
      <div className={cn(
        "h-1 w-full transition-all duration-300",
        variant === "success" && "bg-gradient-electric from-success to-success/60",
        variant === "warning" && "bg-gradient-to-r from-warning to-warning/60",
        variant === "destructive" && "bg-gradient-to-r from-destructive to-destructive/60",
        variant === "primary" && "bg-gradient-hero-alt"
      )} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold font-display transition-all duration-300 group-hover:scale-105",
              variant === "success" && "text-success",
              variant === "warning" && "text-warning",
              variant === "destructive" && "text-destructive",
              variant === "primary" && "text-primary"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm font-medium text-foreground/80 mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              variant === "success" && "bg-success/20 text-success",
              variant === "warning" && "bg-warning/20 text-warning",
              variant === "destructive" && "bg-destructive/20 text-destructive",
              variant === "primary" && "bg-primary/20 text-primary"
            )}>
              {icon}
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-4 flex gap-1">
          <div className={cn(
            "h-1 flex-1 rounded-full transition-all duration-500 group-hover:flex-[2]",
            variant === "success" && "bg-success/30",
            variant === "warning" && "bg-warning/30",
            variant === "destructive" && "bg-destructive/30",
            variant === "primary" && "bg-primary/30"
          )} />
          <div className={cn(
            "h-1 flex-1 rounded-full transition-all duration-500",
            variant === "success" && "bg-success/20",
            variant === "warning" && "bg-warning/20",
            variant === "destructive" && "bg-destructive/20",
            variant === "primary" && "bg-primary/20"
          )} />
          <div className={cn(
            "h-1 flex-1 rounded-full transition-all duration-500",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "destructive" && "bg-destructive/10",
            variant === "primary" && "bg-primary/10"
          )} />
        </div>
      </div>
    </div>
  );
}