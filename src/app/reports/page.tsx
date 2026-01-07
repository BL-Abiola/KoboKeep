import { MainLayout } from "@/components/layout/main-layout";
import { ReportsClient } from "@/components/reports/reports-client";

export default function ReportsPage() {
    return (
        <MainLayout title="Reports">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <ReportsClient />
             </div>
        </MainLayout>
    );
}
