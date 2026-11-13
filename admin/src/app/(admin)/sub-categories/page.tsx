import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SubCategories from './components/SubCategories'

export const metadata: Metadata = { title: 'Sub Categories' }

const SubCategoriesPage = () => {
  return (
    <>
      <PageTItle title="Sub Categories" />
      <SubCategories />
    </>
  )
}

export default SubCategoriesPage
