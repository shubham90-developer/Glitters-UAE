import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AppBanners from './components/AppBanners'

export const metadata: Metadata = { title: 'App Banners' }

const AppBannersPage = () => {
  return (
    <>
      <PageTItle title="App Banners" />
      <AppBanners />
    </>
  )
}

export default AppBannersPage
