import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SympathyFilters from '@/components/SympathyFilters';
import SympathyProductCard from '@/components/SympathyProductCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChevronRight } from 'lucide-react';

const SympathyFlowers = () => {
  const { t } = useTranslation();
  const { getItem } = useLocalStorage();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  
  const [filters, setFilters] = useState({
    city: 'all',
    category: 'all',
    delivery: 'all',
    price: 'all',
    sort: 'Recommended'
  });

  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const allProducts = getItem('products') || [];
      // Initial filter for this page category
      const pageProducts = allProducts.filter(p => 
        p.occasion_tags?.includes('SympathyFlowers') || p.occasion_tags?.includes('Funeral')
      );
      setProducts(pageProducts);
      setLoading(false);
    }, 500);
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(p => {
    // City Filter (Mock logic - assumes store lookup would happen here)
    if (filters.city !== 'all') {
      // In real app, check store.city === filters.city
    }
    
    // Price Filter
    if (filters.price !== 'all') {
      const price = p.price_eur;
      if (filters.price === '0-25') return price <= 25;
      if (filters.price === '25-50') return price > 25 && price <= 50;
      if (filters.price === '50-100') return price > 50 && price <= 100;
      if (filters.price === '100+') return price > 100;
    }
    
    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sort === 'PriceLowHigh') return a.price_eur - b.price_eur;
    if (filters.sort === 'PriceHighLow') return b.price_eur - a.price_eur;
    return 0; // Default Recommended
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('sympathyFlowers')} - Occasions Gifts</title>
      </Helmet>
      
      <Header />
      <SympathyFilters activeFilters={filters} onFilterChange={setFilters} />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/sympathy" className="hover:text-white">{t('supportSympathy')}</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-[#d4af37] font-medium">{t('sympathyFlowers')}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">{t('sympathyFlowers')}</h1>
          <p className="text-slate-400">{t('showing')} {sortedProducts.length} {t('products')}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 bg-slate-800 animate-pulse rounded-xl" />)}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map(p => <SympathyProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/50 rounded-xl">
             <h3 className="text-xl font-medium text-white mb-2">{t('noSympathyItems')}</h3>
             <Button variant="link" onClick={() => setFilters({city: 'all', category: 'all', delivery: 'all', price: 'all', sort: 'Recommended'})} className="text-[#d4af37]">
               {t('clearFilters')}
             </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SympathyFlowers;