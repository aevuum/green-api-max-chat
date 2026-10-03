import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const BaseIcon = ({ children, ...props }: IconProps) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
)

export const PlusIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </BaseIcon>
)

export const BackIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="m15 18-6-6 6-6" />
  </BaseIcon>
)

export const ChatBubbleIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.6-4.6A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
  </BaseIcon>
)

export const LogoutIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </BaseIcon>
)

export const UserIcon = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </BaseIcon>
)
