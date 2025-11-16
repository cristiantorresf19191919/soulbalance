import React from 'react'
import styles from './Separator.module.css'

type SeparatorVariant = 'light' | 'dark'
type SeparatorAlign = 'center' | 'left' | 'right'

interface SeparatorProps {
  /** Optional small label rendered in the center of the line (e.g. "o") */
  label?: React.ReactNode
  /** Visual variant depending on background */
  variant?: SeparatorVariant
  /** Alignment of the separator within its container */
  align?: SeparatorAlign
  /** More compact vertical spacing */
  compact?: boolean
  /** Use when the separator is rendered on a light background */
  mutedLabel?: boolean
  className?: string
}

export function Separator({
  label,
  variant = 'dark',
  align = 'center',
  compact = false,
  mutedLabel = false,
  className
}: SeparatorProps) {
  const alignClass =
    align === 'left'
      ? styles.alignLeft
      : align === 'right'
        ? styles.alignRight
        : ''

  const variantClass = variant === 'light' ? styles.light : styles.dark
  const compactClass = compact ? styles.compact : ''

  const containerClassName = [
    styles.separator,
    variantClass,
    alignClass,
    compactClass,
    className
  ]
    .filter(Boolean)
    .join(' ')

  const labelClassName = [
    styles.label,
    mutedLabel ? styles.mutedLabel : '',
    variant === 'light' ? styles.onLight : ''
  ]
    .filter(Boolean)
    .join(' ')

  if (!label) {
    return (
      <div className={containerClassName}>
        <span className={styles.line} />
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <span className={styles.line} />
      <span className={labelClassName}>{label}</span>
      <span className={styles.line} />
    </div>
  )
}

export default Separator


