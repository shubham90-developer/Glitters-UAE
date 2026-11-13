'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import { toast } from 'react-toastify'

import { useGetcategoryByIdQuery, useUpdatecategoryMutation } from '@/store/categoriesApi'

const EditCategoriesDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const { data: categoryData, isLoading: isCategoryLoading } = useGetcategoryByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateCategory, { isLoading: isUpdating }] = useUpdatecategoryMutation()

  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesc: '',
    img: null as File | null,
    status: 'active',
  })

  const [previewImage, setPreviewImage] = useState<string>('')

  // ============================================
  // SET EXISTING CATEGORY DATA
  // ============================================

  useEffect(() => {
    if (!categoryData) return

    const category = categoryData?.data || categoryData

    setFormData({
      categoryName: category?.categoryName || '',

      categoryDesc: category?.categoryDesc || '',

      img: null,

      status: category?.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    })

    setPreviewImage(category?.img || '')
  }, [categoryData])

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // HANDLE FILE
  // ============================================

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // remove old blob preview
    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }

    setFormData((prev) => ({
      ...prev,
      img: file,
    }))

    const previewUrl = URL.createObjectURL(file)

    setPreviewImage(previewUrl)
  }

  // ============================================
  // STATUS TOGGLE
  // ============================================

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,

      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  // ============================================
  // CLOSE DRAWER
  // ============================================

  const handleClose = () => {
    setOpen(false)

    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.categoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!formData.categoryDesc.trim()) {
      toast.error('Category description is required')
      return
    }

    try {
      const data = new FormData()

      data.append('categoryName', formData.categoryName.trim())

      data.append('categoryDesc', formData.categoryDesc.trim())

      data.append('status', formData.status)

      // new image only
      if (formData.img) {
        data.append('img', formData.img)
      }

      await updateCategory({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Category updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* ============================================
          OPEN BUTTON
      ============================================ */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* ============================================
          OVERLAY
      ============================================ */}

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

      {/* ============================================
          DRAWER
      ============================================ */}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '520px',
          maxWidth: '100%',
          zIndex: 1050,

          transform: open ? 'translateX(0)' : 'translateX(100%)',

          transition: 'transform 0.3s ease',

          overflowY: 'auto',
        }}>
        {/* HEADER */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Category</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* ============================================
            LOADING
        ============================================ */}

        {isCategoryLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status" />

            <div className="mt-2">Loading category...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              <Row>
                {/* ===================================
                    CATEGORY NAME
                =================================== */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Category Name *</label>

                    <input
                      type="text"
                      className="form-control"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                </Col>

                {/* ===================================
                    CATEGORY DESCRIPTION
                =================================== */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Category Description *</label>

                    <textarea
                      className="form-control"
                      name="categoryDesc"
                      value={formData.categoryDesc}
                      onChange={handleChange}
                      placeholder="Enter category description"
                      rows={4}
                      required
                    />
                  </div>
                </Col>

                {/* ===================================
                    CURRENT / NEW IMAGE PREVIEW
                =================================== */}

                {previewImage && (
                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Category Image Preview</label>

                      <div
                        className="border rounded p-2 bg-light"
                        style={{
                          overflow: 'hidden',
                        }}>
                        <Image
                          src={previewImage}
                          alt="Category Preview"
                          width={500}
                          height={220}
                          unoptimized={previewImage.startsWith('blob:')}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                )}

                {/* ===================================
                    IMAGE INPUT
                =================================== */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Change Category Image</label>

                    <input type="file" className="form-control" onChange={handleFile} name="img" accept="image/*" />

                    <small className="text-muted">Leave empty to keep the current image.</small>
                  </div>
                </Col>

                {/* ===================================
                    STATUS TOGGLE
                =================================== */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label d-block">Category Status</label>

                    <div className="d-flex align-items-center gap-3">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`categoryStatus-${item?._id}`}
                          checked={formData.status === 'active'}
                          onChange={handleStatusToggle}
                          style={{
                            width: '46px',
                            height: '24px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>

                      <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* ============================================
                FOOTER
            ============================================ */}

            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isUpdating}>
                Cancel
              </button>

              <button type="submit" disabled={isUpdating} className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:diskette-broken" />
                    Update
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

export default EditCategoriesDrawer
