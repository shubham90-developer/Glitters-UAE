import React from 'react'
import Maintenance from './components/Maintenance'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Maintenance' }

const MaintenancePage = () => {
  return <Maintenance />
}

export default MaintenancePage
