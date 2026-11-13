'use client'

import React, { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetBlogCategoryByIdQuery, useUpdateBlogCategoryMutation } from '@/store/blogCategoryApi'

// =====================================================
// TYPES
// =====================================================

interface EditCategoriesDrawerProps {
  item: {
    _id: string
  }
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

const EditCategoriesDrawer = ({ item }: EditCategoriesDrawerProps) => {
  const [open, setOpen] = useState(false)

  // ===================================================
  // API
  // ===================================================

  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError,
    refetch,
  } = useGetBlogCategoryByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateCategory, { isLoading: isUpdating }] = useUpdateBlogCategoryMutation()

  // ===================================================
  // NORMALIZE CATEGORY
  // ===================================================

  const category =
    categoryResponse && typeof categoryResponse === 'object' && 'data' in categoryResponse ? (categoryResponse as any).data : categoryResponse

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<FormDataState>(initialFormData)

  // ===================================================
  // SET EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!category) {
      return
    }

    setFormData({
      categoryName: category.categoryName || '',

      status: category.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    })
  }, [category])

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

    const categoryName = formData.categoryName.trim()

    if (!categoryName) {
      toast.error('Category name is required')
      return
    }

    if (!item?._id) {
      toast.error('Category ID not found')
      return
    }

    try {
      const data = {
        categoryName,
        status: formData.status,
      }

      console.log('UPDATE CATEGORY ID:', item._id)

      console.log('UPDATE CATEGORY DATA:', data)

      await updateCategory({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Blog category updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error('UPDATE CATEGORY ERROR:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      {/* ============================================
          OPEN BUTTON
      ============================================ */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={handleOpen}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* ============================================
          OVERLAY
      ============================================ */}

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
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Edit Blog Category</h5>

            <small className="text-muted">Update category name and status.</small>
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

        {/* ==========================================
            LOADING
        ========================================== */}

        {isCategoryLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading category...</div>
          </div>
        ) : isError ? (
          <div className="p-4">
            <div className="alert alert-danger mb-0">Unable to load category data.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              <Row>
                {/* ==================================
                    CATEGORY NAME
                ================================== */}

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
                      disabled={isUpdating}
                    />
                  </div>
                </Col>

                {/* ==================================
                    STATUS
                ================================== */}

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
                              id={`categoryStatus-${item?._id}`}
                              checked={formData.status === 'active'}
                              onChange={handleStatusToggle}
                              disabled={isUpdating}
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

            {/* ==========================================
                FOOTER
            ========================================== */}

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
                    Update Category
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
