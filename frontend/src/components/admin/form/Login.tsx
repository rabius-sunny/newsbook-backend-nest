'use client'
import { authenticateAdmin } from '@/action/auth'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginSchema, loginSchema } from '@/lib/validations/schemas/adminAuthSchema'
import { useAdminStore } from '@/stores/admin-info'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AdminLoginForm = () => {
  const router = useRouter()
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const { setAdminInfo } = useAdminStore((state) => state)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setLoading(true)
    try {
      const res = await authenticateAdmin(data.field, data.password)

      if (res.token) {
        router.refresh()
        setAdminInfo({
          ...res?.user
        })
        // toast.success('Login Successfully!')
      }
    } catch {
      setLoading(false)
      toast.error('Invalid credentials')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Email address Field */}
      <div className='space-y-2'>
        <Label htmlFor='email'>Email address</Label>
        <Controller
          name='field'
          control={control}
          render={({ field }) => (
            <div className='relative'>
              <Mail className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
              <Input
                {...field}
                id='email'
                type='email'
                placeholder='Email address'
                className={`pl-10 ${errors.field ? 'border-destructive' : ''}`}
              />
            </div>
          )}
        />
        {errors.field && <p className='text-destructive text-sm'>{errors.field.message}</p>}
      </div>

      {/* Password Field */}
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <div className='relative'>
              <Lock className='top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2' />
              <Input
                {...field}
                id='password'
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Password'
                className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
              />
              <button
                type='button'
                onClick={() => setPasswordVisible(!passwordVisible)}
                className='top-1/2 right-3 absolute w-4 h-4 text-muted-foreground hover:text-foreground -translate-y-1/2'
              >
                {passwordVisible ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
          )}
        />
        {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='remember'
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor='remember' className='font-normal text-sm'>
            Remember me
          </Label>
        </div>
        <Link href='/admin/forget-password' className='text-primary text-sm hover:underline'>
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}

export default AdminLoginForm
