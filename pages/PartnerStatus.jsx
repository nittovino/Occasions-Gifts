import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslation } from '@/hooks/useTranslation';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PartnerStatus = () => {
  const { currentUser } = useSupabaseAuth();
  const { getItem } = useLocalStorage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app with Supabase, we would query the 'stores' table where owner_id = currentUser.id
    // Here we simulate by checking localStorage 'stores'
    if (currentUser) {
      const stores = getItem('stores') || [];
      const userStore = stores.find(s => s.owner_email === currentUser.email); // using email as proxy for ID in localStorage
      setApplication(userStore);
    }
    setLoading(false);
  }, [currentUser, getItem]);

  if (loading) return <div className="min-h-screen bg-[#1a2a4a] flex items-center justify-center text-white">Loading...</div>;

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">No Application Found</h2>
          <p className="text-slate-400 mb-8">You haven't submitted a store application yet.</p>
          <Link to="/partner/open">
            <Button className="bg-[#d4af37] text-[#1a2a4a]">{t('poBtnStart')}</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
      approved: "bg-green-500/20 text-green-500 border-green-500/50",
      rejected: "bg-red-500/20 text-red-500 border-red-500/50",
      suspended: "bg-orange-500/20 text-orange-500 border-orange-500/50"
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle2,
      rejected: XCircle,
      suspended: AlertTriangle
    };

    const labelKey = `psStatus${status.charAt(0).toUpperCase() + status.slice(1)}`;
    const Icon = icons[status] || Clock;

    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${styles[status] || styles.pending}`}>
        <Icon className="h-5 w-5" />
        <span className="capitalize font-bold">{t(labelKey)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-serif font-bold text-white">{t('psTitle')}</h1>
            <StatusBadge status={application.status} />
          </div>

          <Card className="bg-[#0f1a2e] border-slate-700 text-slate-200 mb-8">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white">{t('psAppDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-500 uppercase">{t('lblStoreName')}</label>
                  <p className="text-lg font-medium text-white">{application.name}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">{t('lblCity')}</label>
                  <p className="text-lg font-medium text-white">{application.city}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">{t('psLblSubmitted')}</label>
                  <p className="text-lg font-medium text-white">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">{t('psLblEmail')}</label>
                  <p className="text-lg font-medium text-white">{application.owner_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditional Actions based on Status */}
          <div className="bg-[#1a2a4a] border border-slate-700 rounded-xl p-8 text-center">
            {application.status === 'pending' && (
              <>
                <h3 className="text-xl font-bold text-white mb-4">{t('psPendingTitle')}</h3>
                <p className="text-slate-400 mb-6">{t('psPendingDesc')}</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/partner/open')} className="border-slate-600 text-slate-300">
                    {t('psBtnEditApp')}
                  </Button>
                </div>
              </>
            )}

            {application.status === 'approved' && (
              <>
                <h3 className="text-xl font-bold text-green-500 mb-4">{t('psApprovedTitle')}</h3>
                <p className="text-slate-400 mb-6">{t('psApprovedDesc')}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/store">
                    <Button className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold w-full sm:w-auto">
                      {t('psBtnDashboard')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/partner/guide">
                    <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a2a4a] w-full sm:w-auto">
                      {t('psBtnGuide')}
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {application.status === 'rejected' && (
              <>
                <h3 className="text-xl font-bold text-red-500 mb-4">{t('psRejectedTitle')}</h3>
                <p className="text-slate-400 mb-6">{t('psRejectedDesc')}</p>
                <Button className="bg-slate-700 text-white">{t('psBtnContact')}</Button>
              </>
            )}
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-slate-500 text-sm">{t('pgSecSupportText')} <a href="mailto:partners@occasions-gifts.com" className="text-[#d4af37] underline">partners@occasions-gifts.com</a></p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnerStatus;