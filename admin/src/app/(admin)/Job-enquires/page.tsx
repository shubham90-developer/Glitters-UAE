import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import JobEnquires from './components/JobEnquires'

export const metadata: Metadata = { title: 'Job Enquires' }

const JobEnquiresPage = () => {
  return (
    <>
      <PageTItle title="Job Enquires" />
      <JobEnquires />
    </>
  )
}

export default JobEnquiresPage
