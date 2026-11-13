import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import PaymentList from './components/PaymentList'

export const metadata: Metadata = { title: 'Payment List' }

const PaymentListPage = () => {
  return (
    <>
      <PageTItle title="Payment List" />
      <PaymentList />
    </>
  )
}

export default PaymentListPage
