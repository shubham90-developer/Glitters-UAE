import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SizeManagement from './components/SizeManagement'

export const metadata: Metadata = { title: 'Size Management' }

const SizeManagementPage = () => {
  return (
    <>
      <PageTItle title="Size Management" />
      <SizeManagement />
    </>
  )
}

export default SizeManagementPage
