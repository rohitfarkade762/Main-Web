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
      "rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group",
      "bg-green-600 border border-green-700", // 🔥 solid green background
      className
    )}
  >
    {/* Top accent line */}
    <div className="h-1 w-full bg-green-500" />

    <div className="p-5 text-white">
      <div className="flex items-start justify-between gap-4">

        {/* Content */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-90">
            {title}
          </p>

          <p className="text-3xl font-bold font-display transition-all duration-300 group-hover:scale-105">
            {value}
          </p>

          {subtitle && (
            <p className="text-sm font-medium opacity-95 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500/30 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
        )}
      </div>

      {/* Bottom decorative line */}
      <div className="mt-4 flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-green-500/50" />
        <div className="h-1 flex-1 rounded-full bg-green-500/40" />
        <div className="h-1 flex-1 rounded-full bg-green-500/30" />
      </div>
    </div>
  </div>
  );
}