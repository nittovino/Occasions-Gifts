import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Store, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminPortal = () => {
  const { getItem, setItem } = useLocalStorage();
  const { toast } = useToast();
  
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    setStores(getItem('stores') || []);
    setOrders(getItem('orders') || []);
    setExchangeRates(getItem('exchange_rates') || []);
    setPayouts(getItem('payouts') || []);
  }, []);

  const handleStoreApproval = (storeId, status) => {
    const updatedStores = stores.map(s =>
      s.id === storeId ? { ...s, status } : s
    );
    setItem('stores', updatedStores);
    setStores(updatedStores);
    toast({
      title: status === 'approved' ? 'Store approved' : 'Store rejected',
      description: `The store has been ${status}.`,
    });
  };

  const handleExchangeRateUpdate = (currency, newRate) => {
    const updatedRates = exchangeRates.map(r =>
      r.currency === currency
        ? { ...r, rate: parseFloat(newRate), last_updated: new Date().toISOString() }
        : r
    );
    setItem('exchange_rates', updatedRates);
    setExchangeRates(updatedRates);
    toast({
      title: 'Exchange rate updated',
      description: `${currency} rate updated to ${newRate}`,
    });
  };

  const analytics = {
    totalStores: stores.length,
    approvedStores: stores.filter(s => s.status === 'approved').length,
    pendingStores: stores.filter(s => s.status === 'pending').length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total_eur, 0),
    platformRevenue: orders.reduce((sum, o) => sum + (o.total_eur * 0.2), 0)
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>Admin Portal - Occasions Gifts</title>
        <meta name="description" content="Admin dashboard" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">Admin Portal</h1>

          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Stores</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalStores}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {analytics.pendingStores} pending approval
                    </p>
                  </div>
                  <Store className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalOrders}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      €{analytics.totalRevenue.toFixed(2)} total
                    </p>
                  </div>
                  <Package className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Platform Revenue (20%)</p>
                    <p className="text-3xl font-bold text-[#d4af37]">€{analytics.platformRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-[#d4af37]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stores" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="stores" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2a4a]">
                Store Approvals
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2a4a]">
                All Orders
              </TabsTrigger>
              <TabsTrigger value="rates" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2a4a]">
                Exchange Rates
              </TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a2a4a]">
                Payouts
              </TabsTrigger>
            </TabsList>

            {/* Store Approvals */}
            <TabsContent value="stores">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Store Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {stores.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No stores registered</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-slate-400">Store Name</TableHead>
                          <TableHead className="text-slate-400">Owner</TableHead>
                          <TableHead className="text-slate-400">City</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stores.map(store => (
                          <TableRow key={store.id}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell>{store.owner_id.slice(0, 8)}</TableCell>
                            <TableCell>{store.city}, {store.country}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  store.status === 'approved' ? 'success' :
                                  store.status === 'pending' ? 'secondary' : 'destructive'
                                }
                              >
                                {store.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {store.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleStoreApproval(store.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStoreApproval(store.id, 'rejected')}
                                    className="text-red-400 border-red-400"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Orders */}
            <TabsContent value="orders">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No orders yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-slate-400">Order ID</TableHead>
                          <TableHead className="text-slate-400">Customer</TableHead>
                          <TableHead className="text-slate-400">Store</TableHead>
                          <TableHead className="text-slate-400">Amount</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map(order => {
                          const store = stores.find(s => s.id === order.store_id);
                          return (
                            <TableRow key={order.id}>
                              <TableCell>{order.id.slice(0, 8)}</TableCell>
                              <TableCell>{order.customer_name}</TableCell>
                              <TableCell>{store?.name || 'Unknown'}</TableCell>
                              <TableCell>€{order.total_eur.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant={order.status === 'pending' ? 'secondary' : 'success'}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exchange Rates */}
            <TabsContent value="rates">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Exchange Rate Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exchangeRates.map(rate => (
                    <div key={rate.currency} className="flex items-center justify-between bg-slate-700/30 p-4 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{rate.currency}</p>
                        <p className="text-sm text-slate-400">
                          Last updated: {new Date(rate.last_updated).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={rate.rate}
                          className="w-32"
                          onBlur={(e) => {
                            if (e.target.value !== rate.rate.toString()) {
                              handleExchangeRateUpdate(rate.currency, e.target.value);
                            }
                          }}
                        />
                        <span className="text-slate-400">= 1 EUR</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payouts */}
            <TabsContent value="payouts">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                    <DollarSign className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Payout System</h3>
                    <p className="text-slate-400 mb-4">
                      Automatic monthly payouts will be calculated based on 80/20 split
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">Store Share</p>
                        <p className="text-2xl font-bold text-white">80%</p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">Platform Fee</p>
                        <p className="text-2xl font-bold text-[#d4af37]">20%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPortal;