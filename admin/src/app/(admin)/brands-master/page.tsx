import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import BrandsManagement from './components/BrandsManagement'

export const metadata: Metadata = { title: 'Brand Management' }

const BrandsManagementPage = () => {
  return (
    <>
      <PageTItle title="Brand Management" />
      <BrandsManagement />
    </>
  )
}

export default BrandsManagementPage
