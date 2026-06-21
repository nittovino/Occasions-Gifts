import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { OrderService } from '@/services/OrderService';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSkeleton from '@/components/account/LoadingSkeleton';
import OrderSummary from '@/components/account/OrderSummary';
import ShippingAddress from '@/components/account/ShippingAddress';
import BillingAddress from '@/components/account/BillingAddress';
import PaymentInfo from '@/components/account/PaymentInfo';
import ShipmentTracking from '@/components/account/ShipmentTracking';
import InvoiceDownload from '@/components/account/InvoiceDownload';
import { Badge } from '@/components/ui/badge';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { currentUser } = useSupabaseAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!currentUser) return;
        const data = await OrderService.fetchOrderById(orderId, currentUser.id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
           <LoadingSkeleton className="h-10 w-48 mb-6" />
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <LoadingSkeleton className="h-96 col-span-2" />
             <LoadingSkeleton className="h-96 col-span-1" />
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
           <AlertTriangle className="h-16 w-16 text-slate-500 mb-4" />
           <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
           <p className="text-slate-400 mb-6">We couldn't locate the order you're looking for.</p>
           <Button onClick={() => navigate('/account?tab=orders')} className="bg-[#d4af37] text-[#1a2a4a]">
             Back to Orders
           </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/account?tab=orders" className="text-slate-400 hover:text-[#d4af37] flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white flex items-center gap-3">
              Order #{order.order_number}
              <Badge variant="outline" className="border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10 ml-2">
                {order.shipping_status || 'Pending'}
              </Badge>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <InvoiceDownload order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details & Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <ShipmentTracking 
              shipping_status={order.shipping_status}
              tracking_number={order.tracking_number}
              tracking_url={order.tracking_url}
              estimated_delivery={order.estimated_delivery}
              delivered_at={order.delivered_at}
            />
            <OrderSummary 
              items={order.items || []} 
              subtotal={order.subtotal}
              tax={order.tax}
              shipping={order.shipping_cost}
              total={order.total}
            />
          </div>

          {/* Right Column: Addresses & Payment */}
          <div className="space-y-6">
             <ShippingAddress address={order.shipping_address} />
             <BillingAddress address={order.billing_address} />
             <PaymentInfo 
               payment_method={order.payment_method}
               payment_status={order.payment_status}
               last_4_digits={order.payment_method?.slice(-4) || '4242'} // Mock last 4 digits if not present
               payment_date={order.created_at}
             />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;