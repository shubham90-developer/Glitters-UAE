'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useChangeCredentialsMutation, useGetMeQuery } from '@/store/apiSlice'

interface CredentialsFormState {
  currentPassword: string
  newEmail: string
  newPassword: string
  confirmPassword: string
}

const initialFormData: CredentialsFormState = {
  currentPassword: '',
  newEmail: '',
  newPassword: '',
  confirmPassword: '',
}

const ChangeCredentialsPage = () => {
  const { data: meData, isLoading, isError } = useGetMeQuery()

  const [changeCredentials, { isLoading: isSubmitting }] = useChangeCredentialsMutation()

  const admin = meData?.data

  const currentEmail = admin?.email || ''

  const [formData, setFormData] = useState<CredentialsFormState>(initialFormData)

  useEffect(() => {
    if (!currentEmail) {
      return
    }

    setFormData((prev) => ({
      ...prev,

      newEmail: currentEmail,
    }))
  }, [currentEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newEmail = formData.newEmail.trim().toLowerCase()

    const emailChanged = !!newEmail && newEmail !== currentEmail.toLowerCase()

    const passwordChanged = !!formData.newPassword

    // ---------- VALIDATION ----------

    if (!formData.currentPassword) {
      toast.error('Please enter your current password')

      return
    }

    if (!emailChanged && !passwordChanged) {
      toast.error('Change your email or enter a new password')

      return
    }

    if (passwordChanged) {
      if (formData.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')

        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New password and confirm password do not match')

        return
      }
    }

    try {
      // only send what actually changed
      const res = await changeCredentials({
        currentPassword: formData.currentPassword,

        ...(emailChanged && { newEmail }),

        ...(passwordChanged && { newPassword: formData.newPassword }),
      }).unwrap()

      toast.success(res.message || 'Credentials updated successfully')

      // =============================================
      // NEW TOKEN
      // =============================================
      // The backend returns a fresh token (res.token). Save it the same
      // way you do after login so the admin stays signed in, e.g.:
      // dispatch(setCredentials({ token: res.token, admin: res.data }))

      // clear password fields, keep the (new) email
      setFormData((prev) => ({
        ...prev,

        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error: any) {
      console.error('Change Credentials Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading profile...</div>
      </div>
    )
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load admin profile.</div>
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <Row>
      <Col xl={12}>
        <form onSubmit={onSubmit} autoComplete="off">
          {/* =========================================
              CHANGE CREDENTIALS
          ========================================= */}

          <Card>
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Change Email & Password
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Row>
                {/* CURRENT PASSWORD */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>

                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      required
                    />

                    <small className="text-muted">Required to confirm any change.</small>
                  </div>
                </Col>

                {/* EMAIL */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>

                    <input
                      type="email"
                      name="newEmail"
                      value={formData.newEmail}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter email address"
                      autoComplete="off"
                    />
                  </div>
                </Col>

                {/* NEW PASSWORD */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>

                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Leave blank to keep current password"
                      autoComplete="new-password"
                    />
                  </div>
                </Col>

                {/* CONFIRM PASSWORD */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                </Col>

                {/* SUBMIT */}

                <Col md={12}>
                  <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      'Update Credentials'
                    )}
                  </button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </form>
      </Col>
    </Row>
  )
}

export default ChangeCredentialsPage
