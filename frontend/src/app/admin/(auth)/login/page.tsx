import AdminLoginForm from '@/components/admin/form/Login'
import { Typography } from '@/components/common/typography'

export const metadata = {
  title: 'Admin Login'
}

const AdminLoginPage = () => {
  return (
    <div className='space-y-10 bg-white shadow-lg p-6 sm:p-10 rounded-lg w-full max-w-md'>
      <div className='flex flex-col items-center gap-2'>
        <Typography variant='h3' as='h3' weight='medium'>
          Admin Login
        </Typography>
      </div>
      <AdminLoginForm />
    </div>
  )
}

export default AdminLoginPage
