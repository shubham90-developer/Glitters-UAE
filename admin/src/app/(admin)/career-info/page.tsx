import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Careerinfo from './components/Careerinfo'

export const metadata: Metadata = { title: 'Career Info' }

const CareerinfoPage = () => {
  return (
    <>
      <PageTItle title="Career Info" />
      <Careerinfo />
    </>
  )
}

export default CareerinfoPage
