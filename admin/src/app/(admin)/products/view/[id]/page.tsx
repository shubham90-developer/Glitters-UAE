import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ProductsDetails from '../../components/ProductsDetails'

export const metadata: Metadata = { title: 'Products  details' }

const ProductsDetailsPage = () => {
  return (
    <>
      <PageTItle title="Products Details" />
      <ProductsDetails />
    </>
  )
}

export default ProductsDetailsPage
