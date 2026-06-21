import React from 'react';
import { Helmet } from 'react-helmet';
import MerchantLayout from '@/layouts/MerchantLayout';
import { Construction } from 'lucide-react';

const OrdersManagement = () => {
  return (
    <MerchantLayout>
      <Helmet>
        <title>Manage Orders - Occasions Gifts</title>
      </Helmet>
       <div className="flex flex-col items-center justify-center text-center h-full">
        <Construction className="w-24 h-24 text-[#d4af37] mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Orders Management In Progress</h1>
        <p className="text-slate-300 text-lg">
          This feature is currently under construction and will be available soon.
        </p>
      </div>
    </MerchantLayout>
  );
};

export default OrdersManagement;