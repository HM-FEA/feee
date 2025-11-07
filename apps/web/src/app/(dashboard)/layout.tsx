'use client';

import { GlobalTopNav } from '@/components/layout/GlobalTopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <GlobalTopNav />
      <main>
        {children}
      </main>
    </div>
  );
}
