import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ColorManagement from './components/ColorManagement'

export const metadata: Metadata = { title: 'Color Management' }

const ColorManagementPage = () => {
  return (
    <>
      <PageTItle title="Color Management" />
      <ColorManagement />
    </>
  )
}

export default ColorManagementPage
