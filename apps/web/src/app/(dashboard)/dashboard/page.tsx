'use client';

import PlatformDashboard from '@/components/platform/PlatformDashboard';
import HorizontalCalendar from '@/components/platform/HorizontalCalendar';
import KeyTickers from '@/components/finance/KeyTickers';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <HorizontalCalendar />
      <KeyTickers />
      <PlatformDashboard />
    </div>
  );
}
