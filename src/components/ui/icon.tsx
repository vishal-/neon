import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'

export interface IconData {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
}

interface IconProps {
  icon?: IconData | string
  className?: string
  size?: number | string
  color?: string
  style?: Record<string, string | number>
}

export const Icon: FC<IconProps> = ({ icon, className = '', size = 24, color, style = {} }) => {
  if (!icon) return null

  if (typeof icon === 'string') {
    return (
      <span
        className={`neon-icon ${className}`}
        style={{ fontSize: typeof size === 'number' ? `${size}px` : size, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      >
        {raw(icon)}
      </span>
    )
  }

  const width = icon.width || 24
  const height = icon.height || 24

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      className={`neon-icon ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', color, ...style }}
    >
      {raw(icon.body)}
    </svg>
  )
}
