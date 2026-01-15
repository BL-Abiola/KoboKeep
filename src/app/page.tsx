
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { useAppStore } from "@/lib/store";
import { WelcomeDialog } from "@/components/onboarding/welcome-dialog";

export default function DashboardPage() {
  const { settings, getTodaysLog, dailyLogs } = useAppStore();
  const todaysLog = getTodaysLog();

  if (!settings.onboardingCompleted) {
    return <WelcomeDialog />;
  }

  return (
    <MainLayout title="Dashboard">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DashboardClient key={dailyLogs.length} todaysLog={todaysLog} />
      </div>
    </MainLayout>
  );
}
