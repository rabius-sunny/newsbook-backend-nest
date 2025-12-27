import AdminLoginForm from '@/components/admin/form/Login';
import { Typography } from '@/components/common/typography';
import { Suspense } from 'react';

export const metadata = {
  title: 'Admin Login',
};

const AdminLoginPage = () => {
  return (
    <div className="space-y-10 bg-white shadow-lg p-6 sm:p-10 rounded-lg w-full max-w-md">
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h3" as="h3" weight="medium">
          Admin Login
        </Typography>
      </div>
      <Suspense
        fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
};

export default AdminLoginPage;
