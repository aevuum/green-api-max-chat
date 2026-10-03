import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: number
}

export const Spinner = ({ size = 20 }: SpinnerProps) => (
  <span
    className={styles.spinner}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Загрузка"
  />
)
