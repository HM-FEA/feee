'use client';

import React, { useState, ReactNode } from 'react';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';

interface UnifiedLayoutProps {
  children: ReactNode;
}

/**
 * UnifiedLayout - 모든 페이지에 적용되는 표준 대시보드 레이아웃
 *
 * 구조:
 * - TopBar: 얇은 상단 바 (브랜딩 + 사용자 액션)
 * - LeftSidebar: 240px 좌측 네비게이션 (접을 수 있음 → 64px)
 * - Main Content: 오른쪽 대시보드 영역 (Fluid width)
 */
export default function UnifiedLayout({ children }: UnifiedLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen bg-background-primary flex flex-col overflow-hidden">
      {/* TopBar - Fixed at top */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* LeftSidebar - Collapsible */}
        <LeftSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dashboard Content */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarCollapsed ? 'ml-0' : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
