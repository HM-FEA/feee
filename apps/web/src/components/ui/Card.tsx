import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6',
        hover && 'hover:border-[#2A2A3F] transition-all',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, icon, className = '' }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-base font-semibold text-text-primary mb-4 flex items-center gap-2',
      className
    )}>
      {icon}
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={cn('text-sm text-text-secondary', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={cn('pt-4 border-t border-border-primary mt-4', className)}>
      {children}
    </div>
  );
}
