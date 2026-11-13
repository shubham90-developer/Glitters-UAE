import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Faq from './components/Faq'

export const metadata: Metadata = { title: 'Faq' }

const FaqPage = () => {
  return (
    <>
      <PageTItle title="Faq" />
      <Faq />
    </>
  )
}

export default FaqPage
