import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ProductsEdit from '../../components/ProductsEdit'

export const metadata: Metadata = { title: 'Products  Edit' }

const ProductsEditPage = () => {
  return (
    <>
      <PageTItle title="Products Edit" />
      <ProductsEdit />
    </>
  )
}

export default ProductsEditPage
