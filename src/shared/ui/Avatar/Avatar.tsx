import { UserIcon } from '../icons'
import styles from './Avatar.module.css'

const PALETTE = [
  ['#3d8bff', '#6a4dff'],
  ['#ff7a59', '#ff4d8d'],
  ['#20c997', '#1c9ad6'],
  ['#ffb238', '#ff7a1a'],
  ['#9b3dff', '#e14dff'],
  ['#2ec4b6', '#3d8bff'],
] as const

const hashString = (value: string): number =>
  [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7)

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

interface AvatarProps {
  name: string
  seed?: string
  size?: number
}

export const Avatar = ({ name, seed = name, size = 48 }: AvatarProps) => {
  const [from, to] = PALETTE[hashString(seed) % PALETTE.length] ?? PALETTE[0]
  const initials = getInitials(name)

  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {initials || <UserIcon width={size * 0.5} height={size * 0.5} />}
    </span>
  )
}
