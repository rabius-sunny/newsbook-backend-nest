import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type TProps = {
  label?: string
  name?: string
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea'
  rows?: number
  maxLength?: number
  showCharCount?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const CustomInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TProps>(
  (
    {
      label,
      name,
      placeholder,
      error,
      helperText,
      required = false,
      type = 'text',
      rows = 4,
      maxLength,
      showCharCount = false,
      disabled = false,
      className,
      labelClassName,
      inputClassName,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const isTextarea = type === 'textarea'
    const currentLength = value?.toString().length || 0

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              'font-medium text-sm',
              required && 'after:content-["*"] after:text-red-500 after:ml-1',
              disabled && 'text-gray-400',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {isTextarea ? (
          <Textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={cn(error && 'border-red-500 focus-visible:ring-red-500', inputClassName)}
            {...props}
          />
        ) : (
          <Input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={cn(error && 'border-red-500 focus-visible:ring-red-500', inputClassName)}
            {...props}
          />
        )}

        <div className='flex justify-between items-start'>
          <div className='flex flex-col gap-1'>
            {error && <span className='font-medium text-red-500 text-xs'>{error}</span>}
            {helperText && !error && <span className='text-gray-500 text-xs'>{helperText}</span>}
          </div>

          {showCharCount && maxLength && (
            <span
              className={cn(
                'text-xs',
                currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400',
                currentLength >= maxLength && 'text-red-500'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

export default CustomInput
