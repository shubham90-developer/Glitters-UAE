import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import PendingOrderList from './components/PendingOrderList'

export const metadata: Metadata = { title: 'Pending Order List' }

const PendingOrderListPage = () => {
  return (
    <>
      <PageTItle title="Pending Order List" />
      <PendingOrderList />
    </>
  )
}

export default PendingOrderListPage
