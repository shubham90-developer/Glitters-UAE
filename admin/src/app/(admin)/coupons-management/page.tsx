import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import CouponsManagement from './components/CouponsManagement'

export const metadata: Metadata = { title: 'Coupon Management' }

const CouponsManagementPage = () => {
  return (
    <>
      <PageTItle title="Coupon Management" />
      <CouponsManagement />
    </>
  )
}

export default CouponsManagementPage
