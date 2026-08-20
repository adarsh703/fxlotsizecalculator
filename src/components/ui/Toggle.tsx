interface ToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  activeClassMap?: Record<string, string>;
}

export const Toggle = ({ options, value, onChange, size = 'md', activeClassMap }: ToggleProps) => {
  const isSm = size === 'sm';
  
  return (
    <div className="inline-flex rounded-full bg-canvas-soft-2 p-0.5">
      {options.map((opt) => {
        const isActive = value === opt;
        const activeClass = activeClassMap && activeClassMap[opt] 
          ? activeClassMap[opt] 
          : 'bg-canvas text-ink shadow-sm';

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full font-medium transition-all duration-150 ${
              isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            } ${
              isActive
                ? activeClass
                : 'text-mute hover:text-body'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};
