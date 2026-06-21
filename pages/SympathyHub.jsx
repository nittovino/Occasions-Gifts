import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageStyleToggle from '@/components/MessageStyleToggle';
import SympathyFilters from '@/components/SympathyFilters';
import SympathyCarousel from '@/components/SympathyCarousel';
import SympathyGiftCardComponent from '@/components/SympathyGiftCardComponent';
import SympathyProductCard from '@/components/SympathyProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';

const SympathyHub = () => {
  const { t } = useTranslation();
  const { getItem } = useLocalStorage();
  
  const [filters, setFilters] = useState({
    city: 'all',
    category: 'all',
    delivery: 'all',
    price: 'all',
    sort: 'Recommended'
  });
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      const allProducts = getItem('products') || [];
      const sympathyProducts = allProducts.filter(p => 
        p.occasion_tags?.some(tag => 
          ['Funeral', 'SympathyFlowers', 'Memorial', 'GetWellSoon'].includes(tag)
        )
      );
      setProducts(sympathyProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getSectionProducts = (tag) => {
    return products.filter(p => p.occasion_tags?.includes(tag)).slice(0, 8);
  };

  const flowerProducts = getSectionProducts('SympathyFlowers');
  const basketProducts = getSectionProducts('Support Baskets') || getSectionProducts('Gift Boxes');
  const memorialProducts = getSectionProducts('Memorial');
  const recommendedProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('supportSympathy')} - {t('brandName')}</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1698657176757-dc09bf4a0343" 
              alt="Sympathy" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a4a] via-[#1a2a4a]/60 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              {t('supportSympathy')}
            </h1>
            <p className="text-xl text-slate-200 mb-8 font-light drop-shadow-md">
              {t('sympathyHubSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold rounded-full px-8">
                {t('browseSympathyGifts')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a2a4a] font-bold rounded-full px-8">
                {t('sendSympathyCard')}
              </Button>
            </div>
          </div>
        </section>

        <MessageStyleToggle />
        <SympathyFilters activeFilters={filters} onFilterChange={setFilters} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-[#d4af37] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                {t('recommendedMoment')}
              </h2>
            </div>
            {loading ? <div className="h-64 bg-slate-800 animate-pulse rounded-xl" /> : (
              <SympathyCarousel products={recommendedProducts} />
            )}
          </section>

          <section>
            <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{t('sympathyFlowers')}</h2>
              <Link to="/sympathy/flowers" className="text-[#d4af37] hover:text-white flex items-center font-medium">
                {t('viewAllFlowers')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            {loading ? <div className="grid grid-cols-4 gap-6"><div className="h-80 bg-slate-800 animate-pulse rounded-xl col-span-4" /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {flowerProducts.map(p => <SympathyProductCard key={p.id} product={p} />)}
              </div>
            )}
            <div className="mt-4 flex items-center text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg w-fit">
              <Info className="h-4 w-4 mr-2 text-[#d4af37]" />
              {t('sameDayDeliveryNote')}
            </div>
          </section>

          <section>
             <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{t('supportBaskets')}</h2>
              <Link to="/sympathy/support-baskets" className="text-[#d4af37] hover:text-white flex items-center font-medium">
                {t('viewAllBaskets')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            {loading ? <div className="grid grid-cols-4 gap-6"><div className="h-80 bg-slate-800 animate-pulse rounded-xl col-span-4" /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {basketProducts.length > 0 ? basketProducts.map(p => <SympathyProductCard key={p.id} product={p} />) : (
                   <p className="col-span-4 text-slate-400 italic">{t('moreBasketsSoon')}</p>
                )}
              </div>
            )}
          </section>

          <section>
            <SympathyGiftCardComponent />
          </section>

          <section>
             <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{t('memorialTribute')}</h2>
              <Link to="/sympathy/memorial" className="text-[#d4af37] hover:text-white flex items-center font-medium">
                {t('viewAllMemorial')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            {loading ? <div className="grid grid-cols-4 gap-6"><div className="h-80 bg-slate-800 animate-pulse rounded-xl col-span-4" /></div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {memorialProducts.map(p => <SympathyProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SympathyHub;