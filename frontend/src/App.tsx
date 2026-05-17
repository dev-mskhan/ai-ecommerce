import { CustomToasterContent } from '@components/common/toastContainer';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useCurrentUser } from './store/hooks/useUser';

export default function App() {
  const { isLoading } = useCurrentUser();
  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>;
  return (
    <>
      <RouterProvider router={router} />
      <CustomToasterContent />
    </>
  );
}