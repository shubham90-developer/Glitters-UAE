import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import PrivacyPolicy from './components/PrivacyPolicy'

export const metadata: Metadata = { title: 'Privacy Policy' }

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageTItle title="Privacy Policy" />
      <PrivacyPolicy />
    </>
  )
}

export default PrivacyPolicyPage
