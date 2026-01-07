import { MainLayout } from "@/components/layout/main-layout";
import { SettingsClient } from "@/components/settings/settings-client";

export default function SettingsPage() {
    return (
        <MainLayout title="Settings">
             <div className="flex-1 space-y-4 p-2 md:p-8 pt-6">
                <SettingsClient />
             </div>
        </MainLayout>
    );
}
