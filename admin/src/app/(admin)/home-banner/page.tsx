import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import HomeBanner from './components/HomeBanner'

export const metadata: Metadata = { title: 'Home Banner' }

const HomeBannerPage = () => {
  return (
    <>
      <PageTItle title="Home Banner" />
      <HomeBanner />
    </>
  )
}

export default HomeBannerPage
