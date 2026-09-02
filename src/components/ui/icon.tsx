import type { CSSProperties, JSX } from 'react'

export interface IconData {
  body: string
  width?: number
  height?: number
  left?: number
  top?: number
}

export interface IconProps {
  icon?: IconData | string
  className?: string
  size?: number | string
  color?: string
  style?: CSSProperties
}

export function Icon({
  icon,
  className = '',
  size = 24,
  color,
  style = {},
}: IconProps): JSX.Element | null {
  if (!icon) return null

  if (typeof icon === 'string') {
    return (
      <span
        className={`neon-icon ${className}`}
        style={{
          fontSize: typeof size === 'number' ? `${size}px` : size,
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
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
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}
