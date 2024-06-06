import clsx from 'clsx'
import Loader from '@/components/themed/loader'
import { ButtonHTMLAttributes } from 'react'
import { Button as ThemedButton } from '@headlessui/react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  secondary?: boolean
  big?: boolean
}

export default function Button({
  title,
  isLoading,
  secondary = false,
  big = false,
  ...props
}: ButtonProps) {
  return (
    <ThemedButton
      {...props}
      disabled={props.disabled || isLoading}
      className={clsx(
        props.className,
        secondary ? 'bg-secondary' : 'bg-primary',
        big ? 'text-lg py-3 px-6' : 'text-sm/6 py-1.5 px-3',
        'inline-flex items-center gap-2 rounded-[28px]    font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white'
      )}
    >
      {isLoading ? <Loader size="md" tint="fill-white" /> : null}
      <span className={clsx(isLoading && 'ml-1')}> {title}</span>
    </ThemedButton>
  )
}
