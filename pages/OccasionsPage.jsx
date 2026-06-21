import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OccasionCard from '@/components/OccasionCard';
import { useTranslation } from '@/hooks/useTranslation';

const OccasionsPage = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: 'lifeEvents',
      items: [
        { id: 'Birthday', img: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d' },
        { id: 'NewBaby', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba' },
        { id: 'Wedding', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8' },
        { id: 'Graduation', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' },
        { id: 'NewHome', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
        { id: 'Promotion', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85' }
      ]
    },
    {
      title: 'loveRelationships',
      items: [
        { id: 'ValentinesDay', img: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46' },
        { id: 'MothersDay', img: 'https://images.unsplash.com/photo-1492447990176-5fa4538965c4' },
        { id: 'Couples', img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2' },
        { id: 'Anniversary', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7' }
      ]
    },
    {
      title: 'supportSympathy',
      items: [
        { id: 'GetWellSoon', img: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5' },
        { id: 'SympathyFlowers', img: 'https://images.unsplash.com/photo-1595156557876-b6d37651c6de' }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('shopByOccasion')} - Occasions Gifts</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t('shopByOccasion')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {t('emotionalMessage')}
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={section.title} className="mb-20 last:mb-0">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-serif font-bold text-[#d4af37] mb-8 border-b border-slate-700 pb-4"
              >
                {t(section.title)}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <OccasionCard 
                      occasion={item.id}
                      image={item.img}
                      count="12+" // Dynamic count would require pulling from store
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OccasionsPage;