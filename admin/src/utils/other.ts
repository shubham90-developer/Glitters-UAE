import type { BootstrapVariantType } from '@/types/component-props'

type StockStatusType = {
  variant: BootstrapVariantType
  text: 'Limited' | 'Out of Stock' | 'In Stock'
}

export const getStockStatus = (quantity: number) => {
  let stockStatus: StockStatusType = { variant: 'success', text: 'In Stock' }
  if (quantity < 1) stockStatus = { variant: 'danger', text: 'Out of Stock' }
  else if (quantity < 11) stockStatus = { variant: 'primary', text: 'Limited' }
  return stockStatus
}

export const getRatingVariant = (rating: number) => {
  let ratingVariant: BootstrapVariantType = 'success'
  if (rating > 2 && rating < 4) ratingVariant = 'warning'
  else if (rating < 2) ratingVariant = 'danger'
  return ratingVariant
}

export const formatFileSize = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getRatingStatus = (rating: number) => {
  let ratingStatus = 'Excellent'
  if (rating <= 2) ratingStatus = 'Bad'
  else if (rating > 2 && rating <= 3) ratingStatus = 'Good'
  else if (rating > 3 && rating <= 4) ratingStatus = 'Best'
  return ratingStatus
}
