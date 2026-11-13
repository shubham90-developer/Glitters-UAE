import logoDark from '@/assets/images/logo.webp'
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper'
import type { Metadata } from 'next'
import { Play } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import '@/assets/scss/app.scss'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { ReduxProviders } from '@/providers/ReduxProviders'
import ToastProvider from '@/providers/ToastProvider'

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

// one helper for favicon + splash logo (Next dedupes identical fetches in a render)
async function getSiteSettings(): Promise<{ logo?: string; favicon?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: 60 },
    })
    const json = await res.json()
    return json?.data?.[0] ?? {}
  } catch {
    return {} // backend unreachable: fall back to static assets
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { favicon: dynamicFavicon } = await getSiteSettings()
  const favicon = dynamicFavicon || '/favicon.ico'

  return {
    title: {
      template: 'Ecomm Admin',
      default: DEFAULT_PAGE_TITLE,
    },
    description: 'Ecomm Admin',
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  }
}

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { logo } = await getSiteSettings()
  const splashLogo = logo || logoDark.src

  return (
    <html lang="en">
      <head>
        <style suppressHydrationWarning>{splashScreenStyles}</style>
      </head>
      <body className={play.className}>
        <div id="splash-screen">
          {/* plain <img> so any Cloudinary URL works without next.config image domains */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Logo" src={splashLogo} style={{ height: '7%', width: 'auto' }} />
        </div>
        <NextTopLoader color="#ffd83d" showSpinner={false} />
        <div id="__next_splash">
          <ReduxProviders>
            <AppProvidersWrapper>{children}</AppProvidersWrapper>
          </ReduxProviders>
        </div>

        <ToastProvider />
      </body>
    </html>
  )
}
