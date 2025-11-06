import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cyan' | 'magenta';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 font-semibold rounded-full border whitespace-nowrap';

  const variantStyles = {
    default: 'bg-background-tertiary text-text-tertiary border-border-primary',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    magenta: 'bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {icon}
      {children}
    </span>
  );
}
