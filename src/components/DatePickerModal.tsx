'use client'

import { ChristianDatePicker } from './ChristianDatePicker'

interface DatePickerModalProps {
  open: boolean
  onClose: () => void
  selectedDate: Date | null
  onChange: (date: Date | null) => void
  minDate: Date
  filterDate: (date: Date) => boolean
}

export function DatePickerModal({
  open,
  onClose,
  selectedDate,
  onChange,
  minDate,
  filterDate
}: DatePickerModalProps) {
  return (
    <ChristianDatePicker
      open={open}
      onClose={onClose}
      selectedDate={selectedDate}
      onChange={onChange}
      minDate={minDate}
      filterDate={filterDate}
    />
  )
}

