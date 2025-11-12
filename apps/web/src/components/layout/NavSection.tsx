'use client';

import React from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSectionProps {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  currentPath: string;
}

/**
 * NavSection - Sidebar 섹션 그룹화
 *
 * 기능:
 * - 섹션 제목
 * - Navigation items with active state
 * - Badges (New, Beta, etc.)
 * - Collapsed 모드 지원
 */
export default function NavSection({ title, items, collapsed, currentPath }: NavSectionProps) {
  return (
    <div className="mb-6">
      {/* Section Title */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}

      {/* Nav Items */}
      <div className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              }`}
              title={collapsed ? item.name : undefined}
            >
              {/* Icon */}
              <span className={collapsed ? 'mx-auto' : ''}>
                {item.icon}
              </span>

              {/* Label */}
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.name}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 bg-accent-magenta/20 text-accent-magenta rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
