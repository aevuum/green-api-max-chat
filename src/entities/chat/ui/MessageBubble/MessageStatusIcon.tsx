import type { ReactNode } from 'react'
import { AlertIcon, CheckIcon, ClockIcon, DoubleCheckIcon } from '@/shared/ui/icons'
import type { MessageStatus } from '../../model/types'
import styles from './MessageBubble.module.css'

const STATUS_VIEW: Record<MessageStatus, { label: string; icon: ReactNode; className?: string }> = {
  pending: { label: 'Отправляется', icon: <ClockIcon width={14} height={14} /> },
  sent: { label: 'Отправлено', icon: <CheckIcon width={16} height={16} /> },
  delivered: { label: 'Доставлено', icon: <DoubleCheckIcon width={18} height={16} /> },
  read: {
    label: 'Прочитано',
    icon: <DoubleCheckIcon width={18} height={16} />,
    className: styles.statusRead,
  },
  failed: {
    label: 'Не отправлено',
    icon: <AlertIcon width={14} height={14} />,
    className: styles.statusFailed,
  },
}

interface MessageStatusIconProps {
  status: MessageStatus
}

export const MessageStatusIcon = ({ status }: MessageStatusIconProps) => {
  const { label, icon, className } = STATUS_VIEW[status]

  return (
    <span className={className ?? styles.status} title={label} aria-label={label} role="img">
      {icon}
    </span>
  )
}
