import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Counter from './components/Counter'

export const metadata: Metadata = { title: 'Counter' }

const CounterPage = () => {
  return (
    <>
      <PageTItle title="Counter" />
      <Counter />
    </>
  )
}

export default CounterPage
