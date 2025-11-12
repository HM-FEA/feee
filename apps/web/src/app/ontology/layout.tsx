'use client';

import UnifiedLayout from '@/components/layout/UnifiedLayout';

export default function Layout({
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
