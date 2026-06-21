import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const { trackingToken } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_events(*), order_items(*)')
        .eq('tracking_token', trackingToken)
        .single();
      
      if (data) {
        setOrder(data);
        setEvents(data.order_events || []);
      }
      setLoading(false);
    };

    if (trackingToken) fetchOrder();
  }, [trackingToken]);

  if (loading) return <div className="min-h-screen bg-[#1a2a4a] text-white flex items-center justify-center">Loading tracking info...</div>;
  if (!order) return <div className="min-h-screen bg-[#1a2a4a] text-white flex items-center justify-center">Order not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-white mb-8">Track Order</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id.slice(0,8)}</span>
                <Badge className="bg-[#d4af37] text-black">{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="text-[#d4af37]" />
                  <span>{order.order_items?.length} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#d4af37]" />
                  <span>{order.delivery_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="text-[#d4af37]" />
                  <span>Est. Delivery: {order.delivery_date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
             <CardHeader>
                <CardTitle>Timeline</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="relative border-l border-slate-600 ml-4 space-y-6">
                  {events.map((event, idx) => (
                    <div key={idx} className="mb-6 ml-6 relative">
                       <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37] ring-4 ring-slate-900">
                         <CheckCircle className="h-4 w-4 text-black" />
                       </span>
                       <h3 className="font-semibold text-[#d4af37]">{event.status}</h3>
                       <p className="text-sm text-slate-400">{new Date(event.created_at).toLocaleString()}</p>
                       <p className="text-slate-300">{event.description}</p>
                    </div>
                  ))}
                  {events.length === 0 && <p className="text-slate-400 ml-6">No events recorded yet.</p>}
                </div>
             </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;