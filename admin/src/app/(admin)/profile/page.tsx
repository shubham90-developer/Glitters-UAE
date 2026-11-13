import React from 'react'
import ProfileMain from './components/ProfileMain'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile' }

const ProfilePage = () => {
  return (
    <>
      <PageTItle title="PROFILE" />
      <ProfileMain />
    </>
  )
}

export default ProfilePage
