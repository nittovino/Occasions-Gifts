import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Package, Plus, ListOrdered, Upload, Wallet, MoreVertical } from 'lucide-react';
import { kpiData, recentOrders } from '@/data/mockMerchantData';
import MerchantLayout from '@/layouts/MerchantLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const KpiCard = ({ title, value, icon: Icon, format }) => (
  <motion.div whileHover={{ scale: 1.02 }}>
    <Card className="bg-[#0f1a2e] border border-[#d4af37]/50 shadow-lg hover:shadow-[#d4af37]/20 transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className="h-6 w-6 text-[#d4af37]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{format ? format(value) : value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Pending': return 'secondary';
    case 'Accepted': return 'default';
    case 'Prepared': return 'outline';
    case 'Out for Delivery': return 'destructive';
    case 'Delivered': return 'default';
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-gray-500';
        case 'Accepted': return 'bg-blue-500';
        case 'Prepared': return 'bg-orange-500';
        case 'Out for Delivery': return 'bg-purple-500';
        case 'Delivered': return 'bg-green-600';
        case 'Cancelled': return 'bg-red-600';
        default: return 'bg-gray-500';
    }
}


const StoreDashboard = () => {
  return (
    <MerchantLayout>
      <Helmet>
        <title>Store Dashboard - Occasions Gifts</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Store Dashboard</h1>
        {/* Breadcrumb would go here */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Today's Orders" value={kpiData.todayOrders} icon={Calendar} />
        <KpiCard title="Pending Orders" value={kpiData.pendingOrders} icon={Clock} />
        <KpiCard title="Revenue (Today)" value={kpiData.revenue} icon={TrendingUp} format={(v) => `€${v.toFixed(2)}`} />
        <KpiCard title="Products Active" value={kpiData.activeProducts} icon={Package} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/store/products" className="w-full"><Button className="w-full h-11 bg-gradient-to-r from-[#D4AF37] to-[#F2C94C] text-black font-bold hover:scale-102 hover:shadow-lg transition-all"><Plus className="mr-2 h-4 w-4"/> Add Product</Button></Link>
        <Link to="/store/orders" className="w-full"><Button className="w-full h-11 bg-gradient-to-r from-[#D4AF37] to-[#F2C94C] text-black font-bold hover:scale-102 hover:shadow-lg transition-all"><ListOrdered className="mr-2 h-4 w-4"/> View Orders</Button></Link>
        <Button variant="outline" className="w-full h-11 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-white transition-all"><Upload className="mr-2 h-4 w-4"/> Upload Delivery Proof</Button>
        <Link to="/store/payouts" className="w-full"><Button variant="outline" className="w-full h-11 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-white transition-all"><Wallet className="mr-2 h-4 w-4"/> Manage Payouts</Button></Link>
      </div>

      <Card className="bg-[#0f1a2e] border border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Order ID</TableHead>
                  <TableHead className="text-slate-300">Customer</TableHead>
                  <TableHead className="text-slate-300">Product</TableHead>
                  <TableHead className="text-right text-slate-300">Amount</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-right text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-800">
                    <TableCell className="font-medium text-white">{order.id}</TableCell>
                    <TableCell className="text-slate-300">{order.customer}</TableCell>
                    <TableCell className="text-slate-300">{order.product}</TableCell>
                    <TableCell className="text-right text-white">€{order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{order.date.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4 text-slate-400"/></Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan="7" className="h-24 text-center text-slate-400">
                      No orders yet. Start by adding products!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MerchantLayout>
  );
};

export default StoreDashboard;