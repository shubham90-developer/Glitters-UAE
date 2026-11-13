import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import VendorPolicy from './components/VendorPolicy'

export const metadata: Metadata = { title: 'Vendor Policy' }

const VendorPolicyPage = () => {
  return (
    <>
      <PageTItle title="Vendor Policy" />
      <VendorPolicy />
    </>
  )
}

export default VendorPolicyPage
