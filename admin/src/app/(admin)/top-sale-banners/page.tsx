import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import TopSaleBanner from './components/TopSaleBanner'

export const metadata: Metadata = { title: 'Top Sale Banner' }

const TopSaleBannerPage = () => {
  return (
    <>
      <PageTItle title="Top Sale Banner" />
      <TopSaleBanner />
    </>
  )
}

export default TopSaleBannerPage
