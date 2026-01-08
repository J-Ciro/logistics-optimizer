import { statusConfig } from "../utils/constants";


interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'degraded';
}


export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-lg">{config.icon}</span>
      <span className={`font-medium ${config.textColor}`}>{config.label}</span>
    </div>
  );
}
