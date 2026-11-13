import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AboutUs from './components/AboutUs'

export const metadata: Metadata = { title: 'About Us' }

const AboutUsPage = () => {
  return (
    <>
      <PageTItle title="About Us" />
      <AboutUs />
    </>
  )
}

export default AboutUsPage
