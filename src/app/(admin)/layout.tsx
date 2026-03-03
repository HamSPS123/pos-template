"use client";

import AdminBreadcrumb from "@/components/layout/breadcrumb";
import { Navbar } from "@/components/layout/navbar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Horizontal Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b bg-background px-4 py-3 lg:px-6">
        <AdminBreadcrumb />
      </div>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto bg-muted/40 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
