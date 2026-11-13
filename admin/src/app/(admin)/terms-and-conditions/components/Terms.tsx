'use client'

import React, { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreateTermsMutation, useGetTermsQuery, useUpdateTermsMutation } from '@/store/termsApi'

// @ts-ignore
import 'react-quill-new/dist/quill.snow.css'

// Quill touches `document`, so it must only render on the client.
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

type TermsFormData = {
  badgeTitle: string
  title: string
  shortDesc: string
  content: string
}

const initialFormData: TermsFormData = {
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

const Terms = () => {
  const { data: termsResponse, isLoading, isError, error, refetch } = useGetTermsQuery()

  const [createTerms, { isLoading: creating }] = useCreateTermsMutation()
  const [updateTerms, { isLoading: updating }] = useUpdateTermsMutation()

  const [formData, setFormData] = useState<TermsFormData>(initialFormData)

  const terms = useMemo(() => normalizeResponse(termsResponse), [termsResponse])

  // A 404 just means nothing has been created yet, so the empty form should still show.
  const notFound = isError && (error as any)?.status === 404

  const isSaving = creating || updating

  useEffect(() => {
    if (!terms) return

    setFormData({
      badgeTitle: terms.badgeTitle || '',
      title: terms.title || '',
      shortDesc: terms.shortDesc || '',
      content: terms.content || '',
    })
  }, [terms])

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
    if (isQuillEmpty(formData.content)) return 'Terms & Conditions content is required'

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
      if (terms?._id) {
        await updateTerms({ _id: terms._id, ...payload }).unwrap()
        toast.success('Terms & Conditions updated successfully')
      } else {
        await createTerms(payload).unwrap()
        toast.success('Terms & Conditions created successfully')
      }

      await refetch()
    } catch (err: any) {
      console.error('Terms & Conditions error:', err)
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <div className="mt-2">Loading Terms & Conditions...</div>
      </div>
    )
  }

  if (isError && !notFound) {
    return <div className="alert alert-danger">Unable to load Terms & Conditions.</div>
  }

  const buttonLabel = isSaving ? (terms?._id ? 'Updating...' : 'Creating...') : terms?._id ? 'Update Terms & Conditions' : 'Create Terms & Conditions'

  return (
    <form onSubmit={handleSubmit}>
      <style>{`.terms-editor .ql-editor { min-height: 300px; }`}</style>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Terms & Conditions
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
                  placeholder="e.g. Legal"
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
                  placeholder="e.g. Terms & Conditions"
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
            Terms & Conditions Content
          </CardTitle>
        </CardHeader>

        <CardBody>
          <div className="mb-3 terms-editor">
            <label className="form-label">
              Content
              <span className="text-danger ms-1">*</span>
            </label>

            <ReactQuill theme="snow" value={formData.content} onChange={handleContentChange} placeholder="Enter Terms & Conditions content..." />
          </div>
        </CardBody>
      </Card>

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={isSaving}>
        {buttonLabel}
      </button>
    </form>
  )
}

export default Terms
