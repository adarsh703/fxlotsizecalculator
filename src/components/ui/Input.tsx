import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, suffix, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={`h-10 w-full rounded-sm border border-hairline bg-canvas px-3 text-sm text-ink transition-all placeholder:text-mute focus:border-hairline-strong focus:outline-none focus:ring-2 focus:ring-ink/10 ${suffix ? 'pr-10' : ''} ${className}`}
            {...props}
            onChange={(e) => {
              if (props.inputMode === 'decimal' || props.inputMode === 'numeric') {
                let val = e.target.value.replace(/[^0-9.]/g, '');
                const parts = val.split('.');
                if (parts.length > 2) {
                  val = parts[0] + '.' + parts.slice(1).join('');
                }
                e.target.value = val;
              }
              if (props.onChange) {
                props.onChange(e);
              }
            }}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-mute">
              {suffix}
            </span>
          )}
        </div>
        {error && <span className="mt-0.5 text-xs text-error">{error}</span>}
        {hint && !error && <span className="text-xs text-mute">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
