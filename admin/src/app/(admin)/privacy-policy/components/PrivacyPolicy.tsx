'use client'

import React, { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreatePrivacyMutation, useGetPrivacyQuery, useUpdatePrivacyMutation } from '@/store/privacyPolicyApi'

// @ts-ignore
import 'react-quill-new/dist/quill.snow.css'

// Quill touches `document`, so it must only render on the client.
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

type PrivacyFormData = {
  badgeTitle: string
  title: string
  shortDesc: string
  content: string
}

const initialFormData: PrivacyFormData = {
  badgeTitle: '',
  title: '',
  shortDesc: '',
  content: '',
}

// Accepts { data: [...] }, { data: {...} }, [...] or {...} and returns one document (or null).
const normalizeResponse = (response: any) => {
  if (!response) return null

  const payload = response.data ?? response

  return Array.isArray(payload) ? (payload[0] ?? null) : payload
}

// Quill reports "<p><br></p>" for an empty editor, so strip tags before checking.
// Content that only contains media (image, video, iframe) still counts as filled.
const isQuillEmpty = (value: string) => {
  if (/<(img|iframe|video)/i.test(value)) return false

  const text = value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  return !text
}

const PrivacyPolicy = () => {
  const { data: privacyResponse, isLoading, isError, error, refetch } = useGetPrivacyQuery()

  const [createPrivacy, { isLoading: creating }] = useCreatePrivacyMutation()
  const [updatePrivacy, { isLoading: updating }] = useUpdatePrivacyMutation()

  const [formData, setFormData] = useState<PrivacyFormData>(initialFormData)

  const privacy = useMemo(() => normalizeResponse(privacyResponse), [privacyResponse])

  // A 404 just means nothing has been created yet, so the empty form should still show.
  const notFound = isError && (error as any)?.status === 404

  const isSaving = creating || updating

  useEffect(() => {
    if (!privacy) return

    setFormData({
      badgeTitle: privacy.badgeTitle || '',
      title: privacy.title || '',
      shortDesc: privacy.shortDesc || '',
      content: privacy.content || '',
    })
  }, [privacy])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }))
  }

  const validate = () => {
    if (!formData.badgeTitle.trim()) return 'Badge title is required'
    if (!formData.title.trim()) return 'Title is required'
    if (!formData.shortDesc.trim()) return 'Short description is required'
    if (isQuillEmpty(formData.content)) return 'Privacy Policy content is required'

    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationError = validate()

    if (validationError) {
      toast.error(validationError)
      return
    }

    const payload = {
      badgeTitle: formData.badgeTitle.trim(),
      title: formData.title.trim(),
      shortDesc: formData.shortDesc.trim(),
      content: formData.content,
    }

    try {
      if (privacy?._id) {
        await updatePrivacy({ _id: privacy._id, ...payload }).unwrap()
        toast.success('Privacy Policy updated successfully')
      } else {
        await createPrivacy(payload).unwrap()
        toast.success('Privacy Policy created successfully')
      }

      await refetch()
    } catch (err: any) {
      console.error('Privacy Policy error:', err)
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <div className="mt-2">Loading Privacy Policy...</div>
      </div>
    )
  }

  if (isError && !notFound) {
    return <div className="alert alert-danger">Unable to load Privacy Policy.</div>
  }

  const buttonLabel = isSaving ? (privacy?._id ? 'Updating...' : 'Creating...') : privacy?._id ? 'Update Privacy Policy' : 'Create Privacy Policy'

  return (
    <form onSubmit={handleSubmit}>
      <style>{`.privacy-editor .ql-editor { min-height: 300px; }`}</style>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Privacy Policy
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="badgeTitle" className="form-label">
                  Badge Title
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  id="badgeTitle"
                  type="text"
                  className="form-control"
                  name="badgeTitle"
                  value={formData.badgeTitle}
                  onChange={handleChange}
                  placeholder="e.g. Privacy & Security"
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Privacy Policy"
                />
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label htmlFor="shortDesc" className="form-label">
                  Short Description
                  <span className="text-danger ms-1">*</span>
                </label>

                <textarea
                  id="shortDesc"
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

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Privacy Policy Content
          </CardTitle>
        </CardHeader>

        <CardBody>
          <div className="mb-3 privacy-editor">
            <label className="form-label">
              Content
              <span className="text-danger ms-1">*</span>
            </label>

            <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} placeholder="Enter Privacy Policy content..." />
          </div>
        </CardBody>
      </Card>

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={isSaving}>
        {buttonLabel}
      </button>
    </form>
  )
}

export default PrivacyPolicy
