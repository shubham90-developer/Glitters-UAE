import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AllPackages from './components/AllPackages'

export const metadata: Metadata = { title: 'All Packages' }

const AllPackagesPage = () => {
  return (
    <>
      <PageTItle title="All Packages" />
      <AllPackages />
    </>
  )
}

export default AllPackagesPage
