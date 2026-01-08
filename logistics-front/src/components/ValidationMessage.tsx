import { classMap, iconMap } from "../utils/constants";


interface ValidationMessageProps {
  message: string | null;
  type: 'error' | 'warning' | 'info';
}



export function ValidationMessage({ message, type }: ValidationMessageProps) {
  if (!message) return null;
  
  return (
    <div 
      className={`flex items-center gap-2 text-sm mt-1 ${classMap[type]}`}
      role="alert"
      aria-live="polite"
    >
      <span>{iconMap[type]}</span>
      <span>{message}</span>
    </div>
  );
}
