'use client'

import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import Select, { SingleValue, StylesConfig } from 'react-select'

import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetSubCategoryByIdQuery, useUpdateSubCategoryMutation } from '@/store/subCategoryApi'

import { useGetcategoryQuery } from '@/store/categoriesApi'

// ============================================
// TYPES
// ============================================

type SelectOption = {
  value: string
  label: string
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

const EditSubCategoriesDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const { data: subCategoryData, isLoading: isSubCategoryLoading } = useGetSubCategoryByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetcategoryQuery()

  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation()

  // ============================================
  // FORM STATES
  // ============================================

  const [category, setCategory] = useState<SelectOption | null>(null)

  const [subCategoryName, setSubCategoryName] = useState('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [image, setImage] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState<string>('')

  const [error, setError] = useState('')

  // ============================================
  // CATEGORY OPTIONS
  // ============================================

  const categoryOptions = useMemo<SelectOption[]>(() => {
    return categories.map((item: any) => ({
      value: item._id,
      label: item.categoryName,
    }))
  }, [categories])

  // ============================================
  // LOAD EXISTING SUB CATEGORY
  // ============================================

  useEffect(() => {
    if (!subCategoryData) return

    const data = (subCategoryData as any)?.data || subCategoryData

    const categoryData = data?.category

    if (categoryData) {
      if (typeof categoryData === 'object') {
        setCategory({
          value: categoryData._id,
          label: categoryData.categoryName || 'Category',
        })
      } else {
        const foundCategory = categories.find((cat: any) => cat._id === categoryData)

        if (foundCategory) {
          setCategory({
            value: foundCategory._id,
            label: foundCategory.categoryName,
          })
        } else {
          setCategory({
            value: categoryData,
            label: 'Selected Category',
          })
        }
      }
    }

    setSubCategoryName(data?.subCategoryName || '')

    setStatus(data?.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active')

    setImage(null)

    setImagePreview(data?.img || '')
  }, [subCategoryData, categories])

  // ============================================
  // PREVIEW CLEANUP
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
  // REMOVE NEW IMAGE
  // ============================================

  const removeImage = () => {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImage(null)

    const existingData = (subCategoryData as any)?.data || subCategoryData

    setImagePreview((existingData as any)?.img || '')

    const input = document.getElementById(`subCategoryImage-${item?._id}`) as HTMLInputElement | null

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
  // CLOSE
  // ============================================

  const handleClose = () => {
    setOpen(false)
    setError('')
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
      setError('Sub Category name is required.')
      return
    }

    try {
      const data = new FormData()

      data.append('category', category.value)

      data.append('subCategoryName', subCategoryName.trim())

      data.append('status', status)

      if (image) {
        data.append('img', image)
      }

      await updateSubCategory({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Sub Category updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const portalTarget = typeof window !== 'undefined' ? document.body : undefined

  return (
    <>
      {/* OPEN */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* OVERLAY */}

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
            <h5 className="mb-1 fw-bold">Edit Sub Category</h5>

            <small className="text-muted">Update sub category details.</small>
          </div>

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

        {/* LOADING */}

        {isSubCategoryLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />
            <div className="mt-2">Loading...</div>
          </div>
        ) : (
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

                {/* NAME */}

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
                  <label className="form-label fw-semibold">Sub Category Image</label>

                  <label
                    htmlFor={`subCategoryImage-${item?._id}`}
                    className="sub-category-image-upload w-100 d-flex align-items-center justify-content-center">
                    <input
                      id={`subCategoryImage-${item?._id}`}
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

                        <h6 className="fw-semibold mb-1">Upload Image</h6>

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
                      </div>
                    )}
                  </label>

                  {image && (
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
                      <span className="text-muted small text-truncate">{image.name}</span>

                      <button type="button" className="btn btn-sm btn-link text-danger text-decoration-none" onClick={removeImage}>
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
                    <IconifyIcon icon="solar:diskette-broken" width={18} />
                    Update Sub Category
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        .sub-category-image-upload {
          min-height: 220px;
          padding: 20px;
          border: 2px dashed #cfd6df;
          border-radius: 12px;
          background: #fafbfc;
          cursor: pointer;
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
          background: #fff;
        }
      `}</style>
    </>
  )
}

export default EditSubCategoriesDrawer
