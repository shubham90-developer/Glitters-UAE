import { currency } from '@/context/constants'
import { PageType, StatType } from './types'

export const stateData: StatType[] = [
  {
    icon: 'solar:box-bold-duotone',
    name: 'Total Products',
    amount: '13,647',
    bg: '#EAF2FF',
    change: '2.3',
  },
  {
    icon: 'solar:cart-large-2-bold-duotone',
    name: 'Total Orders',
    amount: '1,236',
    bg: '#ECFDF3',
    change: '10.6',
  },
  {
    icon: 'solar:bag-check-bold-duotone',
    name: "Today's Orders",
    amount: '185',
    bg: '#FFF8E6',
    change: '6.4',
  },
  {
    icon: 'solar:wallet-money-bold-duotone',
    name: 'Total Revenue',
    amount: `${currency} 42.8k`,
    bg: '#EAFBFF',
    change: '4.8',
  },
  {
    icon: 'solar:shop-2-bold-duotone',
    name: 'Total Vendors',
    amount: '264',
    bg: '#FFF0F3',
    change: '7.2',
  },
  {
    icon: 'solar:clock-circle-bold-duotone',
    name: 'Pending Orders',
    amount: '48',
    bg: '#F2F0F3',
    change: '7.2',
  },
  {
    icon: 'solar:case-round-bold-duotone',
    name: 'Total Job Enquiries',
    amount: '8,924',
    bg: '#F0FDF4',
    change: '5.1',
  },
  {
    icon: 'solar:chat-round-dots-bold-duotone',
    name: 'Total Contact Enquiries',
    amount: '4,286',
    bg: '#FFF9E8',
    change: '8.7',
  },
  {
    icon: 'solar:document-text-bold-duotone',
    name: 'Total Blogs',
    amount: '126',
    bg: '#FFF1F2',
    change: '1.2',
  },
]

export const pagesList: PageType[] = [
  {
    path: 'larkon/ecommerce.html',
    views: 465,
    rate: '4.4',
    variant: 'success',
  },
  {
    path: 'larkon/dashboard.html',
    views: 426,
    rate: '20.4',
    variant: 'danger',
  },
  {
    path: 'larkon/chat.html',
    views: 254,
    rate: '12.25',
    variant: 'warning',
  },
  {
    path: 'larkon/auth-login.html',
    views: 3369,
    rate: '5.2',
    variant: 'success',
  },
  {
    path: 'larkon/email.html',
    views: 985,
    rate: '64.2',
    variant: 'danger',
  },
  {
    path: 'larkon/social.html',
    views: 653,
    rate: '2.4',
    variant: 'success',
  },
  {
    path: 'larkon/blog.html',
    views: 478,
    rate: '1.4',
    variant: 'danger',
  },
]
