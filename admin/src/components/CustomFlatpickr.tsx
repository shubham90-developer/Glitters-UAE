'use client'

import Flatpickr from 'react-flatpickr'

type FlatpickrProps = {
  className?: string
  value?: string | Date | Date[]
  options?: object
  placeholder?: string
  onChange?: (selectedDates: Date[], dateStr: string) => void
}

const CustomFlatpickr = ({ className, value, options, placeholder, onChange }: FlatpickrProps) => {
  return <Flatpickr className={className} value={value} options={options} placeholder={placeholder} onChange={onChange} />
}

export default CustomFlatpickr
