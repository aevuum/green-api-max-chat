import styles from './Logo.module.css'

interface LogoProps {
  size?: number
}

export const Logo = ({ size = 40 }: LogoProps) => (
  <span className={styles.logo} style={{ width: size, height: size }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="currentColor">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
    </svg>
  </span>
)
