import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-normal break-words rounded-md bg-ink px-2.5 py-1.5 text-center text-xs text-on-primary opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 max-w-[250px]">
        {content}
        <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
      </div>
    </div>
  );
};
