'use client'

import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateBlogCategoryMutation } from '@/store/blogCategoryApi'

// =====================================================
// TYPES
// =====================================================

interface AddCategoriesDrawerProps {
  onAdd?: () => void
}

type CategoryStatus = 'active' | 'inactive'

interface FormDataState {
  categoryName: string
  status: CategoryStatus
}

// =====================================================
// INITIAL FORM
// =====================================================

const initialFormData: FormDataState = {
  categoryName: '',
  status: 'active',
}

// =====================================================
// COMPONENT
// =====================================================

const AddCategoriesDrawer = ({ onAdd }: AddCategoriesDrawerProps) => {
  const [open, setOpen] = useState(false)

  const [createCategory, { isLoading }] = useCreateBlogCategoryMutation()

  const [formData, setFormData] = useState<FormDataState>(initialFormData)

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
  // RESET
  // ===================================================

  const resetForm = () => {
    setFormData(initialFormData)
  }

  // ===================================================
  // OPEN
  // ===================================================

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (isLoading) {
      return
    }

    setOpen(false)
    resetForm()
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const categoryName = formData.categoryName.trim()

    if (!categoryName) {
      toast.error('Category name is required')

      return
    }

    try {
      const payload = {
        categoryName,

        status: formData.status,
      }
      // @ts-ignore @ts-ignore
      await createCategory(payload).unwrap()

      toast.success('Blog category created successfully')

      setOpen(false)

      resetForm()

      onAdd?.()
    } catch (error: any) {
      console.error('Create Blog Category Error:', error)

      toast.error(error?.data?.message || error?.data?.error || 'Something went wrong')
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

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpen}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Blog Category
      </button>

      {/* ==============================================
          OVERLAY
      ============================================== */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',

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
          width: '520px',
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
            <h5 className="mb-1 fw-bold">Add Blog Category</h5>

            <small className="text-muted">Create a new blog category.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            disabled={isLoading}
            onClick={handleClose}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* ============================================
            FORM
        ============================================ */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* ======================================
                  CATEGORY NAME
              ====================================== */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Category Name
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
              </Col>

              {/* ======================================
                  STATUS
              ====================================== */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label d-block">Category Status</label>

                  <div className="border rounded p-3">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <div>
                        <div className="fw-medium">Status</div>

                        <small className="text-muted">Enable or disable this blog category.</small>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="categoryStatus"
                            checked={formData.status === 'active'}
                            onChange={handleStatusToggle}
                            disabled={isLoading}
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
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* ============================================
              FOOTER
          ============================================ */}

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" disabled={isLoading} onClick={handleClose}>
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
                  Add Category
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
