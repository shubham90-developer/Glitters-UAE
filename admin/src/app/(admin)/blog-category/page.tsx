import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import BlogCategories from './components/BlogCategories'

export const metadata: Metadata = { title: 'All Blog Categories' }

const BlogCategoriesPage = () => {
  return (
    <>
      <PageTItle title="All Blog Categories" />
      <BlogCategories />
    </>
  )
}

export default BlogCategoriesPage
