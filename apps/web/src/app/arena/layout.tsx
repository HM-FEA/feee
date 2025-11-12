'use client';

import UnifiedLayout from '@/components/layout/UnifiedLayout';

export const metadata = {
  title: 'Arena | Nexus-Alpha',
};

export default function ArenaLayout({
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
