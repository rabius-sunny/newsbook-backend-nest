import React from 'react'

const AuthLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className='flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-5 w-full h-screen'>
      {children}
    </main>
  )
}

export default AuthLayout
