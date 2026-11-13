'use client'

import React, { useRef, useState } from 'react'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const ProfileMain = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }
  return (
    <Row>
      <Col xl={9} lg={8}>
        <Card className="overflow-hidden">
          <CardBody>
            <div className="bg-primary profile-bg rounded-top position-relative mx-n3 mt-n3">
              {/* Avatar */}
              <div className="position-absolute top-100 start-0 translate-middle ms-5" style={{ cursor: 'pointer' }} onClick={handleClick}>
                <Image
                  src={preview || avatar1}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="avatar-xl border border-light border-3 rounded-circle"
                />

                {/* Edit Icon */}
                <div
                  className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 28, height: 28, fontSize: 12 }}>
                  ✎
                </div>
              </div>

              {/* Hidden File Input */}
              <input type="file" ref={fileRef} accept="image/*" className="d-none" onChange={handleFileChange} />
            </div>
            <div className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <h4 className="mb-1">
                  Suraj Jamdade <IconifyIcon icon="bxs:badge-check" className="text-success align-middle" />
                </h4>
                <p className="mb-0">Project Head Manager</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={3} lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Personal Information</CardTitle>
          </CardHeader>
          <CardBody>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:letter-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Email{' '}
                  <Link href="" className="text-primary fw-semibold">
                    suraj@gmail.com
                  </Link>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:phone-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Mobile{' '}
                  <Link href="" className="text-primary fw-semibold">
                    +91 9090909090
                  </Link>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:calendar-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Joining Date{' '}
                  <Link href="" className="text-primary fw-semibold">
                    01/01/2023
                  </Link>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Change Password</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input type="password" className="form-control" placeholder="Enter Password" />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" placeholder="Enter Password" />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Enter Password" />
            </div>
            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100 mt-1">
              Submit
            </button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default ProfileMain
