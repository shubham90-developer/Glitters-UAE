import FallbackLoading from '@/components/FallbackLoading'
import Footer from '@/components/layout/Footer'
import AuthProtectionWrapper from '@/components/wrappers/AuthProtectionWrapper'
import { ChildrenType } from '@/types/component-props'
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'

const VerticalNavigationBar = dynamic(() => import('@/components/layout/VerticalNavigationBar/page'))
const TopNavigationBar = dynamic(() => import('@/components/layout/TopNavigationBar/page'))

const AdminLayout = ({ children }: ChildrenType) => {
  return (
    <AuthProtectionWrapper>
      <div className="wrapper">
        <Suspense>
          <TopNavigationBar />
        </Suspense>

        <Suspense fallback={<FallbackLoading />}>
          <VerticalNavigationBar />
        </Suspense>

        <div className="page-content">
          <div className="container-fluid">{children}</div>
          <Footer />
        </div>
      </div>
    </AuthProtectionWrapper>
  )
}

export default AdminLayout
