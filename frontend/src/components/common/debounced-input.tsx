'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface DebouncedInputProps {
  value?: string
  onChange: (value: string) => void
  delay?: number
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DebouncedInput({
  value = '',
  onChange,
  delay = 300,
  placeholder,
  className,
  disabled = false
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Update local value when external value changes (e.g., from URL or props)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced onChange effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, onChange, delay, value])

  return (
    <Input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={cn(className)}
      disabled={disabled}
    />
  )
}
