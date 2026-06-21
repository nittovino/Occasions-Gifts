import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Package, Minus, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDeliveryMethod from '@/components/ProductDeliveryMethod';
import DeliverySummary from '@/components/DeliverySummary';
import { calculateMinDeliveryDate, getLeadTimeDaysWithFallback, isDateBeforeMinDate, formatDateForDisplay } from '@/utils/dateUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem } = useLocalStorage();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [timeWindow, setTimeWindow] = useState('anytime');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupPostalCode, setPickupPostalCode] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeliverySummary, setShowDeliverySummary] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const products = getItem('products') || [];
    const stores = getItem('stores') || [];
    
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      const foundStore = stores.find(s => s.id === foundProduct.store_id);
      setStore(foundStore);
      
      const leadTimeDays = getLeadTimeDaysWithFallback(foundProduct);
      const minDate = calculateMinDeliveryDate(leadTimeDays);
      setDeliveryDate(minDate);
    }
  }, [id]);

  useEffect(() => {
    if (product && deliveryDate) {
      const leadTimeDays = getLeadTimeDaysWithFallback(product);
      const minDate = calculateMinDeliveryDate(leadTimeDays);
      if (isDateBeforeMinDate(deliveryDate, minDate)) {
        setDeliveryDate(minDate);
        toast({
          title: "Date Adjusted",
          description: `Earliest delivery is ${formatDateForDisplay(minDate)} due to prep time.`,
        });
      }
    }

    let isValid = deliveryMethod && deliveryDate && timeWindow;
    if (deliveryMethod === 'pickup_location') {
      if (pickupCity.trim().length < 2 || pickupPostalCode.trim().length < 2) {
        isValid = false;
      }
    }
    setShowDeliverySummary(!!isValid);
  }, [deliveryMethod, deliveryDate, timeWindow, pickupCity, pickupPostalCode, product, toast]);

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    setErrors({});
  };

  const handlePickupLocationChange = (field, value) => {
    if (field === 'city') setPickupCity(value);
    if (field === 'postalCode') setPickupPostalCode(value);
    setErrors(prev => ({...prev, [field]: null}));
  };

  const handleAddToCart = () => {
    let newErrors = {};
    let hasError = false;

    if (!deliveryDate) {
      hasError = true;
    }

    if (deliveryMethod === 'pickup_location') {
      if (pickupCity.trim().length < 2) {
        newErrors.city = "City must be at least 2 characters";
        hasError = true;
      }
      if (pickupPostalCode.trim().length < 2) {
        newErrors.postalCode = "Postal code must be at least 2 characters";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const leadTimeDays = getLeadTimeDaysWithFallback(product);
      addToCart(product, quantity, deliveryMethod, deliveryDate, timeWindow, pickupCity, pickupPostalCode, leadTimeDays);
      toast({
        title: t('addedToCart'),
        description: `${product.name} ${t('addedToCart').toLowerCase()}`,
      });
      navigate('/cart');
    } catch (err) {
      toast({
        title: "Error adding to cart",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const isDateDisabled = (date) => {
    if (!product) return false;
    const leadTimeDays = getLeadTimeDaysWithFallback(product);
    const minDate = calculateMinDeliveryDate(leadTimeDays);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < minDate;
  };

  if (!product || !store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  const timeWindows = [
    { id: 'morning', label: t('productDetail.morning') || t('morning'), value: 'morning' },
    { id: 'afternoon', label: t('productDetail.afternoon') || t('afternoon'), value: 'afternoon' },
    { id: 'evening', label: t('productDetail.evening') || t('evening'), value: 'evening' },
    { id: 'anytime', label: t('productDetail.anytime') || t('anytime'), value: 'anytime' },
  ];

  const leadTimeDays = getLeadTimeDaysWithFallback(product);
  const earliestDateStr = formatDateForDisplay(calculateMinDeliveryDate(leadTimeDays));
  const earliestDeliveryLabel = (t('productDetail.earliestDelivery') || `Earliest delivery: {date}`).replace('{date}', earliestDateStr);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{product.name} - Occasions Gifts</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {t(product.category.replace(/\s+/g, '').replace('&', '')) || product.category}
                  </Badge>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl font-serif font-bold text-white mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <CurrencyDisplay eurAmount={product.price_eur} country={store.country} />
                  {product.stock > 0 ? (
                    <Badge variant="success">{t('inStock')}</Badge>
                  ) : (
                    <Badge variant="destructive">{t('outOfStock')}</Badge>
                  )}
                </div>

                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <StoreIcon className="h-5 w-5 text-[#d4af37]" />
                      <div>
                        <p className="text-sm text-slate-400">{t('soldBy')}</p>
                        <p className="text-white font-semibold">{store.name}</p>
                        <p className="text-sm text-slate-400">{store.city}, {store.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <ProductDeliveryMethod 
                selectedMethod={deliveryMethod}
                pickupCity={pickupCity}
                pickupPostalCode={pickupPostalCode}
                errors={errors}
                onDeliveryMethodChange={handleDeliveryMethodChange}
                onPickupLocationChange={handlePickupLocationChange}
              />

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-[#d4af37]" />
                    {t('deliveryScheduling')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      {t('selectDate')}
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full justify-start text-left font-normal text-white border-slate-600"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? deliveryDate.toLocaleDateString() : t('pickDate')}
                    </Button>
                    <p className="text-[13px] text-[#6B7280] italic mt-2">
                      {earliestDeliveryLabel}
                    </p>
                    {showCalendar && (
                      <div className="mt-2 bg-slate-800 rounded-lg border border-slate-700">
                        <Calendar
                          selected={deliveryDate}
                          onSelect={(date) => {
                            if (date) {
                              setDeliveryDate(date);
                              setShowCalendar(false);
                            }
                          }}
                          disabled={isDateDisabled}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-3 block">
                      {t('preferredTime')}
                    </label>
                    <RadioGroup value={timeWindow} onValueChange={setTimeWindow}>
                      <div className="space-y-2">
                        {timeWindows.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.id} />
                            <label
                              htmlFor={option.id}
                              className="text-sm text-white cursor-pointer flex-1"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    {t('quantity')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="text-white border-slate-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-semibold text-white w-12 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="text-white border-slate-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold text-lg py-6"
                >
                  <Package className="mr-2 h-5 w-5" />
                  {t('addToCart')}
                </Button>

                <DeliverySummary 
                  deliveryMethod={deliveryMethod}
                  deliveryDate={deliveryDate}
                  preferredTimeWindow={timeWindow}
                  visible={showDeliverySummary}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;