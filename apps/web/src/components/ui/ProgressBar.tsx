'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: string;
  gradient?: boolean;
  height?: string;
}

export function ProgressBar({ value, color, gradient, height = 'h-2' }: ProgressBarProps) {
  const barColor = gradient
    ? 'bg-gradient-to-r from-accent-cyan to-accent-emerald'
    : color || 'bg-accent-cyan';

  return (
    <div className={cn('w-full bg-background-tertiary rounded-full overflow-hidden', height)}>
      <div
        className={cn('h-full rounded-full transition-all', barColor)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
