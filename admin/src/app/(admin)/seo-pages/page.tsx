import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Seo from './components/Seo'

export const metadata: Metadata = { title: 'SEO Pages' }

const SeoPage = () => {
  return (
    <>
      <PageTItle title="SEO Pages" />
      <Seo />
    </>
  )
}

export default SeoPage
