import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
        <Helmet>
          <title>{t('yourCart')} - Occasions Gifts</title>
          <meta name="description" content="Your shopping cart" />
        </Helmet>
        
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-slate-600 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              {t('emptyCart')}
            </h2>
            <p className="text-slate-400 mb-8">
              {t('addGiftsMessage')}
            </p>
            <Link to="/browse">
              <Button className="bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold">
                {t('continueShopping')}
              </Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('yourCart')} - Occasions Gifts</title>
        <meta name="description" content="Review your shopping cart" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">
            {t('yourCart')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-slate-400 mb-2">
                            €{item.price_eur.toFixed(2)} each
                          </p>
                          {item.deliveryDate && (
                            <p className="text-sm text-[#d4af37] mb-2">
                              {t('delivery')}: {new Date(item.deliveryDate).toLocaleDateString()} ({t(item.timeWindow)})
                            </p>
                          )}
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 text-white border-slate-600"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 text-white border-slate-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                          <p className="text-xl font-semibold text-[#d4af37]">
                            €{(item.price_eur * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 border-slate-700 sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-serif font-bold text-white mb-4">
                    {t('orderSummary')}
                  </h2>
                  
                  <div className="space-y-2 border-b border-slate-700 pb-4">
                    <div className="flex justify-between text-slate-300">
                      <span>{t('subtotal')}</span>
                      <span>€{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('delivery')}</span>
                      <span>{t('calculatedAtCheckout')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-semibold pt-2">
                    <span className="text-white">{t('total')}</span>
                    <span className="text-[#d4af37]">€{getCartTotal().toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold text-lg py-6"
                  >
                    {t('checkout')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Link to="/browse">
                    <Button variant="outline" className="w-full text-white border-slate-600">
                      {t('continueShopping')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;