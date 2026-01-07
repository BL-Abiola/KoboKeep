import { MainLayout } from "@/components/layout/main-layout";
import { DebtsClient } from "@/components/debts/debts-client";

export default function DebtsPage() {
    return (
        <MainLayout title="Debt Book">
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <DebtsClient />
             </div>
        </MainLayout>
    );
}
