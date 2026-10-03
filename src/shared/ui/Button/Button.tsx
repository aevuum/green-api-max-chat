import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '../Spinner'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'm' | 'l'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isIcon?: boolean
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'm',
  isLoading = false,
  isIcon = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={clsx(
      styles.button,
      styles[variant],
      styles[size],
      isIcon && styles.icon,
      fullWidth && styles.fullWidth,
      className,
    )}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...rest}
  >
    {isLoading ? <Spinner size={18} /> : children}
  </button>
)
