import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Stub files to prevent missing imports
export const B2BAdmin = ({ userRole }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
    <AdminSidebar userRole={userRole} />
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">B2B Management</h1>
      <p className="mt-4 text-slate-500">B2B Dashboard is under construction.</p>
    </div>
  </div>
);

export const AffiliateAdmin = ({ userRole }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
    <AdminSidebar userRole={userRole} />
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Affiliate Management</h1>
      <p className="mt-4 text-slate-500">Affiliate Dashboard is under construction.</p>
    </div>
  </div>
);

export const ContentAdmin = ({ userRole }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
    <AdminSidebar userRole={userRole} />
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Content Management</h1>
      <p className="mt-4 text-slate-500">Content Dashboard is under construction.</p>
    </div>
  </div>
);