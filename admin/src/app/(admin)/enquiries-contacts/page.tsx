import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ContactEnquiries from './components/ContactEnquiries'

export const metadata: Metadata = { title: 'Contact Enquiries' }

const ContactEnquiriesPage = () => {
  return (
    <>
      <PageTItle title="Contact Enquiries" />
      <ContactEnquiries />
    </>
  )
}

export default ContactEnquiriesPage
