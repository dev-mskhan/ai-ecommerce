import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { BuyerLayout } from './layouts/BuyerLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

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

export const router = createBrowserRouter([
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
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/verify-email', element: <EmailVerificationPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
]);