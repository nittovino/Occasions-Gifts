import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Filter, Store as StoreIcon, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FilterChips from '@/components/FilterChips';
import { useTranslation } from '@/hooks/useTranslation';

const BrowseShop = () => {
  const { getItem } = useLocalStorage();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Params
  const occasionParam = searchParams.get('occasion');
  const holidayParam = searchParams.get('holiday');
  const cityParam = searchParams.get('city');

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    city: cityParam || 'all',
    occasion: occasionParam || 'all',
    holiday: holidayParam || 'all',
    recipient: 'all',
    delivery: 'all',
    price: 'all',
    type: 'all',
    sort: 'Popular'
  });

  useEffect(() => {
    // Sync filters with URL params if they change externally
    setFilters(prev => ({
      ...prev,
      city: cityParam || prev.city,
      occasion: occasionParam || prev.occasion,
      holiday: holidayParam || prev.holiday,
    }));
  }, [cityParam, occasionParam, holidayParam]);

  useEffect(() => {
    const allProducts = getItem('products') || [];
    const allStores = getItem('stores') || [];
    
    const activeProducts = allProducts.filter(p => p.status === 'active');
    const approvedStores = allStores.filter(s => s.status === 'approved');
    
    setProducts(activeProducts);
    setStores(approvedStores);
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // City
    if (filters.city !== 'all') {
      result = result.filter(p => {
        const store = stores.find(s => s.id === p.store_id);
        return store?.city === filters.city;
      });
    }

    // Occasion
    if (filters.occasion !== 'all') {
      result = result.filter(p => p.occasion_tags?.includes(filters.occasion));
    }

    // Holiday
    if (filters.holiday !== 'all') {
      result = result.filter(p => p.holiday_tags?.includes(filters.holiday));
    }

    // Recipient
    if (filters.recipient !== 'all') {
      result = result.filter(p => p.recipient_tags?.includes(filters.recipient));
    }

    // Delivery Speed - Assuming delivery_speed field exists or logic derived
    if (filters.delivery !== 'all') {
       // Mock logic as data might not fully support it yet in seed
       // In real app, check p.delivery_speed
    }

    // Gift Type
    if (filters.type !== 'all') {
      result = result.filter(p => p.gift_type === filters.type || p.category === filters.type);
    }

    // Price
    if (filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number);
      result = result.filter(p => {
        if (max) return p.price_eur >= min && p.price_eur <= max;
        return p.price_eur >= min; // 100+ case
      });
    }

    // Sort
    if (filters.sort === 'PriceLowHigh') result.sort((a, b) => a.price_eur - b.price_eur);
    if (filters.sort === 'PriceHighLow') result.sort((a, b) => b.price_eur - a.price_eur);
    if (filters.sort === 'Newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // Popular/BestRated logic would go here

    setFilteredProducts(result);
  }, [filters, products, stores]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Also update URL for shareability if key matches params
    if (['city', 'occasion', 'holiday'].includes(key)) {
      const newParams = new URLSearchParams(searchParams);
      if (value && value !== 'all') newParams.set(key, value);
      else newParams.delete(key);
      setSearchParams(newParams);
    }
  };

  const removeFilter = (key) => {
    if (key === 'all') {
      setFilters({
        search: '', city: 'all', occasion: 'all', holiday: 'all', recipient: 'all', delivery: 'all', price: 'all', type: 'all', sort: 'Popular'
      });
      setSearchParams({});
    } else {
      updateFilter(key, 'all');
    }
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-white uppercase tracking-wider">{t('occasions')}</label>
        <Select value={filters.occasion} onValueChange={(v) => updateFilter('occasion', v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder={t('filterBy')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('clearFilters')}</SelectItem>
            {['Birthday', 'Wedding', 'NewBaby', 'Anniversary', 'Graduation', 'NewHome', 'SympathyFlowers', 'Funeral'].map(o => (
              <SelectItem key={o} value={o}>{t(o)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white uppercase tracking-wider">{t('religiousHolidays')}</label>
        <Select value={filters.holiday} onValueChange={(v) => updateFilter('holiday', v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder={t('filterBy')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('clearFilters')}</SelectItem>
            {['Ramadan', 'EidalFitr', 'EidalAdha', 'Christmas', 'Easter', 'AllSaintsDay'].map(h => (
              <SelectItem key={h} value={h}>{t(h)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white uppercase tracking-wider">{t('city')}</label>
        <Select value={filters.city} onValueChange={(v) => updateFilter('city', v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder={t('filterBy')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCities')}</SelectItem>
            {['Tirana', 'Pristina', 'Skopje', 'Dibër', 'Struga', 'Gostivar', 'Tetovo'].map(c => (
              <SelectItem key={c} value={c}>{t(c)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white uppercase tracking-wider">{t('recipient')}</label>
        <Select value={filters.recipient} onValueChange={(v) => updateFilter('recipient', v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder={t('filterBy')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('clearFilters')}</SelectItem>
            {['ForHer', 'ForHim', 'Parents', 'Kids', 'Baby', 'Colleagues'].map(r => (
              <SelectItem key={r} value={r}>{t(r)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white uppercase tracking-wider">{t('priceRange')}</label>
        <Select value={filters.price} onValueChange={(v) => updateFilter('price', v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder={t('filterBy')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allPrices')}</SelectItem>
            <SelectItem value="0-25">€0 - €25</SelectItem>
            <SelectItem value="25-50">€25 - €50</SelectItem>
            <SelectItem value="50-100">€50 - €100</SelectItem>
            <SelectItem value="100-9999">€100+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('browse')} - Occasions Gifts</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{t('browse')}</h1>
              <p className="text-slate-400">{filteredProducts.length} {t('products')}</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder={t('search')} 
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <Select value={filters.sort} onValueChange={(v) => updateFilter('sort', v)}>
                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Popular">{t('Popular')}</SelectItem>
                  <SelectItem value="Newest">{t('Newest')}</SelectItem>
                  <SelectItem value="PriceLowHigh">{t('PriceLowHigh')}</SelectItem>
                  <SelectItem value="PriceHighLow">{t('PriceHighLow')}</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden bg-slate-800 border-slate-700 text-white"><Filter className="h-4 w-4" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#1a2a4a] border-slate-700 overflow-y-auto">
                   <div className="mt-6"><SidebarContent /></div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 sticky top-24">
                <SidebarContent />
              </div>
            </aside>

            {/* Main Grid */}
            <div className="flex-1">
              <FilterChips filters={filters} onRemove={removeFilter} />
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 rounded-lg">
                  <Filter className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">{t('noProductsFound')}</h3>
                  <Button variant="link" onClick={() => removeFilter('all')} className="text-[#d4af37]">{t('clearFilters')}</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card className="bg-slate-800/50 border-slate-700 hover:border-[#d4af37] transition-all duration-300 overflow-hidden group h-full flex flex-col">
                        <Link to={`/product/${product.id}`}>
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {product.occasion_tags?.[0] && (
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f]">
                                  {t(product.occasion_tags[0])}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        <CardContent className="p-4 flex-1">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2 min-h-[40px]">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                            <StoreIcon className="h-3 w-3" />
                            <span>{stores.find(s => s.id === product.store_id)?.name}</span>
                          </div>
                          <CurrencyDisplay 
                            eurAmount={product.price_eur} 
                            country={stores.find(s => s.id === product.store_id)?.country || 'Albania'}
                          />
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0">
                          <Link to={`/product/${product.id}`} className="w-full">
                            <Button className="w-full bg-slate-700 hover:bg-[#d4af37] hover:text-[#1a2a4a] text-white font-semibold transition-colors">
                              {t('viewDetails')}
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowseShop;