
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AffiliateLanguageProvider } from '@/contexts/AffiliateLanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/ToastContainer';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import MerchantProtectedRoute from '@/components/MerchantProtectedRoute';

// Auth Callback
import OAuthCallback from '@/pages/OAuthCallback';

// Admin Components & Pages
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import SuperAdminDashboard from '@/pages/admin/SuperAdminDashboard';
import ManageAdminsPage from '@/pages/admin/ManageAdminsPage';
import SecuritySettingsPage from '@/pages/admin/SecuritySettingsPage';
import MyAccountPage from '@/pages/admin/MyAccountPage';
import LoyaltyAdmin from '@/pages/admin/LoyaltyAdmin';
import B2BAdmin from '@/pages/admin/B2BAdmin';
import AffiliateAdmin from '@/pages/admin/AffiliateAdmin';
import ContentAdmin from '@/pages/admin/ContentAdmin';

// Public Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import BrowseShop from '@/pages/BrowseShop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import GiftCards from '@/pages/GiftCards';
import GiftCardPage from '@/pages/GiftCardPage';
import ClaimGiftCard from '@/pages/ClaimGiftCard';
import OrderTracking from '@/pages/OrderTracking';
import OccasionsPage from '@/pages/OccasionsPage';
import HolidaysPage from '@/pages/HolidaysPage';

// Loyalty Pages
import LoyaltyPage from '@/pages/LoyaltyPage';
import LoyaltyDashboard from '@/pages/LoyaltyDashboard';

// Account Pages
import AccountPage from '@/pages/AccountPage';
import OrderDetailsPage from '@/pages/OrderDetailsPage';

// Sympathy Pages
import SympathyHub from '@/pages/SympathyHub';
import SympathyFlowers from '@/pages/SympathyFlowers';
import SympathyBaskets from '@/pages/SympathyBaskets';
import SympathyMemorial from '@/pages/SympathyMemorial';

// Partner Pages
import PartnerOverview from '@/pages/PartnerOverview';
import PartnerOnboarding from '@/pages/PartnerOnboarding';
import PartnerContract from '@/pages/PartnerContract';
import PartnerGuide from '@/pages/PartnerGuide';
import PartnerStatus from '@/pages/PartnerStatus';
import PartnerSuccess from '@/pages/PartnerSuccess';

// Merchant Pages
import AddProductPage from '@/pages/AddProductPage';
import StoreDashboard from '@/pages/StoreDashboard';
import MerchantOnboarding from '@/pages/MerchantOnboarding';
import ProductsManagement from '@/pages/ProductsManagement';
import OrdersManagement from '@/pages/OrdersManagement';
import PayoutsManagement from '@/pages/PayoutsManagement';
import StoreSettings from '@/pages/StoreSettings';

// Affiliate Pages
import AffiliateProgram from '@/pages/AffiliateProgram';
import AffiliateSignup from '@/pages/AffiliateSignup';
import AffiliateConfirmation from '@/pages/AffiliateConfirmation';

// Static Info Pages
import AboutUsPage from '@/pages/AboutUsPage';
import ContactUsPage from '@/pages/ContactUsPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <SupabaseAuthProvider>
          <LanguageProvider>
            <AffiliateLanguageProvider>
              <CartProvider>
                <ScrollToTop />
                <div className="app-container">
                  <Routes>
                    {/* OAuth Callback - Must be accessible before auth checks */}
                    <Route path="/auth/callback" element={<OAuthCallback />} />

                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* VERIFIED: Signup is entirely public, not wrapped in any ProtectedRoute */}
                    <Route path="/signup" element={<SignupPage />} />
                    
                    <Route path="/browse" element={<BrowseShop />} />
                    <Route path="/occasions" element={<OccasionsPage />} />
                    <Route path="/holidays" element={<HolidaysPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/gift-cards/claim" element={<ClaimGiftCard />} />
                    <Route path="/order/:trackingToken" element={<OrderTracking />} />

                    {/* Affiliate Routes */}
                    <Route path="/affiliate" element={<AffiliateProgram />} />
                    <Route path="/affiliate-signup" element={<AffiliateSignup />} />
                    <Route path="/affiliate-confirmation" element={<AffiliateConfirmation />} />

                    {/* Loyalty Routes */}
                    <Route path="/loyalty-members" element={<LoyaltyPage />} />
                    <Route path="/loyalty-dashboard" element={<ProtectedRoute><LoyaltyDashboard /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    <Route path="/admin/super" element={
                      <ProtectedAdminRoute requiredRole="super_admin">
                        <SuperAdminDashboard />
                      </ProtectedAdminRoute>
                    } />

                    <Route path="/admin/admins" element={
                      <ProtectedAdminRoute requiredRole="super_admin">
                        <ManageAdminsPage />
                      </ProtectedAdminRoute>
                    } />

                    <Route path="/admin/security" element={
                      <ProtectedAdminRoute requiredRole="super_admin">
                        <SecuritySettingsPage />
                      </ProtectedAdminRoute>
                    } />

                    <Route path="/admin/profile" element={
                      <ProtectedAdminRoute requiredRole="super_admin">
                        <MyAccountPage />
                      </ProtectedAdminRoute>
                    } />
                    
                    <Route path="/admin/loyalty" element={
                      <ProtectedAdminRoute requiredRole="loyalty_manager">
                        <LoyaltyAdmin />
                      </ProtectedAdminRoute>
                    } />
                    
                    <Route path="/admin/b2b" element={
                      <ProtectedAdminRoute requiredRole="b2b_manager">
                        <B2BAdmin />
                      </ProtectedAdminRoute>
                    } />
                    
                    <Route path="/admin/affiliate" element={
                      <ProtectedAdminRoute requiredRole="affiliate_manager">
                        <AffiliateAdmin />
                      </ProtectedAdminRoute>
                    } />
                    
                    <Route path="/admin/content" element={
                      <ProtectedAdminRoute requiredRole="content_manager">
                        <ContentAdmin />
                      </ProtectedAdminRoute>
                    } />

                    {/* Static Pages */}
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/contact-us" element={<ContactUsPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/cookie-policy" element={<CookiePolicyPage />} />

                    <Route 
                      path="/gift-card/:giftCardId" 
                      element={<ProtectedRoute><GiftCardPage /></ProtectedRoute>} 
                    />

                    {/* Account Routes */}
                    <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                    <Route path="/account/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />

                    {/* Partner Routes */}
                    <Route path="/partner" element={<PartnerOverview />} />
                    <Route path="/partner/open" element={<PartnerOnboarding />} />
                    <Route path="/partner/contract" element={<PartnerContract />} />
                    <Route path="/partner/guide" element={<PartnerGuide />} />
                    <Route path="/partner/success" element={<PartnerSuccess />} />
                    <Route 
                      path="/partner/status" 
                      element={<ProtectedRoute><PartnerStatus /></ProtectedRoute>} 
                    />

                    {/* Sympathy Routes */}
                    <Route path="/sympathy" element={<SympathyHub />} />
                    <Route path="/sympathy/flowers" element={<SympathyFlowers />} />
                    <Route path="/sympathy/support-baskets" element={<SympathyBaskets />} />
                    <Route path="/sympathy/memorial" element={<SympathyMemorial />} />

                    {/* Protected Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                    <Route path="/merchant/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />

                    {/* Store Owner / Merchant Routes */}
                    <Route path="/store" element={<MerchantProtectedRoute><StoreDashboard /></MerchantProtectedRoute>} />
                    <Route path="/store/onboarding" element={<MerchantProtectedRoute><MerchantOnboarding /></MerchantProtectedRoute>} />
                    <Route path="/store/products" element={<MerchantProtectedRoute><ProductsManagement /></MerchantProtectedRoute>} />
                    <Route path="/store/orders" element={<MerchantProtectedRoute><OrdersManagement /></MerchantProtectedRoute>} />
                    <Route path="/store/payouts" element={<MerchantProtectedRoute><PayoutsManagement /></MerchantProtectedRoute>} />
                    <Route path="/store/settings" element={<MerchantProtectedRoute><StoreSettings /></MerchantProtectedRoute>} />

                  </Routes>
                </div>
                <ToastContainer />
                <Toaster />
              </CartProvider>
            </AffiliateLanguageProvider>
          </LanguageProvider>
        </SupabaseAuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
