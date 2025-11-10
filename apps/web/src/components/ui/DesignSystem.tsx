import React from 'react';

// ============================================
// NEXUS-ALPHA DESIGN SYSTEM
// Bloomberg Terminal Inspired UI Components
// ============================================

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glow = false
}) => (
  <div
    className={`
      bg-[#0D0D0F]
      border border-[#1A1A1F]
      rounded-xl
      p-4
      ${hover ? 'hover:border-accent-cyan/50 transition-all duration-300' : ''}
      ${glow ? 'shadow-lg shadow-accent-cyan/10' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

// Card Title
interface CardTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, icon, className = '' }) => (
  <h3 className={`text-base font-semibold text-accent-cyan mb-4 flex items-center gap-2 ${className}`}>
    {icon}
    {children}
  </h3>
);

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-accent-cyan text-black hover:bg-accent-cyan/80 shadow-lg shadow-accent-cyan/20',
    secondary: 'bg-background-secondary text-text-primary hover:bg-background-tertiary border border-border-primary',
    accent: 'bg-accent-magenta text-black hover:bg-accent-magenta/80 shadow-lg shadow-accent-magenta/20',
    danger: 'bg-status-danger text-white hover:bg-status-danger/80',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'emerald' | 'gold' | 'gray';
  glow?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  glow = false,
  className = ''
}) => {
  const variantStyles = {
    cyan: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan',
    magenta: 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta',
    emerald: 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-400',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-400',
  };

  const glowStyles = {
    cyan: 'shadow-lg shadow-accent-cyan/30',
    magenta: 'shadow-lg shadow-accent-magenta/30',
    emerald: 'shadow-lg shadow-accent-emerald/30',
    gold: 'shadow-lg shadow-yellow-400/30',
    gray: '',
  };

  return (
    <span
      className={`
        inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${variantStyles[variant]}
        ${glow ? glowStyles[variant] : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action
}) => (
  <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-0 z-20">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-light text-accent-cyan mb-1 flex items-center gap-2">
          {icon}
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-text-secondary font-light">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

// Stat Card
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'emerald' | 'gold';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  variant = 'cyan'
}) => {
  const colorStyles = {
    cyan: 'text-accent-cyan',
    magenta: 'text-accent-magenta',
    emerald: 'text-accent-emerald',
    gold: 'text-yellow-400',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-tertiary">{label}</span>
        {icon && <span className={colorStyles[variant]}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold ${colorStyles[variant]}`}>
          {value}
        </span>
        {change !== undefined && (
          <span className={`text-xs font-semibold ${
            change >= 0 ? 'text-status-safe' : 'text-status-danger'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </Card>
  );
};

// Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeStyles[size]} border-2 border-accent-cyan border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {icon && (
      <div className="mb-4 text-text-tertiary opacity-50">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-text-secondary mb-4 max-w-md">{description}</p>
    )}
    {action && <div>{action}</div>}
  </div>
);

// Tab Component
interface TabProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 border-b border-border-primary pb-2">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
          activeTab === tab.id
            ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/30'
            : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
        }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);

// Page Container
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => (
  <div className={`relative min-h-screen bg-black text-text-primary ${className}`}>
    {children}
  </div>
);
