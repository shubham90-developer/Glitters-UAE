import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Categories from './components/Categories'

export const metadata: Metadata = { title: 'All Categories' }

const CategoriesPage = () => {
  return (
    <>
      <PageTItle title="All Categories" />
      <Categories />
    </>
  )
}

export default CategoriesPage
