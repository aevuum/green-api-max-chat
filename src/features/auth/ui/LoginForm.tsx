import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { GreenApiCredentials } from '@/shared/api'
import { DEFAULT_GREEN_API_URL } from '@/shared/config'
import { Button, Input } from '@/shared/ui'
import { useSignIn } from '../model/useSignIn'
import {
  hasErrors,
  normalizeCredentials,
  validateCredentials,
  type CredentialsErrors,
} from '../model/validateCredentials'
import styles from './LoginForm.module.css'

const INITIAL_VALUES: GreenApiCredentials = {
  apiUrl: DEFAULT_GREEN_API_URL,
  idInstance: '',
  apiTokenInstance: '',
}

export const LoginForm = () => {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState<CredentialsErrors>({})
  const { run: signIn, isPending, error, resetError } = useSignIn()

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const field = target.name as keyof GreenApiCredentials

    setValues((current) => ({ ...current, [field]: target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    resetError()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const credentials = normalizeCredentials(values)
    const validationErrors = validateCredentials(credentials)

    setErrors(validationErrors)

    if (!hasErrors(validationErrors)) {
      void signIn(credentials)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        name="idInstance"
        label="idInstance"
        placeholder="1101000001"
        inputMode="numeric"
        autoComplete="username"
        value={values.idInstance}
        error={errors.idInstance}
        onChange={handleChange}
        autoFocus
      />
      <Input
        name="apiTokenInstance"
        label="apiTokenInstance"
        type="password"
        placeholder="d75b3a66374942c5b3c019c698abc2067e151558acbd412345"
        autoComplete="current-password"
        value={values.apiTokenInstance}
        error={errors.apiTokenInstance}
        onChange={handleChange}
      />
      <Input
        name="apiUrl"
        label="apiUrl"
        hint="Указан в личном кабинете рядом с idInstance"
        value={values.apiUrl}
        error={errors.apiUrl}
        onChange={handleChange}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="l" fullWidth isLoading={isPending}>
        Войти
      </Button>
    </form>
  )
}
