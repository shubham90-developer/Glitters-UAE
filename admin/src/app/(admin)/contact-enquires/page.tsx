import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ContactEnquires from './components/ContactEnquires'

export const metadata: Metadata = { title: 'Contact Enquires' }

const ContactEnquiresPage = () => {
  return (
    <>
      <PageTItle title="Contact Enquires" />
      <ContactEnquires />
    </>
  )
}

export default ContactEnquiresPage
