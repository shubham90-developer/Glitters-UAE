import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ReturnRequest from './components/ReturnRequest'

export const metadata: Metadata = { title: 'All Return Request' }

const ReturnRequestPage = () => {
  return (
    <>
      <PageTItle title="All Return Request" />
      <ReturnRequest />
    </>
  )
}

export default ReturnRequestPage
