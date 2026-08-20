import { useState, useRef, useEffect } from 'react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; group?: string }[];
  placeholder?: string;
  searchable?: boolean;
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchable = true,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const groups = filteredOptions.reduce((acc, opt) => {
    const group = opt.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(opt);
    return acc;
  }, {} as Record<string, typeof options>);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <div
          className="flex h-10 w-full cursor-pointer items-center justify-between rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink transition-all focus-within:border-hairline-strong focus-within:ring-2 focus-within:ring-ink/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {searchable && isOpen ? (
            <input
              type="text"
              className="h-full w-full bg-transparent outline-none placeholder:text-mute"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              autoFocus
            />
          ) : (
            <span className={selectedOption ? 'text-ink' : 'text-mute'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <svg
            className="ml-2 h-4 w-4 flex-shrink-0 text-mute"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-hairline bg-canvas shadow-modal">
            {Object.keys(groups).length > 0 ? (
              Object.entries(groups).map(([group, opts]) => (
                <div key={group}>
                  {group !== 'Other' && (
                    <div className="px-3 py-1.5 font-mono text-xs uppercase text-mute">
                      {group}
                    </div>
                  )}
                  {opts.map((opt) => (
                    <div
                      key={opt.value}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-canvas-soft-2 ${
                        value === opt.value ? 'bg-canvas-soft-2 font-medium' : ''
                      }`}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearch('');
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-center text-sm text-mute">No options found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
