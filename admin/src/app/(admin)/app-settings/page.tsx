import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AppSettings from './components/AppSettings'

export const metadata: Metadata = { title: 'App Settings' }

const AppSettingsPage = () => {
  return (
    <>
      <PageTItle title="App Settings" />
      <AppSettings />
    </>
  )
}

export default AppSettingsPage
