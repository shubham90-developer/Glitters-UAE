'use client'

import React, { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreatePrivacyMutation, useGetPrivacyQuery, useUpdatePrivacyMutation } from '@/store/privacyPolicyApi'

// @ts-ignore
import 'react-quill/dist/quill.snow.css'

// =====================================================
// REACT QUILL SSR FIX
// =====================================================

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

// =====================================================
// TYPE
// =====================================================

type PrivacyFormData = {
  badgeTitle: string
  title: string
  shortDesc: string
  content: string
}

// =====================================================
// INITIAL DATA
// =====================================================

const initialFormData: PrivacyFormData = {
  badgeTitle: '',
  title: '',
  shortDesc: '',
  content: '',
}

// =====================================================
// COMPONENT
// =====================================================

const VendorPolicy = () => {
  // ===================================================
  // API
  // ===================================================

  const { data: privacyResponse, isLoading, isError, refetch } = useGetPrivacyQuery()

  const [createPrivacy, { isLoading: creating }] = useCreatePrivacyMutation()

  const [updatePrivacy, { isLoading: updating }] = useUpdatePrivacyMutation()

  // ===================================================
  // NORMALIZE RESPONSE
  // ===================================================

  const privacy = useMemo(() => {
    const response: any = privacyResponse

    if (!response) {
      return null
    }

    // { data: [...] }
    if (Array.isArray(response?.data)) {
      return response.data[0] || null
    }

    // { data: {...} }
    if (response?.data && typeof response.data === 'object') {
      return response.data
    }

    // direct array
    if (Array.isArray(response)) {
      return response[0] || null
    }

    // direct object
    return response
  }, [privacyResponse])

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<PrivacyFormData>(initialFormData)

  // ===================================================
  // LOAD EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!privacy) {
      return
    }

    setFormData({
      badgeTitle: privacy.badgeTitle || '',

      title: privacy.title || '',

      shortDesc: privacy.shortDesc || '',

      content: privacy.content || '',
    })
  }, [privacy])

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
  // CHECK QUILL EMPTY
  // ===================================================

  const isQuillEmpty = (value: string) => {
    const text = value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

    return !text
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ===============================================
    // VALIDATION
    // ===============================================

    if (!formData.badgeTitle.trim()) {
      toast.error('Badge title is required')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.shortDesc.trim()) {
      toast.error('Short description is required')
      return
    }

    if (isQuillEmpty(formData.content)) {
      toast.error('Terms & Conditions content is required')
      return
    }

    // ===============================================
    // PAYLOAD
    // ===============================================

    const payload = {
      badgeTitle: formData.badgeTitle.trim(),

      title: formData.title.trim(),

      shortDesc: formData.shortDesc.trim(),

      content: formData.content,
    }

    try {
      // =============================================
      // UPDATE
      // =============================================

      if (privacy?._id) {
        await updatePrivacy({
          _id: privacy._id,
          ...payload,
        }).unwrap()

        toast.success('Terms & Conditions updated successfully')
      }

      // =============================================
      // CREATE
      // =============================================
      else {
        await createPrivacy(payload).unwrap()

        toast.success('Terms & Conditions created successfully')
      }

      await refetch()
    } catch (error: any) {
      console.error('Terms & Conditions Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />

        <div className="mt-2">Loading Terms & Conditions...</div>
      </div>
    )
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load Terms & Conditions.</div>
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <form onSubmit={handleSubmit}>
      {/* =============================================
          BASIC INFORMATION
      ============================================= */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Terms & Conditions
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            {/* BADGE TITLE */}

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">
                  Badge Title
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="badgeTitle"
                  value={formData.badgeTitle}
                  onChange={handleChange}
                  placeholder="e.g. Privacy & Security"
                />
              </div>
            </Col>

            {/* TITLE */}

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">
                  Title
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Terms & Conditions"
                />
              </div>
            </Col>

            {/* SHORT DESCRIPTION */}

            <Col md={12}>
              <div className="mb-3">
                <label className="form-label">
                  Short Description
                  <span className="text-danger ms-1">*</span>
                </label>

                <textarea
                  rows={4}
                  className="form-control"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  placeholder="Enter short description..."
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* =============================================
          CONTENT
      ============================================= */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Terms & Conditions Content
          </CardTitle>
        </CardHeader>

        <CardBody>
          <div className="mb-3">
            <label className="form-label">
              Content
              <span className="text-danger ms-1">*</span>
            </label>

            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  content: value,
                }))
              }
              placeholder="Enter Terms & Conditions content..."
              style={{
                minHeight: '350px',
                marginBottom: '45px',
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* =============================================
          SAVE
      ============================================= */}

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={creating || updating}>
        {creating || updating
          ? privacy?._id
            ? 'Updating...'
            : 'Creating...'
          : privacy?._id
            ? 'Update Terms & Conditions'
            : 'Create Terms & Conditions'}
      </button>
    </form>
  )
}

export default VendorPolicy
