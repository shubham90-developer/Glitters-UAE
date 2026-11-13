'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthProtectionWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')

    // protected routes
    if (!token && pathname !== '/auth/sign-in') {
      router.replace('/auth/sign-in')
    }

    // already login
    if (token && pathname === '/auth/sign-in') {
      router.replace('/dashboard')
    }
  }, [pathname, router])

  return <>{children}</>
}

export default AuthProtectionWrapper
