'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import dynamic from 'next/dynamic'

import { toast } from 'react-toastify'

// @ts-ignore
import 'react-quill/dist/quill.snow.css'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateBlogMutation } from '@/store/blogApi'

import { useGetBlogCategoryQuery } from '@/store/blogCategoryApi'

// =====================================================
// REACT QUILL
// =====================================================

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

// =====================================================
// TYPES
// =====================================================

interface FormState {
  category: string

  title: string
  shortDesc: string

  author: string

  featured: boolean

  image: File | null

  description: string

  QuickTips: string

  blackQuote: string

  tags: string

  writtenBy: string

  writtenByImage: File | null

  writtenByDesc: string

  metaTitle: string
  metaDesc: string
  metaTags: string
}

// =====================================================
// INITIAL FORM
// =====================================================

const initialFormData: FormState = {
  category: '',

  title: '',
  shortDesc: '',

  author: '',

  featured: false,

  image: null,

  description: '',

  QuickTips: '',

  blackQuote: '',

  tags: '',

  writtenBy: '',

  writtenByImage: null,

  writtenByDesc: '',

  metaTitle: '',
  metaDesc: '',
  metaTags: '',
}

// =====================================================
// COMPONENT
// =====================================================

const AddBlogDrawer = () => {
  // ===================================================
  // DRAWER
  // ===================================================

  const [open, setOpen] = useState(false)

  // ===================================================
  // API
  // ===================================================

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()

  const { data: categoryResponse, isLoading: isCategoryLoading } = useGetBlogCategoryQuery()

  // ===================================================
  // NORMALIZE CATEGORIES
  // ===================================================

  const categories = useMemo(() => {
    const response: any = categoryResponse

    if (!response) {
      return []
    }

    if (Array.isArray(response)) {
      return response
    }

    if (Array.isArray(response?.data)) {
      return response.data
    }

    if (response?.data) {
      return [response.data]
    }

    return []
  }, [categoryResponse])

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<FormState>(initialFormData)

  // ===================================================
  // IMAGE PREVIEWS
  // ===================================================

  const [imagePreview, setImagePreview] = useState('')

  const [writtenByImagePreview, setWrittenByImagePreview] = useState('')

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }))
  }

  // ===================================================
  // FEATURED
  // ===================================================

  const handleFeaturedToggle = () => {
    setFormData((prev) => ({
      ...prev,

      featured: !prev.featured,
    }))
  }

  // ===================================================
  // MAIN IMAGE
  // ===================================================

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select JPG, PNG or WEBP image')

      e.target.value = ''

      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')

      e.target.value = ''

      return
    }

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }))

    setImagePreview(URL.createObjectURL(file))
  }

  // ===================================================
  // WRITTEN BY IMAGE
  // ===================================================

  const handleWrittenByImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select JPG, PNG or WEBP image')

      e.target.value = ''

      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')

      e.target.value = ''

      return
    }

    if (writtenByImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(writtenByImagePreview)
    }

    setFormData((prev) => ({
      ...prev,

      writtenByImage: file,
    }))

    setWrittenByImagePreview(URL.createObjectURL(file))
  }

  // ===================================================
  // QUILL EMPTY CHECK
  // ===================================================

  const isQuillEmpty = (value: string) => {
    return !value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
  }

  // ===================================================
  // RESET
  // ===================================================

  const resetForm = () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    if (writtenByImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(writtenByImagePreview)
    }

    setFormData(initialFormData)

    setImagePreview('')

    setWrittenByImagePreview('')
  }

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (isCreating) {
      return
    }

    setOpen(false)

    resetForm()
  }

  // ===================================================
  // CLEANUP OBJECT URL
  // ===================================================

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }

      if (writtenByImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(writtenByImagePreview)
      }
    }
  }, [imagePreview, writtenByImagePreview])

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ===============================================
    // VALIDATION
    // ===============================================

    if (!formData.category) {
      toast.error('Blog category is required')

      return
    }

    if (!formData.title.trim()) {
      toast.error('Blog title is required')

      return
    }

    if (!formData.shortDesc.trim()) {
      toast.error('Short description is required')

      return
    }

    if (!formData.author.trim()) {
      toast.error('Author is required')

      return
    }

    if (!formData.image) {
      toast.error('Blog image is required')

      return
    }

    if (isQuillEmpty(formData.description)) {
      toast.error('Description is required')

      return
    }

    try {
      // =============================================
      // FORM DATA
      // =============================================

      const payload = new FormData()

      payload.append('category', formData.category)

      payload.append('title', formData.title.trim())

      payload.append('shortDesc', formData.shortDesc.trim())

      payload.append('author', formData.author.trim())

      payload.append('featured', String(formData.featured))

      payload.append('description', formData.description)

      payload.append('QuickTips', formData.QuickTips)

      payload.append('blackQuote', formData.blackQuote)

      payload.append('tags', formData.tags.trim())

      payload.append('writtenBy', formData.writtenBy.trim())

      payload.append('writtenByDesc', formData.writtenByDesc)

      payload.append('metaTitle', formData.metaTitle.trim())

      payload.append('metaDesc', formData.metaDesc.trim())

      payload.append('metaTags', formData.metaTags.trim())

      // MAIN IMAGE

      if (formData.image) {
        payload.append('image', formData.image)
      }

      // WRITTEN BY IMAGE

      if (formData.writtenByImage) {
        payload.append('writtenByImage', formData.writtenByImage)
      }

      // =============================================
      // CREATE
      // =============================================

      await createBlog(payload).unwrap()

      toast.success('Blog created successfully')

      setOpen(false)

      resetForm()
    } catch (error: any) {
      console.error('Create Blog Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      {/* ==============================================
          OPEN BUTTON
      ============================================== */}

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Blog
      </button>

      {/* ==============================================
          OVERLAY
      ============================================== */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',

            zIndex: 1040,
          }}
          onClick={handleClose}
        />
      )}

      {/* ==============================================
          DRAWER
      ============================================== */}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '900px',

          maxWidth: '100%',

          zIndex: 1050,

          transform: open ? 'translateX(0)' : 'translateX(100%)',

          transition: 'transform 0.3s ease',

          overflowY: 'auto',
        }}>
        {/* ============================================
            HEADER
        ============================================ */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Add Blog</h5>

            <small className="text-muted">Add complete blog information.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            disabled={isCreating}
            onClick={handleClose}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* ============================================
            FORM
        ============================================ */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            {/* ==========================================
                BASIC INFORMATION
            ========================================== */}

            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Basic Information</h5>

              <Row>
                {/* CATEGORY */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">
                      Category
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isCategoryLoading || isCreating}>
                      <option value="">Select Category</option>

                      {categories.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </select>
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
                      placeholder="Enter blog title"
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* AUTHOR */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">
                      Author
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* FEATURED */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label d-block">Featured Blog</label>

                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">Featured</div>

                          <small className="text-muted">Show this blog as featured.</small>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          <div className="form-check form-switch mb-0">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={formData.featured}
                              onChange={handleFeaturedToggle}
                              disabled={isCreating}
                              style={{
                                width: '46px',

                                height: '24px',
                              }}
                            />
                          </div>

                          <span className={`badge ${formData.featured ? 'bg-success' : 'bg-secondary'}`}>{formData.featured ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* SHORT DESC */}

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
                      placeholder="Enter short description"
                      disabled={isCreating}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* ==========================================
                FEATURED IMAGE
            ========================================== */}

            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Blog Image</h5>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">
                      Blog Image
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImage}
                      disabled={isCreating}
                    />

                    {imagePreview && (
                      <div className="mt-3">
                        <Image
                          src={imagePreview}
                          alt="Blog Preview"
                          width={220}
                          height={150}
                          unoptimized
                          style={{
                            width: '220px',

                            height: '150px',

                            objectFit: 'cover',

                            borderRadius: '8px',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

            {/* ==========================================
                BLOG CONTENT
            ========================================== */}

            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Blog Content</h5>

              <Row>
                {/* DESCRIPTION */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">
                      Description
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,

                          description: value,
                        }))
                      }
                      placeholder="Enter blog description..."
                      style={{
                        marginBottom: '50px',

                        height: '220px',
                      }}
                    />
                  </div>
                </Col>

                {/* QUICK TIPS */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Quick Tips</label>

                    <ReactQuill
                      theme="snow"
                      value={formData.QuickTips}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,

                          QuickTips: value,
                        }))
                      }
                      placeholder="Enter quick tips..."
                      style={{
                        marginBottom: '50px',

                        height: '160px',
                      }}
                    />
                  </div>
                </Col>

                {/* BLACK QUOTE */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Block Quote</label>

                    <textarea
                      rows={4}
                      className="form-control"
                      name="blackQuote"
                      value={formData.blackQuote}
                      onChange={handleChange}
                      placeholder="Enter quote..."
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* TAGS */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Tags</label>

                    <input
                      type="text"
                      className="form-control"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="example: ecommerce, shopping, fashion"
                      disabled={isCreating}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* ==========================================
                WRITTEN BY
            ========================================== */}

            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Written By</h5>

              <Row>
                {/* NAME */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Written By</label>

                    <input
                      type="text"
                      className="form-control"
                      name="writtenBy"
                      value={formData.writtenBy}
                      onChange={handleChange}
                      placeholder="Enter writer name"
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* IMAGE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Writer Image</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleWrittenByImage}
                      disabled={isCreating}
                    />

                    {writtenByImagePreview && (
                      <div className="mt-3">
                        <Image
                          src={writtenByImagePreview}
                          alt="Writer Preview"
                          width={100}
                          height={100}
                          unoptimized
                          style={{
                            width: '100px',

                            height: '100px',

                            objectFit: 'cover',

                            borderRadius: '50%',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>

                {/* DESC */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Writer Description</label>

                    <textarea
                      rows={4}
                      className="form-control"
                      name="writtenByDesc"
                      value={formData.writtenByDesc}
                      onChange={handleChange}
                      placeholder="Enter writer description"
                      disabled={isCreating}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* ==========================================
                SEO
            ========================================== */}

            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">SEO Settings</h5>

              <Row>
                {/* META TITLE */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Meta Title</label>

                    <input
                      type="text"
                      className="form-control"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="Enter meta title"
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* META DESC */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Meta Description</label>

                    <textarea
                      rows={3}
                      className="form-control"
                      name="metaDesc"
                      value={formData.metaDesc}
                      onChange={handleChange}
                      placeholder="Enter meta description"
                      disabled={isCreating}
                    />
                  </div>
                </Col>

                {/* META TAGS */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Meta Tags</label>

                    <input
                      type="text"
                      className="form-control"
                      name="metaTags"
                      value={formData.metaTags}
                      onChange={handleChange}
                      placeholder="Enter meta tags"
                      disabled={isCreating}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* ============================================
              FOOTER
          ============================================ */}

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" disabled={isCreating} onClick={handleClose}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isCreating}>
              {isCreating ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Creating...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:diskette-broken" />
                  Add Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddBlogDrawer
