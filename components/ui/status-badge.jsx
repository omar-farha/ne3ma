import { getStatusConfig, getUrgencyConfig, getCategoryConfig } from "@/lib/constants/donation-status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className, showIcon = true }) {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency, className, showIcon = true }) {
  const config = getUrgencyConfig(urgency);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}

export function CategoryBadge({ category, className, showIcon = true }) {
  const config = getCategoryConfig(category);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}