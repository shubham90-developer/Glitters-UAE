import type { StaticImageData } from 'next/image'
import type { NumberRange } from './utils'
import { BootstrapVariantType } from './component-props'

export type IdType = string

export type EmailLabelType = 'Primary' | 'Social' | 'Promotions' | 'Updates' | 'Forums'

export type ReviewType = {
  count: number
  stars: number
}

export type AppType = {
  image: StaticImageData
  name: string
  handle: string
}

export type NotificationType = {
  from: string
  content: string
  icon?: StaticImageData
}

export type APIReturnResponseType = {
  status: number
  message: string
  data: any
}

export type ActivityType = {
  title: string
  icon?: StaticImageData
  variant?: BootstrapVariantType
  status?: 'completed' | 'latest'
  files?: FileType[]
  time: Date
  type?: 'tasks' | 'design' | 'achievement'
  content?: string
}

export type SaleType =
  | {
      type: 'percent'
      discount: NumberRange<0, 100>
    }
  | {
      type: 'amount'
      discount: number
    }

export type CategoryType = {
  id: IdType
  name: string
}

export type ProductType = {
  id: IdType
  image: StaticImageData
  title: string
  price: number
  sellPrice: number
  rating: { star: number; review: number }
  category: string
  gender: 'men' | 'women' | 'kids'
  date: Date
  size: 's' | 'm' | 'l' | 'xl' | 'xxl'
  stockLeft: number
  stockSold: number
  quantity: number
  tex: number
  color: string
  total?: number
  itemStatus: 'Published' | 'Pending' | 'Draft'
  discount: string
  code: string
  endDate: Date
  productStatus: 'Active' | 'Expired'
}

export type UserType = {
  id: IdType
  name: string
  image: StaticImageData
  email: string
  phone: string
  address: string
  activityStatus: 'typing' | 'online' | 'offline'
  compony: string
  position: string
  languages: string[]
  location: string
  hasRequested?: boolean
  message?: string
  time: Date
  status?: string
  mutualCount: number
}

export type OrderType = {
  id: IdType
  productId: ProductType['id']
  product?: ProductType
  customerId: UserType['id']
  customer?: UserType
  paymentMethod: 'Credit Card' | 'Pay Pal' | 'Google Pay'
  status: 'Delivered' | 'Processing' | 'Completed'
  priority: 'Normal' | 'High'
  paymentStatus: 'Paid' | 'Unpaid' | 'Refund'
  orders: number
  deliveryNumber?: string
  createBy: 'Seller' | 'Admin'
  orderId: string
  productStock: number
  maxPrice: number
  total: number
  orderStatus: 'Completed' | 'Packaging' | 'Draft' | 'Canceled'
  amountDue: number
}

export type WarehouseType = {
  id: IdType
  warehouseName: string
  userId: UserType['id']
  user?: UserType
  location: string
  stock: number
  stockShipping: number
  warehouseRevenue: number
}

export type AttributeListType = {
  id: IdType
  variant: string
  Value: string
  option: 'Dropdown' | 'Radio'
  date: Date
  defaultCheck?: boolean
}

export type RoleListType = {
  role: string
  workspace?: string
  tags: string[]
  users?: {
    TextAvatar?: {
      text: string
      variant: string
    }[]
    image?: StaticImageData[]
  }[]
  status?: boolean
  icon?: StaticImageData
}

export type PermissionsListType = {
  name: string
  assignedTo: string[]
  date: Date
  lastUpdate: string
}

export type SellersType = {
  image: StaticImageData
  title: string
  category: string
  rating: { star: number; review: number }
  url: string
  address: string
  email: string
  phone: string
  amount: number
  progress: number
  itemStock: number
  sells: number
  clients: number
}

export type ReviewListType = {
  userId: UserType['id']
  user?: UserType
  id: IdType
  title: string
  description: string
  rating: number
}

export type GroupType = {
  id: IdType
  image: StaticImageData
  name: string
  description: string
  membersCount: number
  joined?: boolean
  friends?: boolean
  suggested?: boolean
}

export type ChatMessageType = {
  id: IdType
  from: UserType
  to: UserType
  message: {
    type: 'file' | 'text'
    value: FileType[] | string
  }
  sentOn?: Date
}

export type EmailType = {
  id: IdType
  fromId: UserType['id']
  from?: UserType
  toId: UserType['id']
  to?: UserType
  subject?: string
  content?: string
  attachments?: FileType[]
  label?: EmailLabelType
  starred?: boolean
  important?: boolean
  draft?: boolean
  deleted?: boolean
  read?: boolean
  createdAt: Date
}

export type EmailFilterType = keyof EmailCountType

export type FileType = Partial<File> & {
  preview?: StaticImageData
}

export type EmailCountType = {
  inbox: number
  starred: number
  draft: number
  sent: number
  deleted: number
  important: number
}

export type TodoType = {
  id: IdType
  task: string
  createdAt: Date
  dueDate: Date
  status: 'Pending' | 'In-Progress' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  employeeId: UserType['id']
  employee?: UserType
}

export type HelpType = {
  icon: string
  title: string
  description: string
  avatar: StaticImageData
  name: string
  toggle?: () => void
  video: number
}

export type ProjectType = {
  id: IdType
  projectName: string
  client: string
  teamMembers: StaticImageData[]
  deadlineDate: Date
  progressValue: number
  variant: string
}

export type TransactionType = {
  id: IdType
  date: Date
  amount: number
  description: string
  status: 'Cr.' | 'Dr.'
}

export type Employee = {
  id: IdType
  name: string
  email: string
  position: string
  company: string
  country: string
}

export type TimelineType = {
  [key: string]: {
    title: string
    description: string
    important?: boolean
  }[]
}
