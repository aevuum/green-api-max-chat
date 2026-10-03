import { LoginForm } from '@/features/auth'
import { GREEN_API_CONSOLE_URL } from '@/shared/config'
import { Logo } from '@/shared/ui'
import styles from './LoginPage.module.css'

export const LoginPage = () => (
  <main className={styles.page}>
    <section className={styles.card}>
      <header className={styles.header}>
        <Logo size={56} />
        <h1 className={styles.title}>Вход в MAX</h1>
        <p className={styles.subtitle}>
          Введите данные инстанса из{' '}
          <a href={GREEN_API_CONSOLE_URL} target="_blank" rel="noreferrer">
            личного кабинета GREEN-API
          </a>
        </p>
      </header>
      <LoginForm />
    </section>
  </main>
)
