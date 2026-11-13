import { helpData } from '@/assets/data/help'
import { dataTableRecords, emailsData, projectsData, timelineData, transactionsData } from '@/assets/data/other'
import {
  attributeListData,
  ordersData,
  permissionsList,
  productData,
  reviewListData,
  roleListData,
  sellersData,
  socialGroupsData,
  userData,
  warehouseData,
} from '@/assets/data/products'
import { todoData } from '@/assets/data/task'
import { notificationsData } from '@/assets/data/topbar'
import {
  AttributeListType,
  EmailCountType,
  EmailFilterType,
  EmailType,
  Employee,
  GroupType,
  HelpType,
  NotificationType,
  OrderType,
  PermissionsListType,
  ProductType,
  ProjectType,
  ReviewListType,
  RoleListType,
  SellersType,
  TimelineType,
  TodoType,
  TransactionType,
  UserType,
  WarehouseType,
} from '@/types/data'
import { sleep } from '@/utils/promise'
import * as yup from 'yup'

export const getNotifications = async (): Promise<NotificationType[]> => {
  return notificationsData
}

export const getProductData = async (): Promise<ProductType[]> => {
  return productData
}

export const getAllTimeline = async (): Promise<TimelineType> => {
  await sleep()
  return timelineData
}

export const getAttributeData = async (): Promise<AttributeListType[]> => {
  return attributeListData
}

export const getHelpData = async (): Promise<HelpType[]> => {
  return helpData
}

export const getSellersData = async (): Promise<SellersType[]> => {
  return sellersData
}

export const getAllUsers = async (): Promise<UserType[]> => {
  await sleep()
  return userData
}

export const getAllTransactions = async (): Promise<TransactionType[]> => {
  await sleep()
  return transactionsData
}

export const getJoinedGroups = async (): Promise<GroupType[]> => {
  const data = socialGroupsData.filter((group) => group.joined)
  await sleep()
  return data
}

export const getAllDataTableRecords = async (): Promise<Employee[]> => {
  await sleep()
  return dataTableRecords
}

export const getUserById = async (id: UserType['id']): Promise<UserType | void> => {
  const user = userData.find((user) => user.id === id)
  if (user) {
    await sleep()
    return user
  }
}
export const getPermissionsListData = async (): Promise<PermissionsListType[]> => {
  return permissionsList
}

export const getRoleListData = async (): Promise<RoleListType[]> => {
  return roleListData
}

export const getAllProjects = async (): Promise<ProjectType[]> => {
  await sleep()
  return projectsData
}

export const getProductById = async (id: ProductType['id']): Promise<ProductType | undefined> => {
  const data = productData.find((product) => product.id == id)
  await sleep()
  return data
}

export const getAllWareHouseProducts = async (): Promise<WarehouseType[]> => {
  const data = warehouseData.map((item) => {
    const user = userData.find((user) => user.id === item.userId)
    return {
      ...item,
      user,
    }
  })
  await sleep()
  return data
}

export const getAllOrders = async (): Promise<OrderType[]> => {
  const data = ordersData.map((order) => {
    const customer = userData.find((user) => user.id === order.customerId)
    const product = productData.find((product) => product.id === order.productId)
    return {
      ...order,
      customer,
      product,
    }
  })
  await sleep()
  return data
}

export const getAllReviews = async (): Promise<ReviewListType[]> => {
  const data = reviewListData.map((item, idx) => {
    const user = userData.find((user) => user.id == item.userId)
    return {
      ...item,
      user,
    }
  })
  await sleep()
  return data
}

export const getAllTasks = async (): Promise<TodoType[]> => {
  const data = todoData.map((task) => {
    const employee = userData.find((seller) => seller.id === task.employeeId)
    return {
      ...task,
      employee,
    }
  })
  await sleep()
  return data
}

export const serverSideFormValidate = async (data: unknown): Promise<unknown> => {
  const formSchema = yup.object({
    fName: yup
      .string()
      .min(3, 'First name should have at least 3 characters')
      .max(50, 'First name should not be more than 50 characters')
      .required('First name is required'),
    lName: yup
      .string()
      .min(3, 'Last name should have at least 3 characters')
      .max(50, 'Last name should not be more than 50 characters')
      .required('Last name is required'),
    username: yup
      .string()
      .min(3, 'Username should have at least 3 characters')
      .max(20, 'Username should not be more than 20 characters')
      .required('Username is required'),
    city: yup
      .string()
      .min(3, 'City should have at least 3 characters')
      .max(20, 'City should not be more than 20 characters')
      .required('City is required'),
    state: yup
      .string()
      .min(3, 'State should have at least 3 characters')
      .max(20, 'State should not be more than 20 characters')
      .required('State is required'),
    zip: yup.number().required('ZIP is required'),
  })

  try {
    const validatedObj = await formSchema.validate(data, { abortEarly: false })
    return validatedObj
  } catch (error) {
    return error
  }
}

export const getEmailsCategoryCount = async (): Promise<EmailCountType> => {
  const mailsCount: EmailCountType = { inbox: 0, starred: 0, draft: 0, sent: 0, deleted: 0, important: 0 }
  mailsCount.inbox = emailsData.filter((email) => email.toId === '101').length
  mailsCount.starred = emailsData.filter((email) => email.starred).length
  mailsCount.draft = emailsData.filter((email) => email.draft).length
  mailsCount.sent = emailsData.filter((email) => email.fromId === '101').length
  mailsCount.important = emailsData.filter((email) => email.important).length
  await sleep()
  return mailsCount
}

export const getEmailDetails = async (id: EmailType['id']): Promise<EmailType | void> => {
  const email = emailsData.find((email) => email.id === id)
  if (email) {
    email.from = userData.find((user) => user.id === email.fromId)
    email.to = userData.find((user) => user.id === email.toId)
    await sleep()
    return email
  }
}

export const getAllEmails = async (filter?: EmailFilterType): Promise<EmailType[]> => {
  const fillDataToEmails = (emails: EmailType[]) => {
    return emails.map((email) => {
      const from = userData.find((user) => user.id === email.fromId)
      const to = userData.find((user) => user.id === email.toId)
      return {
        ...email,
        from,
        to,
      }
    })
  }
  let allEmailsData
  if (filter === 'important') allEmailsData = fillDataToEmails(emailsData.filter((email) => email.important))
  else if (filter === 'deleted') allEmailsData = fillDataToEmails(emailsData.filter((email) => email.deleted))
  else if (filter === 'sent') allEmailsData = fillDataToEmails(emailsData.filter((email) => email.fromId === '101'))
  else if (filter === 'draft') allEmailsData = fillDataToEmails(emailsData.filter((email) => email.draft))
  else if (filter === 'starred') allEmailsData = fillDataToEmails(emailsData.filter((email) => email.starred))
  else allEmailsData = fillDataToEmails(emailsData.filter((email) => email.toId === '101'))

  await sleep()
  return allEmailsData
}
