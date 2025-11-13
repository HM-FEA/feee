import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
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
