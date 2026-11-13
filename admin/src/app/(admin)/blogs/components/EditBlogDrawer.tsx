'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { toast } from 'react-toastify'

// @ts-ignore
import 'react-quill/dist/quill.snow.css'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetBlogByIdQuery, useUpdateBlogMutation } from '@/store/blogApi'

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

type BlogStatus = 'active' | 'inactive'

interface BlogFormData {
  category: string

  title: string
  shortDesc: string

  author: string

  featured: boolean

  description: string

  QuickTips: string

  blackQuote: string

  tags: string

  writtenBy: string

  writtenByDesc: string

  metaTitle: string
  metaDesc: string
  metaTags: string

  status: BlogStatus

  image: File | null

  writtenByImage: File | null
}

// =====================================================
// INITIAL FORM
// =====================================================

const initialFormData: BlogFormData = {
  category: '',

  title: '',
  shortDesc: '',

  author: '',

  featured: false,

  description: '',

  QuickTips: '',

  blackQuote: '',

  tags: '',

  writtenBy: '',

  writtenByDesc: '',

  metaTitle: '',
  metaDesc: '',
  metaTags: '',

  status: 'active',

  image: null,

  writtenByImage: null,
}

// =====================================================
// COMPONENT
// =====================================================

const EditBlogDrawer = ({ item }: any) => {
  // ===================================================
  // DRAWER
  // ===================================================

  const [open, setOpen] = useState(false)

  // ===================================================
  // BLOG API
  // ===================================================

  const {
    data: blogResponse,
    isLoading: isBlogLoading,
    refetch,
  } = useGetBlogByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  // ===================================================
  // CATEGORY API
  // ===================================================

  const { data: categoryResponse, isLoading: isCategoryLoading } = useGetBlogCategoryQuery()

  // ===================================================
  // NORMALIZE BLOG DATA
  // ===================================================

  const blogData = useMemo(() => {
    const response: any = blogResponse

    if (!response) {
      return null
    }

    if (response?.data && !Array.isArray(response.data)) {
      return response.data
    }

    if (Array.isArray(response?.data)) {
      return response.data[0] || null
    }

    if (Array.isArray(response)) {
      return response[0] || null
    }

    return response
  }, [blogResponse])

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

  const [formData, setFormData] = useState<BlogFormData>(initialFormData)

  // ===================================================
  // IMAGE PREVIEWS
  // ===================================================

  const [imagePreview, setImagePreview] = useState('')

  const [writtenByImagePreview, setWrittenByImagePreview] = useState('')

  // ===================================================
  // SET EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!blogData) {
      return
    }

    let categoryId = ''

    if (typeof blogData.category === 'object') {
      categoryId = blogData.category?._id || ''
    } else {
      categoryId = blogData.category || ''
    }

    setFormData({
      category: categoryId,

      title: blogData.title || '',

      shortDesc: blogData.shortDesc || '',

      author: blogData.author || '',

      featured: Boolean(blogData.featured),

      description: blogData.description || '',

      QuickTips: blogData.QuickTips || '',

      blackQuote: blogData.blackQuote || '',

      tags: blogData.tags || '',

      writtenBy: blogData.writtenBy || '',

      writtenByDesc: blogData.writtenByDesc || '',

      metaTitle: blogData.metaTitle || '',

      metaDesc: blogData.metaDesc || '',

      metaTags: blogData.metaTags || '',

      status: blogData.status === 'inactive' ? 'inactive' : 'active',

      image: null,

      writtenByImage: null,
    })

    setImagePreview(blogData.image || '')

    setWrittenByImagePreview(blogData.writtenByImage || '')
  }, [blogData])

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
  // FEATURED TOGGLE
  // ===================================================

  const handleFeaturedToggle = () => {
    setFormData((prev) => ({
      ...prev,

      featured: !prev.featured,
    }))
  }

  // ===================================================
  // STATUS TOGGLE
  // ===================================================

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,

      status: prev.status === 'active' ? 'inactive' : 'active',
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
  // OPEN
  // ===================================================

  const handleOpen = async () => {
    setOpen(true)

    if (item?._id) {
      try {
        await refetch()
      } catch {
        //
      }
    }
  }

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (isUpdating) {
      return
    }

    setOpen(false)
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ===============================================
    // VALIDATION
    // ===============================================

    if (!formData.category) {
      toast.error('Category is required')

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

    if (isQuillEmpty(formData.description)) {
      toast.error('Description is required')

      return
    }

    if (!item?._id) {
      toast.error('Blog ID not found')

      return
    }

    try {
      const data = new FormData()

      // =============================================
      // BASIC
      // =============================================

      data.append('category', formData.category)

      data.append('title', formData.title.trim())

      data.append('shortDesc', formData.shortDesc.trim())

      data.append('author', formData.author.trim())

      data.append('featured', String(formData.featured))

      // =============================================
      // CONTENT
      // =============================================

      data.append('description', formData.description)

      data.append('QuickTips', formData.QuickTips)

      data.append('blackQuote', formData.blackQuote)

      data.append('tags', formData.tags.trim())

      // =============================================
      // WRITTEN BY
      // =============================================

      data.append('writtenBy', formData.writtenBy.trim())

      data.append('writtenByDesc', formData.writtenByDesc)

      // =============================================
      // SEO
      // =============================================

      data.append('metaTitle', formData.metaTitle.trim())

      data.append('metaDesc', formData.metaDesc.trim())

      data.append('metaTags', formData.metaTags.trim())

      // =============================================
      // STATUS
      // =============================================

      data.append('status', formData.status)

      // =============================================
      // MAIN IMAGE
      // =============================================

      if (formData.image) {
        data.append('image', formData.image)
      }

      // =============================================
      // WRITER IMAGE
      // =============================================

      if (formData.writtenByImage) {
        data.append('writtenByImage', formData.writtenByImage)
      }

      // =============================================
      // UPDATE
      // =============================================

      await updateBlog({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Blog updated successfully')

      setOpen(false)

      await refetch()
    } catch (error: any) {
      console.error('Update Blog Error:', error)

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

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={handleOpen}>
        <IconifyIcon icon="solar:pen-2-broken" />
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
            <h5 className="mb-1 fw-bold">Edit Blog</h5>

            <small className="text-muted">Update complete blog information.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            disabled={isUpdating}
            onClick={handleClose}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* ============================================
            LOADING
        ============================================ */}

        {isBlogLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading blog...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              {/* ======================================
                  BASIC INFORMATION
              ====================================== */}

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
                        disabled={isUpdating || isCategoryLoading}>
                        <option value="">Select Category</option>

                        {categories.map((category: any) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
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
                        disabled={isUpdating}
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
                        placeholder="Enter author"
                        disabled={isUpdating}
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
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.featured}
                                onChange={handleFeaturedToggle}
                                disabled={isUpdating}
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
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* ======================================
                  BLOG IMAGE
              ====================================== */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Blog Image</h5>

                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImage}
                  disabled={isUpdating}
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

              {/* ======================================
                  CONTENT
              ====================================== */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Blog Content</h5>

                <Row>
                  {/* DESCRIPTION */}

                  <Col md={12}>
                    <div className="mb-5">
                      <label className="form-label">Description</label>

                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,

                            description: value,
                          }))
                        }
                        placeholder="Enter description..."
                        style={{
                          height: '200px',

                          marginBottom: '50px',
                        }}
                      />
                    </div>
                  </Col>

                  {/* QUICK TIPS */}

                  <Col md={12}>
                    <div className="mb-5">
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
                          height: '160px',

                          marginBottom: '50px',
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
                        placeholder="Enter quote"
                        disabled={isUpdating}
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
                        placeholder="ecommerce, shopping, fashion"
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* ======================================
                  WRITTEN BY
              ====================================== */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Written By</h5>

                <Row>
                  {/* WRITER */}

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Writer Name</label>

                      <input
                        type="text"
                        className="form-control"
                        name="writtenBy"
                        value={formData.writtenBy}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  {/* WRITER IMAGE */}

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Writer Image</label>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleWrittenByImage}
                        disabled={isUpdating}
                      />

                      {writtenByImagePreview && (
                        <div className="mt-3">
                          <Image
                            src={writtenByImagePreview}
                            alt="Writer"
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

                  {/* WRITER DESC */}

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Writer Description</label>

                      <textarea
                        rows={4}
                        className="form-control"
                        name="writtenByDesc"
                        value={formData.writtenByDesc}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* ======================================
                  STATUS
              ====================================== */}

              <div className="border rounded p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Blog Status</h5>

                    <small className="text-muted">Enable or disable this blog.</small>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.status === 'active'}
                        onChange={handleStatusToggle}
                        disabled={isUpdating}
                        style={{
                          width: '46px',

                          height: '24px',
                        }}
                      />
                    </div>

                    <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ======================================
                  SEO
              ====================================== */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">SEO Settings</h5>

                <Row>
                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Meta Title</label>

                      <input
                        type="text"
                        className="form-control"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Meta Description</label>

                      <textarea
                        rows={3}
                        className="form-control"
                        name="metaDesc"
                        value={formData.metaDesc}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Meta Tags</label>

                      <input
                        type="text"
                        className="form-control"
                        name="metaTags"
                        value={formData.metaTags}
                        onChange={handleChange}
                        disabled={isUpdating}
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
              <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isUpdating}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:diskette-broken" />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default EditBlogDrawer
