'use client'

import { useGetSettingsQuery } from '@/store/settingApi'
import Image from 'next/image'
import Link from 'next/link'

const LogoBox = () => {
  const { data: settingsResponse, isLoading } = useGetSettingsQuery()

  const settings = Array.isArray(settingsResponse) ? settingsResponse[0] : ((settingsResponse as any)?.data ?? settingsResponse)

  const logoUrl = settings?.logo || ''

  return (
    <div className="logo-box">
      {/* DARK LOGO */}
      <Link href="/" className="logo-dark">
        {!isLoading && logoUrl && (
          <>
            <Image
              src={logoUrl}
              width={32}
              height={32}
              className="logo-sm"
              alt="Logo"
              unoptimized
              style={{
                objectFit: 'contain',
              }}
            />

            <Image
              src={logoUrl}
              width={150}
              height={50}
              className="logo-lg"
              alt="Logo"
              unoptimized
              style={{
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </Link>

      {/* LIGHT LOGO */}
      <Link href="/" className="logo-light">
        {!isLoading && logoUrl && (
          <>
            <Image
              src={logoUrl}
              width={32}
              height={32}
              className="logo-sm"
              alt="Logo"
              unoptimized
              style={{
                objectFit: 'contain',
              }}
            />

            <Image
              src={logoUrl}
              width={150}
              height={50}
              className="logo-lg"
              alt="Logo"
              unoptimized
              style={{
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </Link>
    </div>
  )
}

export default LogoBox
