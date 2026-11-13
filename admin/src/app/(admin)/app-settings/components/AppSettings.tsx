'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import { toast } from 'react-toastify'

import { useCreateSettingMutation, useGetSettingsQuery, useUpdateSettingMutation } from '@/store/settingApi'
import { useCreateAppSettingsMutation, useGetAppSettingsQuery, useUpdateAppSettingsMutation } from '@/store/appSettingsApi'

// =====================================================
// TYPES
// =====================================================

interface SettingFormState {
  applogo: File | null

  footerImg: File | null

  appName: string
  footerName: string
  mobileNo: string
  alternateMobileNo: string

  mail: string
  alternateEmail: string

  address: string
  addressIframe: string
  workingHrs: string

  facebook: string
  instagram: string
  youtube: string
  linkedin: string
  twitter: string
  whatsApp: string

  googlePlayUrl: string
  appStoreUrl: string
}

// =====================================================
// INITIAL DATA
// =====================================================

const initialFormData: SettingFormState = {
  applogo: null,
  footerImg: null,

  appName: '',
  mobileNo: '',
  footerName: '',
  alternateMobileNo: '',

  mail: '',
  alternateEmail: '',

  address: '',
  addressIframe: '',
  workingHrs: '',

  facebook: '',
  instagram: '',
  youtube: '',
  linkedin: '',
  twitter: '',
  whatsApp: '',

  googlePlayUrl: '',
  appStoreUrl: '',
}

const AppSettings = () => {
  // ===================================================
  // API
  // ===================================================

  const [createSettings, { isLoading: isCreating }] = useCreateAppSettingsMutation()

  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation()

  const { data: settingsData, isLoading, isError, refetch } = useGetAppSettingsQuery()

  // ===================================================
  // SETTINGS DATA
  // ===================================================

  const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<SettingFormState>(initialFormData)

  // ===================================================
  // PREVIEWS
  // ===================================================

  const [logoPreview, setLogoPreview] = useState('')

  const [faviconPreview, setFaviconPreview] = useState('')

  const [footerImgPreview, setFooterImgPreview] = useState('')

  // ===================================================
  // SET EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!settings) {
      return
    }

    setFormData({
      applogo: null,

      footerName: settings.footerName || '',

      appName: settings.appName || '',

      footerImg: null,

      mobileNo: settings.mobileNo || '',

      alternateMobileNo: settings.alternateMobileNo || '',

      mail: settings.mail || '',

      alternateEmail: settings.alternateEmail || '',

      address: settings.address || '',

      addressIframe: settings.addressIframe || '',

      workingHrs: settings.workingHrs || '',

      facebook: settings.facebook || '',

      instagram: settings.instagram || '',

      youtube: settings.youtube || '',

      linkedin: settings.linkedin || '',

      twitter: settings.twitter || '',

      whatsApp: settings.whatsApp || '',

      googlePlayUrl: settings.googlePlayUrl || '',

      appStoreUrl: settings.appStoreUrl || '',
    })

    setLogoPreview(settings.applogo || '')

    setFooterImgPreview(settings.footerImg || '')
  }, [settings])

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }))
  }

  // ===================================================
  // FILE CHANGE
  // ===================================================

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target

    const file = files?.[0] || null

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image')

      return
    }

    setFormData((prev) => ({
      ...prev,

      [name]: file,
    }))

    const preview = URL.createObjectURL(file)

    if (name === 'logo') {
      setLogoPreview(preview)
    }

    if (name === 'favicon') {
      setFaviconPreview(preview)
    }

    if (name === 'footerImg') {
      setFooterImgPreview(preview)
    }
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = new FormData()

      // FILES

      if (formData.applogo) {
        payload.append('applogo', formData.applogo)
      }

      if (formData.footerImg) {
        payload.append('footerImg', formData.footerImg)
      }

      // TEXT FIELDS

      payload.append('mobileNo', formData.mobileNo)

      payload.append('alternateMobileNo', formData.alternateMobileNo)

      payload.append('mail', formData.mail)

      payload.append('alternateEmail', formData.alternateEmail)

      payload.append('address', formData.address)

      payload.append('addressIframe', formData.addressIframe)

      payload.append('workingHrs', formData.workingHrs)

      payload.append('facebook', formData.facebook)

      payload.append('instagram', formData.instagram)

      payload.append('youtube', formData.youtube)

      payload.append('linkedin', formData.linkedin)

      payload.append('twitter', formData.twitter)

      payload.append('whatsApp', formData.whatsApp)

      payload.append('googlePlayUrl', formData.googlePlayUrl)

      payload.append('appStoreUrl', formData.appStoreUrl)

      // =============================================
      // UPDATE
      // =============================================

      if (settings?._id) {
        await updateSettings({
          id: settings._id,
          formData: payload,
        }).unwrap()

        toast.success('Settings updated successfully')
      } else {
        // =============================================
        // CREATE
        // =============================================
        // @ts-ignore
        await createSettings(payload).unwrap()

        toast.success('Settings created successfully')
      }

      await refetch()
    } catch (error: any) {
      console.error('Settings Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const isSubmitting = isCreating || isUpdating

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading settings...</div>
      </div>
    )
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load settings.</div>
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <Row>
      <Col xl={12}>
        <form onSubmit={onSubmit}>
          {/* =========================================
              GENERAL SETTINGS
          ========================================= */}

          <Card>
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                App Settings
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Row>
                {/* LOGO */}

                <Col md={6} lg={4}>
                  <div className="mb-3">
                    <label className="form-label">App Logo</label>

                    <input type="file" name="applogo" className="form-control" accept="image/*" onChange={handleFile} />

                    {logoPreview && (
                      <div className="mt-2">
                        <Image src={logoPreview} width={120} height={70} alt="Logo" className="rounded border object-fit-contain" unoptimized />
                      </div>
                    )}
                  </div>
                </Col>

                {/* FOOTER IMAGE */}

                <Col md={6} lg={4}>
                  <div className="mb-3">
                    <label className="form-label">Footer Image</label>

                    <input type="file" name="footerImg" className="form-control" accept="image/*" onChange={handleFile} />

                    {footerImgPreview && (
                      <div className="mt-2">
                        <Image
                          src={footerImgPreview}
                          width={120}
                          height={70}
                          alt="Footer"
                          className="rounded border object-fit-contain"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </Col>

                {/* TOP HEADER */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">App Name</label>

                    <input
                      type="text"
                      name="appName"
                      value={formData.appName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter top header title"
                    />
                  </div>
                </Col>

                {/* MOBILE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Mobile No.</label>

                    <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* ALTERNATE MOBILE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Alternate Mobile No.</label>

                    <input type="text" name="alternateMobileNo" value={formData.alternateMobileNo} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* EMAIL */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>

                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* ALTERNATE EMAIL */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Alternate Email</label>

                    <input type="email" name="alternateEmail" value={formData.alternateEmail} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* ADDRESS */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Address</label>

                    <textarea name="address" rows={3} value={formData.address} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* MAP IFRAME */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Address Iframe</label>

                    <textarea
                      name="addressIframe"
                      rows={4}
                      value={formData.addressIframe}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="<iframe ...></iframe>"
                    />
                  </div>
                </Col>

                {/* WORKING HOURS */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Working Hours</label>

                    <input type="text" name="workingHrs" value={formData.workingHrs} onChange={handleChange} className="form-control" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* =========================================
              SOCIAL MEDIA
          ========================================= */}

          <Card>
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Social Media
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Facebook</label>

                    <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Instagram</label>

                    <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">YouTube</label>

                    <input type="url" name="youtube" value={formData.youtube} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">LinkedIn</label>

                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Twitter / X</label>

                    <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">WhatsApp</label>

                    <input type="url" name="whatsApp" value={formData.whatsApp} onChange={handleChange} className="form-control" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* =========================================
              FOOTER / APP SETTINGS
          ========================================= */}

          <Card>
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Footer & App Settings
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Row>
                {/* COPYRIGHT */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">footer Name</label>

                    <input type="text" name="footerName" value={formData.footerName} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* GOOGLE PLAY */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Google Play URL</label>

                    <input type="url" name="googlePlayUrl" value={formData.googlePlayUrl} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* APP STORE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">App Store URL</label>

                    <input type="url" name="appStoreUrl" value={formData.appStoreUrl} onChange={handleChange} className="form-control" />
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
                    ) : settings?._id ? (
                      'Update Settings'
                    ) : (
                      'Create Settings'
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

export default AppSettings
