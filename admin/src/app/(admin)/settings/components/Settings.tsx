'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import { toast } from 'react-toastify'

import {
  GeneralSettingsPayload,
  useCreateGeneralSettingsMutation,
  useGetAllGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
} from '@/store/generalSettingsApi'

// =====================================================
// TYPES
// =====================================================

interface SettingFormState {
  logo: File | null
  favicon: File | null
  footerImg: File | null

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

  topHeaderTitle: string

  footerInfo: string
  footerCopyrights: string

  googlePlayUrl: string
  appStoreUrl: string
}

// =====================================================
// INITIAL DATA
// =====================================================

const initialFormData: SettingFormState = {
  logo: null,
  favicon: null,
  footerImg: null,

  mobileNo: '',
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

  topHeaderTitle: '',

  footerInfo: '',
  footerCopyrights: '',

  googlePlayUrl: '',
  appStoreUrl: '',
}

const Settings = () => {
  // ===================================================
  // API
  // ===================================================

  const [createSettings, { isLoading: isCreating }] = useCreateGeneralSettingsMutation()

  const [updateSettings, { isLoading: isUpdating }] = useUpdateGeneralSettingsMutation()

  const { data: settingsData, isLoading, isError } = useGetAllGeneralSettingsQuery()

  // ===================================================
  // SETTINGS DATA
  // ===================================================

  // single settings record -> first item of the list
  const settings = settingsData?.[0]

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
      logo: null,

      favicon: null,

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

      topHeaderTitle: settings.topHeaderTitle || '',

      footerInfo: settings.footerInfo || '',

      footerCopyrights: settings.footerCopyrights || '',

      googlePlayUrl: settings.googlePlayUrl || '',

      appStoreUrl: settings.appStoreUrl || '',
    })

    setLogoPreview(settings.logo || '')

    setFaviconPreview(settings.favicon || '')

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
      // the API slice converts this object to FormData
      // (files are sent only when a new image was picked)
      const payload: GeneralSettingsPayload = {
        // FILES
        logo: formData.logo,
        favicon: formData.favicon,
        footerImg: formData.footerImg,

        // TEXT FIELDS
        mobileNo: formData.mobileNo,
        alternateMobileNo: formData.alternateMobileNo,
        mail: formData.mail,
        alternateEmail: formData.alternateEmail,
        address: formData.address,
        addressIframe: formData.addressIframe,
        workingHrs: formData.workingHrs,
        facebook: formData.facebook,
        instagram: formData.instagram,
        youtube: formData.youtube,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        whatsApp: formData.whatsApp,
        topHeaderTitle: formData.topHeaderTitle,
        footerInfo: formData.footerInfo,
        footerCopyrights: formData.footerCopyrights,
        googlePlayUrl: formData.googlePlayUrl,
        appStoreUrl: formData.appStoreUrl,
      }

      // =============================================
      // UPDATE
      // =============================================

      if (settings?._id) {
        await updateSettings({
          id: settings._id,
          body: payload,
        }).unwrap()

        toast.success('Settings updated successfully')
      } else {
        // =============================================
        // CREATE
        // =============================================
        await createSettings(payload).unwrap()

        toast.success('Settings created successfully')
      }

      // no manual refetch needed: the slice invalidates the
      // "GeneralSettings" tag so the query reloads automatically
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
                General Settings
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Row>
                {/* LOGO */}

                <Col md={6} lg={4}>
                  <div className="mb-3">
                    <label className="form-label">Logo</label>

                    <input type="file" name="logo" className="form-control" accept="image/*" onChange={handleFile} />

                    {logoPreview && (
                      <div className="mt-2">
                        <Image src={logoPreview} width={120} height={70} alt="Logo" className="rounded border object-fit-contain" unoptimized />
                      </div>
                    )}
                  </div>
                </Col>

                {/* FAVICON */}

                <Col md={6} lg={4}>
                  <div className="mb-3">
                    <label className="form-label">Favicon</label>

                    <input type="file" name="favicon" className="form-control" accept="image/*" onChange={handleFile} />

                    {faviconPreview && (
                      <div className="mt-2">
                        <Image src={faviconPreview} width={60} height={60} alt="Favicon" className="rounded border object-fit-contain" unoptimized />
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
                    <label className="form-label">Top Header Title</label>

                    <input
                      type="text"
                      name="topHeaderTitle"
                      value={formData.topHeaderTitle}
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
                {/* FOOTER INFO */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Footer Information</label>

                    <textarea name="footerInfo" rows={4} value={formData.footerInfo} onChange={handleChange} className="form-control" />
                  </div>
                </Col>

                {/* COPYRIGHT */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Footer Copyrights</label>

                    <input type="text" name="footerCopyrights" value={formData.footerCopyrights} onChange={handleChange} className="form-control" />
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

export default Settings
