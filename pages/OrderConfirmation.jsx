import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, Home } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

const OrderConfirmation = () => {
  const { id } = useParams();
  const { getItem } = useLocalStorage();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const orders = getItem('orders') || [];
    const items = getItem('order_items') || [];
    
    const foundOrder = orders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
      const foundItems = items.filter(i => i.order_id === id);
      setOrderItems(foundItems);
    }
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Order not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('orderConfirmed')} - Occasions Gifts</title>
        <meta name="description" content="Your order has been confirmed" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-serif font-bold text-white mb-4">
              {t('orderConfirmed')}
            </h1>
            <p className="text-xl text-slate-300">
              {t('thankYouOrder')}
            </p>
          </motion.div>

          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <p className="text-sm text-slate-400">{t('orderNumber')}</p>
                  <p className="text-lg font-semibold text-white">{order.id.slice(0, 12)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">{t('total')}</p>
                  <p className="text-2xl font-bold text-[#d4af37]">€{order.total_eur.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-[#d4af37] mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">{t('date')}</p>
                    <p className="text-white">
                      {order.delivery_date 
                        ? new Date(order.delivery_date).toLocaleDateString() 
                        : t('notSpecified')} 
                      {order.delivery_time_window && ` (${t(order.delivery_time_window)})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Home className="h-5 w-5 text-[#d4af37] mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">{t('deliveryAddress')}</p>
                    <p className="text-white">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-[#d4af37] mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400">{t('confirmationEmail')}</p>
                    <p className="text-white">{order.customer_email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('orderItems')}</h2>
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-white">{item.product_name}</p>
                      <p className="text-sm text-slate-400">{t('quantity')}: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">
                      €{(item.price_eur * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold">
                {t('returnHome')}
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" className="w-full sm:w-auto text-white border-slate-600">
                {t('continueShopping')}
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              {t('questionsContact')}
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;