import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, User, Crown, Briefcase, Share2, FileText, ArrowRight } from 'lucide-react';

const SuperAdminDashboard = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const managementCards = [
    {
      title: 'Manage Admins',
      description: 'View and manage administrator accounts and roles',
      icon: Users,
      path: '/admin/admins',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Security Settings',
      description: 'Review security logs and configure access settings',
      icon: Shield,
      path: '/admin/security',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'My Account',
      description: 'Update your profile, email, and password',
      icon: User,
      path: '/admin/profile',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    }
  ];

  const portalCards = [
    { name: 'Loyalty Panel', path: '/admin/loyalty', icon: Crown },
    { name: 'B2B Portal', path: '/admin/b2b', icon: Briefcase },
    { name: 'Affiliate Dashboard', path: '/admin/affiliate', icon: Share2 },
    { name: 'Content Management', path: '/admin/content', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Super Admin Dashboard</h1>
            <p className="mt-1 text-slate-500">System overview and core management modules</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            Super Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {managementCards.map((card) => (
            <Card key={card.title} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#d4af37]/50 transition-colors shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="mt-4 text-xl text-slate-900 dark:text-white">{card.title}</CardTitle>
                <CardDescription className="text-slate-500">{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
                >
                  <Link to={card.path}>
                    Manage <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6">Quick Access Portals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portalCards.map((portal) => (
            <Link 
              key={portal.name} 
              to={portal.path}
              className="group bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#d4af37]/50 transition-all flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <portal.icon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-[#d4af37]" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#d4af37] transition-colors">{portal.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;