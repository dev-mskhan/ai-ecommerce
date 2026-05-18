import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { BuyerLayout } from './layouts/BuyerLayout';
import { ProtectedRoute, PublicOnlyRoute, RoleRedirect } from './components/common/ProtectedRoute';
import { VendorLayout } from './layouts/VendorLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';

// Buyer Pages
const HomePage = lazy(() => import('./pages/buyer/HomePage').then(m => ({ default: m.HomePage })));
const ProductListingPage = lazy(() => import('./pages/buyer/ProductListingPage').then(m => ({ default: m.ProductListingPage })));
const ProductDetailPage = lazy(() => import('./pages/buyer/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/buyer/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/buyer/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const BuyerDashboardPage = lazy(() => import('./pages/buyer/BuyerDashboardPage').then(m => ({ default: m.BuyerDashboardPage })));
const CategoryListingPage = lazy(() => import('./pages/buyer/CategoryListingPage').then(m => ({ default: m.CategoryListingPage })));
const VendorOnboardingPage = lazy(() => import('./pages/vendor/VendorOnboardingPage').then(m => ({ default: m.VendorOnboardingPage })));
const PaymentSuccessPage = lazy(() => import('./pages/buyer/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));

// Auth Pages
const LoginPage = lazy(() => import('@pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@pages/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const EmailVerificationPage = lazy(() => import('@pages/auth/EmailVerificationPage').then(m => ({ default: m.EmailVerificationPage })));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// Vendor Pages


//Admin Pages 
const AdminDashboardPage = lazy(() => import('@pages/admin/AdminDashboardPage.tsx').then(m => ({ default: m.AdminDashboardPage })));
const AdminAnalyticsPage = lazy(() => import('@pages/admin/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminCategoriesPage = lazy(() => import('@pages/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminExchangesPage = lazy(() => import('@pages/admin/AdminExchangesPage').then(m => ({ default: m.AdminExchangesPage })));
const AdminInventoryPage = lazy(() => import('@pages/admin/AdminInventoryPage').then(m => ({ default: m.AdminInventoryPage })));
const AdminPartnersPage = lazy(() => import('@pages/admin/AdminPartnersPage').then(m => ({ default: m.AdminPartnersPage })));
const AdminPersonnelPage = lazy(() => import('@pages/admin/AdminPersonnelPage.tsx').then(m => ({ default: m.AdminPersonnelPage })));
const AdminReportsPage = lazy(() => import('@pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminCouponsPage = lazy(() => import('@pages/admin/AdminCouponsPage').then(m => ({ default: m.AdminCouponsPage })));
const AdminSettingsPage = lazy(() => import('@pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

export const router = createBrowserRouter([
    // Auth routes
    { path: '/login', element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute> },
    { path: '/signup', element: <PublicOnlyRoute><SignupPage /></PublicOnlyRoute> },
    { path: '/verify-email', element: <EmailVerificationPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },

    // Role-based entry point redirect
    { path: '/dashboard', element: <RoleRedirect /> },
    { path: '/unauthorized', element: <UnauthorizedPage /> },
    // Buyer
    {
        path: '/',
        element: <BuyerLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'products', element: <ProductListingPage /> },
            { path: 'product/:id', element: <ProductDetailPage /> },
            { path: 'categories', element: <CategoryListingPage /> },
            { path: 'category/:category', element: <ProductListingPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'cart', element: <CartPage /> },
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'payment-success', element: <PaymentSuccessPage /> },
                    { path: 'account', element: <BuyerDashboardPage /> },
                    { path: 'vendor-onboarding', element: <VendorOnboardingPage /> },
                ]
            }
        ]
    },

    // Admin
    {
        path: '/admin',
        element: <ProtectedRoute roles={['admin']} />,
        children: [{
            element: <AdminLayout />,
            children: [
                { index: true, element: <AdminDashboardPage /> },
                { path: 'analytics', element: <AdminAnalyticsPage /> },
                { path: 'categories', element: <AdminCategoriesPage /> },
                { path: 'orders', element: <AdminExchangesPage /> },
                { path: 'products', element: <AdminInventoryPage /> },
                { path: 'vendors', element: <AdminPartnersPage /> },
                { path: 'users', element: <AdminPersonnelPage /> },
                { path: 'reports', element: <AdminReportsPage /> },
                { path: 'coupons', element: <AdminCouponsPage /> },
                { path: 'settings', element: <AdminSettingsPage /> },
            ]
        }]
    },

    // Vendor
    {
        path: '/vendor',
        element: <ProtectedRoute roles={['vendor']} />,
        children: [{
            element: <VendorLayout />,
            children: [
                // vendor pages...
            ]
        }]
    },
]);