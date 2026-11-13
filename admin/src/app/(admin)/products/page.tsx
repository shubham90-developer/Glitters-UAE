import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Products from './components/Products'

export const metadata: Metadata = { title: 'Products' }

const ProductsPage = () => {
  return (
    <>
      <PageTItle title="Products" />
      <Products />
    </>
  )
}

export default ProductsPage
