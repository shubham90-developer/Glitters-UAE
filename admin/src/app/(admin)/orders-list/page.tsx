import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import OrderList from './components/OrderList'

export const metadata: Metadata = { title: 'Order List' }

const OrderListPage = () => {
  return (
    <>
      <PageTItle title="Order List" />
      <OrderList />
    </>
  )
}

export default OrderListPage
