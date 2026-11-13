import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Blogs from './components/Blogs'

export const metadata: Metadata = { title: 'Blogs' }

const BlogsPage = () => {
  return (
    <>
      <PageTItle title="Blogs" />
      <Blogs />
    </>
  )
}

export default BlogsPage
