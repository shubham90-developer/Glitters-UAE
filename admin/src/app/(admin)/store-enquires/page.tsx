import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import StoreEnquiries from './components/StoreEnquiries'

export const metadata: Metadata = { title: 'Store Enquiries' }

const StoreEnquiriesPage = () => {
  return (
    <>
      <PageTItle title="Store Enquiries" />
      <StoreEnquiries />
    </>
  )
}

export default StoreEnquiriesPage
