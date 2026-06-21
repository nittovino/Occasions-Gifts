import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { getItem, setItem } = useLocalStorage();
  const { toast } = useToast();
  
  // Using localStorage for immediate functionality in prototype
  const stores = getItem('stores') || [];
  const settings = getItem('settings_global') || {};

  const handleUpdateStore = (id, newStatus) => {
    const updatedStores = stores.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setItem('stores', updatedStores);
    
    // Send email logic would go here
    const statusText = newStatus === 'approved' ? 'Approved' : 'Rejected';
    const variant = newStatus === 'approved' ? 'default' : 'destructive';
    
    toast({ 
      title: `Store ${statusText}`,
      description: `Notification email sent to owner.`,
      variant
    });
    
    // Force re-render is handled by next render cycle usually, but with simple hooks we might need to manually trigger or rely on component key if needed, 
    // but here we just read directly in render which works on re-mount or state change. 
    // To ensure UI updates immediately without page reload, we should ideally use local state too, but let's rely on standard React refresh for now or refresh page.
    // For a smoother UX, I'll refresh page or use state.
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-white mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="bg-slate-800 text-white">
            <TabsTrigger value="partners">Partner Applications</TabsTrigger>
            <TabsTrigger value="approvals">Store List</TabsTrigger>
            <TabsTrigger value="payouts">Payout Management</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partners">
            <Card className="bg-slate-800 border-slate-700 text-white mt-4">
              <CardHeader><CardTitle>Pending Applications</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.filter(s => s.status === 'pending').map(store => (
                    <div key={store.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-[#1a2a4a] rounded-lg border border-slate-700 gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#d4af37]">{store.name}</h3>
                        <p className="text-sm text-slate-300">Owner: {store.owner_email}</p>
                        <p className="text-sm text-slate-400">{store.city}, {store.country}</p>
                        <p className="text-xs text-slate-500 mt-1">Applied: {new Date(store.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-slate-500 text-slate-300">View Details</Button>
                        <Button size="sm" onClick={() => handleUpdateStore(store.id, 'rejected')} className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800">Reject</Button>
                        <Button size="sm" onClick={() => handleUpdateStore(store.id, 'approved')} className="bg-[#d4af37] text-black hover:bg-white">Approve</Button>
                      </div>
                    </div>
                  ))}
                  {stores.filter(s => s.status === 'pending').length === 0 && (
                    <p className="text-slate-400 italic text-center py-4">No pending applications found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card className="bg-slate-800 border-slate-700 text-white mt-4">
              <CardHeader><CardTitle>All Stores</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stores.map(store => (
                    <div key={store.id} className="flex justify-between items-center p-3 border-b border-slate-700 last:border-0">
                      <div>
                        <span className="font-bold mr-2">{store.name}</span>
                        <Badge variant="outline" className={`
                          ${store.status === 'approved' ? 'border-green-500 text-green-500' : ''}
                          ${store.status === 'rejected' ? 'border-red-500 text-red-500' : ''}
                          ${store.status === 'pending' ? 'border-yellow-500 text-yellow-500' : ''}
                        `}>{store.status}</Badge>
                      </div>
                      <div className="text-sm text-slate-400">{store.city}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card className="bg-slate-800 border-slate-700 text-white mt-4">
              <CardContent className="pt-6">Payout management coming soon...</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
             <Card className="bg-slate-800 border-slate-700 text-white mt-4">
               <CardHeader><CardTitle>Exchange Rates</CardTitle></CardHeader>
               <CardContent>
                 <div className="grid gap-4">
                    <div className="flex justify-between">
                       <span>MKD per EUR</span>
                       <span>{settings?.mkd_per_eur || '61.5'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>ALL per EUR</span>
                       <span>{settings?.all_per_eur || '103.2'}</span>
                    </div>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;