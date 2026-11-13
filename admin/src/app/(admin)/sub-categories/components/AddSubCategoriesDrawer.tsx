'use client'

import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import Select, { SingleValue, StylesConfig } from 'react-select'

import { Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateSubCategoryMutation } from '@/store/subCategoryApi'

import { useGetcategoryQuery } from '@/store/categoriesApi'

import { toast } from 'react-toastify'

// ============================================
// TYPES
// ============================================

type SelectOption = {
  value: string
  label: string
}

type AddSubCategoriesDrawerProps = {
  onAdd?: () => void
}

// ============================================
// SELECT STYLES
// ============================================

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#86b7fe' : '#dee2e6',

    boxShadow: state.isFocused ? '0 0 0 0.15rem rgba(13,110,253,.15)' : 'none',

    '&:hover': {
      borderColor: state.isFocused ? '#86b7fe' : '#adb5bd',
    },
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),

  menu: (base) => ({
    ...base,
    zIndex: 99999,
  }),
}

const AddSubCategoriesDrawer = ({ onAdd }: AddSubCategoriesDrawerProps) => {
  // ============================================
  // DRAWER
  // ============================================

  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetcategoryQuery()

  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation()

  // ============================================
  // FORM
  // ============================================

  const [category, setCategory] = useState<SelectOption | null>(null)

  const [subCategoryName, setSubCategoryName] = useState('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [image, setImage] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState<string>('')

  const [error, setError] = useState('')

  // ============================================
  // CATEGORY OPTIONS FROM API
  // ============================================

  const categoryOptions: SelectOption[] = useMemo(() => {
    return categories.map((item: any) => ({
      value: item._id,
      label: item.categoryName,
    }))
  }, [categories])

  // ============================================
  // IMAGE PREVIEW CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // ============================================
  // CATEGORY CHANGE
  // ============================================

  const handleCategoryChange = (option: SingleValue<SelectOption>) => {
    setCategory(option)

    if (option) {
      setError('')
    }
  }

  // ============================================
  // SUB CATEGORY NAME
  // ============================================

  const handleSubCategoryNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubCategoryName(e.target.value)

    if (e.target.value.trim()) {
      setError('')
    }
  }

  // ============================================
  // IMAGE CHANGE
  // ============================================

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid PNG, JPG, JPEG or WEBP image.')

      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      setError('Image size must be less than 5MB.')

      e.target.value = ''
      return
    }

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))

    setError('')
  }

  // ============================================
  // REMOVE IMAGE
  // ============================================

  const removeImage = () => {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImage(null)
    setImagePreview('')

    const input = document.getElementById('subCategoryImage') as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  // ============================================
  // STATUS TOGGLE
  // ============================================

  const handleStatusToggle = () => {
    setStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
  }

  // ============================================
  // RESET
  // ============================================

  const resetForm = () => {
    setCategory(null)
    setSubCategoryName('')
    setStatus('active')
    setImage(null)
    setError('')

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImagePreview('')

    const input = document.getElementById('subCategoryImage') as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  // ============================================
  // CLOSE
  // ============================================

  const closeDrawer = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    resetForm()
    setOpen(false)
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!category) {
      setError('Please select a category.')
      return
    }

    if (!subCategoryName.trim()) {
      setError('Sub category name is required.')
      return
    }

    if (!image) {
      setError('Sub category image is required.')
      return
    }

    try {
      const payload = new FormData()

      payload.append('category', category.value)

      payload.append('subCategoryName', subCategoryName.trim())

      payload.append('status', status)

      payload.append('img', image)

      await createSubCategory(payload).unwrap()

      toast.success('Sub Category created successfully')

      resetForm()
      setOpen(false)

      if (onAdd) {
        onAdd()
      }
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const portalTarget = typeof window !== 'undefined' ? document.body : undefined

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" width={18} />
        Add Sub Category
      </button>

      {/* OVERLAY */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',

            zIndex: 1040,
          }}
          onClick={closeDrawer}
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

        <div
          className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center position-sticky top-0"
          style={{
            zIndex: 20,
          }}>
          <div>
            <h5 className="mb-1 fw-bold">Add Sub Category</h5>

            <small className="text-muted">Add sub category details and image.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={closeDrawer}>
            ✕
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row className="g-3">
              {/* ERROR */}

              {error && (
                <Col md={12}>
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
                    <IconifyIcon icon="solar:danger-triangle-broken" width={18} />

                    <span>{error}</span>
                  </div>
                </Col>
              )}

              {/* CATEGORY */}

              <Col md={12}>
                <label className="form-label fw-semibold">
                  Select Category
                  <span className="text-danger ms-1">*</span>
                </label>

                <Select<SelectOption>
                  options={categoryOptions}
                  value={category}
                  onChange={handleCategoryChange}
                  placeholder={isCategoriesLoading ? 'Loading categories...' : 'Search or select category'}
                  isLoading={isCategoriesLoading}
                  isDisabled={isCategoriesLoading}
                  isSearchable
                  isClearable
                  noOptionsMessage={() => 'No category found'}
                  styles={selectStyles}
                  menuPortalTarget={portalTarget}
                  menuPosition="fixed"
                />
              </Col>

              {/* SUB CATEGORY NAME */}

              <Col md={12}>
                <label className="form-label fw-semibold">
                  Sub Category Name
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={subCategoryName}
                  onChange={handleSubCategoryNameChange}
                  placeholder="Enter sub category name"
                  required
                />
              </Col>

              {/* IMAGE */}

              <Col md={12}>
                <label className="form-label fw-semibold">
                  Sub Category Image
                  <span className="text-danger ms-1">*</span>
                </label>

                <label htmlFor="subCategoryImage" className="sub-category-image-upload w-100 d-flex align-items-center justify-content-center">
                  <input
                    id="subCategoryImage"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="d-none"
                    onChange={handleImageChange}
                  />

                  {!imagePreview ? (
                    <div className="text-center">
                      <div className="sub-category-upload-icon mx-auto mb-3">
                        <IconifyIcon icon="solar:gallery-add-broken" width={29} />
                      </div>

                      <h6 className="fw-semibold mb-1">Upload Sub Category Image</h6>

                      <p className="text-muted mb-1">Click here to browse image</p>

                      <small className="text-muted">PNG, JPG, JPEG or WEBP • Max 5MB</small>
                    </div>
                  ) : (
                    <div className="text-center w-100">
                      <div className="sub-category-preview mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Sub Category Preview"
                          width={180}
                          height={180}
                          unoptimized
                          className="w-100 h-100"
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        <span className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                          <IconifyIcon icon="solar:gallery-edit-broken" width={16} />
                          Change Image
                        </span>
                      </div>

                      <small className="text-muted d-block mt-2">Click inside this box to replace image.</small>
                    </div>
                  )}
                </label>

                {image && (
                  <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
                    <div className="d-flex align-items-center gap-2 text-muted small overflow-hidden">
                      <IconifyIcon icon="solar:gallery-linear" width={16} />

                      <span className="text-truncate">{image.name}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger text-decoration-none d-flex align-items-center gap-1"
                      onClick={removeImage}>
                      <IconifyIcon icon="solar:trash-bin-trash-broken" width={16} />
                      Remove
                    </button>
                  </div>
                )}
              </Col>

              {/* STATUS */}

              <Col md={12}>
                <label className="form-label fw-semibold d-block">Status</label>

                <div className="d-flex align-items-center gap-3">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={status === 'active'}
                      onChange={handleStatusToggle}
                      style={{
                        width: '46px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-danger'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}

          <div
            className="p-3 border-top bg-white d-flex gap-2 position-sticky bottom-0"
            style={{
              zIndex: 20,
            }}>
            <button type="button" className="btn btn-light w-100" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </button>

            <button type="submit" disabled={isCreating} className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              {isCreating ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Adding...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:diskette-broken" width={18} />
                  Add Sub Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CSS */}

      <style jsx global>{`
        .sub-category-image-upload {
          min-height: 220px;
          padding: 20px;
          border: 2px dashed #cfd6df;
          border-radius: 12px;
          background: #fafbfc;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sub-category-image-upload:hover {
          border-color: var(--bs-primary);
          background: rgba(var(--bs-primary-rgb), 0.025);
        }

        .sub-category-upload-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--bs-primary);
          background: rgba(var(--bs-primary-rgb), 0.1);
        }

        .sub-category-preview {
          width: 180px;
          height: 180px;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
        }

        @media (max-width: 575.98px) {
          .sub-category-image-upload {
            min-height: 190px;
          }

          .sub-category-preview {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </>
  )
}

export default AddSubCategoriesDrawer
