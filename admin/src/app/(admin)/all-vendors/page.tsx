import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AllVendors from './components/AllVendors'

export const metadata: Metadata = { title: 'All Vendors' }

const AllVendorsPage = () => {
  return (
    <>
      <PageTItle title="All Vendors" />
      <AllVendors />
    </>
  )
}

export default AllVendorsPage
