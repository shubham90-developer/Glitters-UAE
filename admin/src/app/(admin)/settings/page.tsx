import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Settings from './components/Settings'

export const metadata: Metadata = { title: 'General Settings' }

const SettingsPage = () => {
  return (
    <>
      <PageTItle title="General Settings" />
      <Settings />
    </>
  )
}

export default SettingsPage
