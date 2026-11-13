import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import CurrentOpenings from './components/CurrentOpenings'

export const metadata: Metadata = { title: 'Current Openings' }

const CurrentOpeningsPage = () => {
  return (
    <>
      <PageTItle title="Current Openings" />
      <CurrentOpenings />
    </>
  )
}

export default CurrentOpeningsPage
