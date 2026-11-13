import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MaterialManagement from './components/MaterialManagement'

export const metadata: Metadata = { title: 'Material Management' }

const MaterialManagementPage = () => {
  return (
    <>
      <PageTItle title="Material Management" />
      <MaterialManagement />
    </>
  )
}

export default MaterialManagementPage
