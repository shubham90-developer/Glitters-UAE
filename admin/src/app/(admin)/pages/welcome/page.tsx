import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = { title: 'Welcome' }

const WelcomePage = () => {
  return (
    <>
      <PageTItle title="WELCOME" />
    </>
  )
}

export default WelcomePage
