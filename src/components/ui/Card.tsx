import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: 'flat' | 'subtle' | 'float' | 'modal';
}

export const Card = ({
  children,
  className = '',
  elevation = 'flat',
}: CardProps) => {
  const elevations = {
    flat: '',
    subtle: 'shadow-card',
    float: 'shadow-card-float',
    modal: 'shadow-modal',
  };

  return (
    <div className={`rounded-[12px] bg-canvas ${elevations[elevation]} ${className}`}>
      {children}
    </div>
  );
};
