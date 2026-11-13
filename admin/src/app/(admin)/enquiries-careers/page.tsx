import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import CareersEnquiries from './components/CareersEnquiries'

export const metadata: Metadata = { title: 'Careers Enquiries' }

const CareersEnquiriesPage = () => {
  return (
    <>
      <PageTItle title="Careers Enquiries" />
      <CareersEnquiries />
    </>
  )
}

export default CareersEnquiriesPage
