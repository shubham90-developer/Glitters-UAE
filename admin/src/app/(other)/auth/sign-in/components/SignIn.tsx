'use client'

import fallbackLogo from '@/assets/images/logo.webp'
import authImg from '@/assets/images/auth.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import LoginFrom from './LoginFrom'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useGetAllGeneralSettingsQuery } from '@/store/generalSettingsApi'

const SignIn = () => {
  const { data: settings, isLoading } = useGetAllGeneralSettingsQuery()
  const logoSrc = settings?.[0]?.logo || fallbackLogo.src

  return (
    <div className="vh-100 overflow-hidden">
      <Row className="h-100 g-0">
        {/* LEFT SIDE (FORM) */}
        <Col lg={5} className="d-flex align-items-center justify-content-center bg-white p-4">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            {/* LOGO */}
            <div className="mb-4 text-center" style={{ height: 80 }}>
              {!isLoading && (
                // plain <img> so any Cloudinary URL works without next.config image domains
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} height={80} alt="logo" style={{ height: 80, width: 'auto' }} />
              )}
            </div>

            {/* TITLE */}
            <h3 className="fw-bold text-center">Welcome Back 👋</h3>
            <p className="text-muted text-center mb-4">Sign in to continue to your dashboard</p>

            {/* FORM */}
            <LoginFrom />

            {/* DIVIDER */}
            {/* <div className="text-center my-3 position-relative">
              <span className="bg-white px-2 text-muted">OR</span>
              <hr className="mt-n3" />
            </div> */}

            {/* GOOGLE LOGIN */}
            {/* <div className="d-grid">
              <Link href="#" className="btn btn-light border">
                <IconifyIcon icon="mdi:google" className="me-2" />
                Sign in with Google
              </Link>
            </div> */}
          </div>
        </Col>

        {/* RIGHT SIDE (IMAGE) */}
        <Col lg={7} className="d-none d-lg-block position-relative">
          <Image src="/image.png" alt="auth" fill className="object-fit-fill" />

          {/* OVERLAY */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6))',
            }}
          />

          {/* TEXT */}
          <div className="position-absolute bottom-0 p-5 text-white">
            <h2 className="fw-bold text-white">Manage Your Tasks Efficiently 🚀</h2>
            <p className="mb-0">Track progress, manage teams, and boost productivity.</p>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SignIn
