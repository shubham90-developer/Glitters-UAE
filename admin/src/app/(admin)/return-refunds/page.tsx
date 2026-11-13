import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ReturnRefunds from './components/ReturnRefunds'

export const metadata: Metadata = { title: 'Return Refunds' }

const ReturnRefundsPage = () => {
  return (
    <>
      <PageTItle title="Return Refunds" />
      <ReturnRefunds />
    </>
  )
}

export default ReturnRefundsPage
