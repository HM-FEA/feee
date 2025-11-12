'use client';

import UnifiedLayout from '@/components/layout/UnifiedLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedLayout>
      {children}
    </UnifiedLayout>
  );
}
