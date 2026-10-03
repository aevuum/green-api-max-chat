import clsx from 'clsx'
import { useId, type InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = ({ label, hint, error, id, className, ...rest }: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  const description = error ?? hint

  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, error && styles.invalid)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={description ? descriptionId : undefined}
        {...rest}
      />
      {description && (
        <span id={descriptionId} className={clsx(styles.description, error && styles.error)}>
          {description}
        </span>
      )}
    </div>
  )
}
