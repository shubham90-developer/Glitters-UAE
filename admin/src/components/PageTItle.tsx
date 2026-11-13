'use client'
import { useTitle } from '@/context/useTitleContext'
import { useEffect } from 'react'

const PageTItle = ({ title }: { title: string }) => {
  const { setTitle } = useTitle()

  useEffect(() => {
    setTitle(title)
  }, [setTitle])
  return <></>
}

export default PageTItle
