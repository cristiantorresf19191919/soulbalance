'use client'

import { useState, useMemo, useCallback } from 'react'
import { Dialog } from '@mui/material'
import styles from './ChristianDatePicker.module.css'

const SPANISH_MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const SPANISH_WEEKDAYS = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá']
const ENGLISH_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

type Locale = 'es' | 'en'

interface ChristianDatePickerProps {
  open: boolean
  onClose: () => void
  selectedDate: Date | null
  onChange: (date: Date | null) => void
  minDate: Date
  filterDate?: (date: Date) => boolean
  className?: string
  locale?: Locale
}

export function ChristianDatePicker({
  open,
  onClose,
  selectedDate,
  onChange,
  minDate,
  filterDate,
  className = '',
  locale = 'es'
}: ChristianDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate || new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)

  // Helper functions for date calculations
  const isToday = useCallback((date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }, [])

  const isSelected = useCallback((date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }, [selectedDate])

  const isDisabled = useCallback((date: Date) => {
    // Check if date is before minDate
    const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (dateOnly < minDateOnly) return true
    
    // Check custom filter
    if (filterDate && !filterDate(date)) return true
    
    return false
  }, [minDate, filterDate])

  // Get the first day of the month and number of days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Previous month days to fill the first week
    const prevMonth = new Date(year, month, 0)
    const daysInPrevMonth = prevMonth.getDate()
    
    const days: Array<{
      date: Date
      isCurrentMonth: boolean
      isToday: boolean
      isSelected: boolean
      isDisabled: boolean
    }> = []

    // Add previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSelected(date),
        isDisabled: isDisabled(date)
      })
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: isSelected(date),
        isDisabled: isDisabled(date)
      })
    }

    // Add next month's leading days to complete the grid (6 rows × 7 days = 42)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSelected(date),
        isDisabled: isDisabled(date)
      })
    }

    return days
  }, [currentMonth, isToday, isSelected, isDisabled])

  const handleDateClick = useCallback((date: Date) => {
    if (isDisabled(date)) return
    onChange(date)
    onClose()
  }, [isDisabled, onChange, onClose])

  const handlePrevMonth = useCallback(() => {
    setAnimationDirection('right')
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setAnimationDirection('left')
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const canGoPrev = useMemo(() => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    return prevMonth.getTime() >= minMonth.getTime()
  }, [currentMonth, minDate])

  const monthYearLabel = useMemo(() => {
    const months = locale === 'en' ? ENGLISH_MONTHS : SPANISH_MONTHS
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
  }, [currentMonth, locale])

  const weekdays = useMemo(() => {
    return locale === 'en' ? ENGLISH_WEEKDAYS : SPANISH_WEEKDAYS
  }, [locale])

  // Reset animation direction after animation completes
  const handleAnimationEnd = useCallback(() => {
    setAnimationDirection(null)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth={false}
      className={styles.dialog}
      PaperProps={{
        className: styles.dialogPaper
      }}
      BackdropProps={{
        className: styles.backdrop
      }}
    >
      <div className={`${styles.calendarContainer} ${className}`}>
        {/* Header */}
        <div className={styles.header}>
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className={styles.navButton}
            aria-label={locale === 'en' ? 'Previous month' : 'Mes anterior'}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className={styles.monthYear}>{monthYearLabel}</div>
          <button
            type="button"
            onClick={handleNextMonth}
            className={styles.navButton}
            aria-label={locale === 'en' ? 'Next month' : 'Mes siguiente'}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Weekday headers */}
        <div className={styles.weekdayHeaders}>
          {weekdays.map((day, index) => (
            <div key={index} className={styles.weekdayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div 
          className={`${styles.calendarGrid} ${animationDirection ? styles[`slide${animationDirection.charAt(0).toUpperCase() + animationDirection.slice(1)}`] : ''}`}
          onAnimationEnd={handleAnimationEnd}
        >
          {calendarDays.map((day, index) => {
            const dayClasses = [
              styles.day,
              !day.isCurrentMonth && styles.dayOutsideMonth,
              day.isToday && styles.dayToday,
              day.isSelected && styles.daySelected,
              day.isDisabled && styles.dayDisabled
            ].filter(Boolean).join(' ')

            return (
              <button
                key={`${day.date.getTime()}-${index}`}
                type="button"
                className={dayClasses}
                onClick={() => handleDateClick(day.date)}
                disabled={day.isDisabled}
                aria-label={
                  locale === 'en'
                    ? `${day.isCurrentMonth ? 'Day' : 'Day from previous/next month'} ${day.date.getDate()}`
                    : `${day.isCurrentMonth ? 'Día' : 'Día del mes anterior/siguiente'} ${day.date.getDate()}`
                }
                aria-disabled={day.isDisabled}
              >
                {day.date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </Dialog>
  )
}

