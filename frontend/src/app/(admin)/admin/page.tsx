import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Admin",
    description: "Admin dashboard overview",
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
    );
}
