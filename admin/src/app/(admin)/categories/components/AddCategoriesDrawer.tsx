'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import { useCreatecategoryMutation } from '@/store/categoriesApi'
import { toast } from 'react-toastify'
import Image from 'next/image'

const AddCategoriesDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [createCategory, { isLoading }] = useCreatecategoryMutation()

  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesc: '',
    img: null as File | null,
    status: 'active',
  })

  const [previewImage, setPreviewImage] = useState('')

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

    setFormData((prev) => ({
      ...prev,
      img: file,
    }))

    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

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
  // RESET FORM
  // ============================================

  const resetForm = () => {
    setFormData({
      categoryName: '',
      categoryDesc: '',
      img: null,
      status: 'active',
    })

    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

    setPreviewImage('')
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = new FormData()

      payload.append('categoryName', formData.categoryName)

      payload.append('categoryDesc', formData.categoryDesc)

      payload.append('status', formData.status)

      if (formData.img) {
        payload.append('img', formData.img)
      }

      await createCategory(payload).unwrap()

      toast.success('Category created successfully')

      setOpen(false)

      resetForm()

      if (onAdd) {
        onAdd()
      }
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Categories
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
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
          <h5 className="mb-0 fw-bold">Add Categories</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={() => {
              setOpen(false)
            }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* CATEGORY NAME */}
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

              {/* CATEGORY DESC */}
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

              {/* IMAGE */}
              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">Category Image *</label>

                  <input type="file" className="form-control" onChange={handleFile} name="img" accept="image/*" required={!formData.img} />
                </div>
              </Col>

              {/* IMAGE PREVIEW */}
              {previewImage && (
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Preview</label>

                    <div className="border rounded p-2 bg-light">
                      <Image
                        src={previewImage}
                        alt="Category Preview"
                        width={200}
                        height={200}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    </div>
                  </div>
                </Col>
              )}

              {/* STATUS TOGGLE */}
              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label d-block">Category Status</label>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="categoryStatus"
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

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button
              type="button"
              className="btn btn-light w-100"
              onClick={() => {
                setOpen(false)
              }}>
              Cancel
            </button>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Adding...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:diskette-broken" />
                  Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddCategoriesDrawer
