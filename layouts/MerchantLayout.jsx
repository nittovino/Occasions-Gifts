import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ListOrdered, Wallet, Settings, Menu, X, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';


const navItems = [
  { href: '/store', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/store/products', label: 'Products', icon: Package },
  { href: '/store/orders', label: 'Orders', icon: ListOrdered },
  { href: '/store/payouts', label: 'Payouts', icon: Wallet },
  { href: '/store/settings', label: 'Settings', icon: Settings },
];

const Header = ({ onMenuClick }) => {
  const { currentUser, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'mk', name: 'Македонски', flag: '🇲🇰' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-[#0f1a2e] border-slate-800 px-4 md:px-6">
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>
      <div className="w-full flex-1">
        {/* Can add search bar here later */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors outline-none">
            <Globe className="h-4 w-4 mr-1.5" />{language.toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a2a4a] border-slate-700">
          {languages.map(lang => (
            <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className="text-white hover:bg-slate-700 cursor-pointer">
              <span className="mr-2">{lang.flag}</span> {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-[#d4af37]">
                <span className="font-bold">{currentUser?.email?.[0].toUpperCase()}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#1a2a4a] border-slate-700 text-white" align="end" forceMount>
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-slate-700 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden border-r bg-[#0f1a2e] border-slate-800 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="merchant-logo-container flex items-center justify-center">
            <Logo width="140px" href="/store" />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                to={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${location.pathname === href ? 'bg-slate-800 text-[#d4af37]' : 'text-slate-300 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

const MerchantLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-[#1a2a4a]">
          {children}
        </main>
      </div>

       <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col border-r bg-[#0f1a2e] border-slate-800 lg:hidden"
            >
                 <div className="merchant-logo-container flex items-center justify-between">
                   <div onClick={() => setMobileMenuOpen(false)}>
                     <Logo width="120px" href="/store" />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-6 w-6 text-white"/>
                   </Button>
                </div>
                 <nav className="grid gap-2 text-lg font-medium p-4">
                     {navItems.map(({ href, label, icon: Icon }) => (
                         <Link
                            key={label}
                            to={href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-4 rounded-xl px-3 py-3 transition-all ${location.pathname === href ? 'bg-slate-800 text-[#d4af37]' : 'text-slate-300 hover:text-white'}`}
                          >
                             <Icon className="h-5 w-5" />
                             {label}
                         </Link>
                     ))}
                 </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantLayout;