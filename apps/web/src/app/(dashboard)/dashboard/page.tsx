'use client';

import PlatformDashboard from '@/components/platform/PlatformDashboard';
import HorizontalCalendar from '@/components/platform/HorizontalCalendar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <HorizontalCalendar />
      <PlatformDashboard />
    </div>
  );
}
