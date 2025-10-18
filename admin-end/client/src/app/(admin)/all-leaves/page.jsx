import PendingLeaveRequests from "@/components/layout/AllLeaveTable/allLeavesTable";
import AdminHeader from "@/components/layout/TeacherDetailsPage/AdminHeader";
import AdminNav from "@/components/layout/TeacherDetailsPage/AdminNav";

export default function page() {

    return (
        <main className="min-h-screen bg-gray-100">
            <AdminHeader />
            <AdminNav active="leave" />
            <PendingLeaveRequests />
        </main>
    )
}