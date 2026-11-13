import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Terms from './components/Terms'

export const metadata: Metadata = { title: 'Terms And Conditions' }

const TermsPage = () => {
  return (
    <>
      <PageTItle title="Terms And Conditions" />
      <Terms />
    </>
  )
}

export default TermsPage
