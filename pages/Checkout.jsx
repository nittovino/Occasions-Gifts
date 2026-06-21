import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CreditCard, MapPin, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import DeliveryOptions from '@/components/DeliveryOptions';
import PickupLocationInput from '@/components/PickupLocationInput';
import { OrderService } from '@/services/OrderService';

const Checkout = () => {
  const { 
    cart, 
    getCartTotal, 
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    deliveryFee,
    setDeliveryFee,
    deliveryAddress,
    setDeliveryAddress,
    getDeliveryFee,
    getTotal
  } = useCart();
  
  const { currentUser } = useAuth();
  const { getItem, setItem } = useLocalStorage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (deliveryMethod === 'pickup_location' && deliveryAddress.trim().length < 2) {
        throw new Error('Please enter a valid pickup location.');
      }

      // Group cart items by store
      const storeGroups = {};
      cart.forEach(item => {
        if (!storeGroups[item.store_id]) {
          storeGroups[item.store_id] = [];
        }
        storeGroups[item.store_id].push(item);
      });

      // Create orders for each store
      const orders = getItem('orders') || [];
      const orderItems = getItem('order_items') || [];
      const createdOrders = [];

      // If we had Supabase connected we would await OrderService.createOrder()
      // Since it's local prototyping, we store them in localStorage
      for (const [storeId, items] of Object.entries(storeGroups)) {
        const orderId = generateId();
        const itemsTotal = items.reduce((sum, item) => sum + (item.price_eur * item.quantity), 0);
        
        // Split delivery fee per store if multiple stores, or just assign it.
        // For simplicity, we apply the delivery fee to the first order.
        const orderDeliveryFee = createdOrders.length === 0 ? deliveryFee : 0;
        const orderTotal = itemsTotal + orderDeliveryFee;

        const order = {
          id: orderId,
          customer_id: currentUser?.id || 'guest',
          store_id: storeId,
          total_eur: orderTotal,
          status: 'pending',
          delivery_date: items[0].deliveryDate?.toISOString() || null,
          delivery_time_window: items[0].timeWindow || 'anytime',
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          notes: formData.notes,
          created_at: new Date().toISOString(),
          // New delivery data
          delivery_method: deliveryMethod,
          delivery_fee: orderDeliveryFee,
          delivery_address: deliveryAddress || null
        };

        orders.push(order);
        createdOrders.push(orderId);

        // Create order items
        items.forEach(item => {
          orderItems.push({
            id: generateId(),
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price_eur: item.price_eur,
            product_name: item.name
          });
        });
      }

      setItem('orders', orders);
      setItem('order_items', orderItems);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      clearCart();
      
      toast({
        title: t('orderPlaced'),
        description: t('orderPlacedDesc'),
      });

      navigate(`/order-confirmation/${createdOrders[0]}`);
    } catch (error) {
      toast({
        title: t('orderFailed'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('checkout')} - Occasions Gifts</title>
        <meta name="description" content="Complete your order" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{t('checkout')}</h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-[#d4af37]" />
                    {t('deliveryInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('fullName')}</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="text-gray-900 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('email')}</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-gray-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">{t('phoneNumber')}</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">{t('deliveryAddress')}</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t('streetAddress')}
                      className="text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('city')}</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="text-gray-900 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('postalCode')}</label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="text-gray-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">{t('specialInstructions')}</label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder={t('specialInstructions')}
                      className="text-gray-900 bg-white"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options Section */}
              <div className="space-y-4">
                <DeliveryOptions 
                  deliveryMethod={deliveryMethod}
                  setDeliveryMethod={setDeliveryMethod}
                  getDeliveryFee={getDeliveryFee}
                />
                <PickupLocationInput 
                  deliveryMethod={deliveryMethod}
                  deliveryAddress={deliveryAddress}
                  setDeliveryAddress={setDeliveryAddress}
                />
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-[#d4af37]" />
                    {t('paymentMethod')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      <strong>{t('demoPayment')}</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="h-5 w-5 mr-2 text-[#d4af37]" />
                    {t('orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 border-b border-slate-700 pb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-white">
                          €{(item.price_eur * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm pt-2 transition-all duration-300">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">€{getCartTotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm transition-all duration-300">
                    <span className="text-slate-400">Delivery Fee</span>
                    <span className="text-white">€{deliveryFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-slate-700 mt-2">
                    <span className="text-white">{t('total')}</span>
                    <span className="text-[#d4af37]">€{getTotal().toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold text-lg py-6 mt-4"
                  >
                    {loading ? t('processing') : t('placeOrder')}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    {t('termsAgreement')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;