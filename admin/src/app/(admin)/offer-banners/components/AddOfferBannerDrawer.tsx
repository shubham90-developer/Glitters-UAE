'use client'

import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react'

import Image from 'next/image'
import Select, { SingleValue, StylesConfig } from 'react-select'

import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateOfferBannerMutation } from '@/store/offerBannerApi'

import { useGetcategoryQuery } from '@/store/categoriesApi'

import { useGetSubCategoryQuery } from '@/store/subCategoryApi'

// ============================================
// TYPES
// ============================================

type SelectOption = {
  value: string
  label: string
}

type AddOfferBannerDrawerProps = {
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

// ============================================
// COMPONENT
// ============================================

const AddOfferBannerDrawer = ({ onAdd }: AddOfferBannerDrawerProps) => {
  // ============================================
  // DRAWER
  // ============================================

  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetcategoryQuery()

  const { data: subCategories = [], isLoading: isSubCategoriesLoading } = useGetSubCategoryQuery()

  const [createOfferBanner, { isLoading }] = useCreateOfferBannerMutation()

  // ============================================
  // STATE
  // ============================================

  const [category, setCategory] = useState<SelectOption | null>(null)

  const [subCategory, setSubCategory] = useState<SelectOption | null>(null)

  const [redirectUrl, setRedirectUrl] = useState('')

  const [offerBannerImg, setOfferBannerImg] = useState<File | null>(null)

  const [previewImage, setPreviewImage] = useState('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

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
  // FILTER SUB CATEGORIES BY CATEGORY
  // ============================================

  const subCategoryOptions = useMemo<SelectOption[]>(() => {
    if (!category) {
      return []
    }

    return subCategories
      .filter((item: any) => {
        const categoryId = typeof item.category === 'object' ? item.category?._id : item.category

        return categoryId === category.value
      })
      .map((item: any) => ({
        value: item._id,
        label: item.subCategoryName,
      }))
  }, [subCategories, category])

  // ============================================
  // CATEGORY CHANGE
  // ============================================

  const handleCategoryChange = (option: SingleValue<SelectOption>) => {
    setCategory(option)

    // reset sub category when category changes
    setSubCategory(null)
  }

  // ============================================
  // FILE CHANGE
  // ============================================

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select PNG, JPG, JPEG or WEBP image')

      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')

      e.target.value = ''
      return
    }

    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }

    setOfferBannerImg(file)

    setPreviewImage(URL.createObjectURL(file))
  }

  // ============================================
  // STATUS
  // ============================================

  const handleStatusToggle = () => {
    setStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
  }

  // ============================================
  // RESET
  // ============================================

  const resetForm = () => {
    setCategory(null)
    setSubCategory(null)
    setRedirectUrl('')
    setOfferBannerImg(null)
    setStatus('active')

    if (previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }

    setPreviewImage('')

    const input = document.getElementById('offerBannerImg') as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    setOpen(false)
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!category) {
      toast.error('Please select category')
      return
    }

    if (!offerBannerImg) {
      toast.error('Offer banner image is required')
      return
    }

    try {
      const payload = new FormData()

      // required category
      payload.append('category', category.value)

      // optional sub category
      if (subCategory) {
        payload.append('subCategory', subCategory.value)
      }

      // optional redirect URL
      if (redirectUrl.trim()) {
        payload.append('redirectUrl', redirectUrl.trim())
      }

      payload.append('status', status)

      payload.append('offerBannerImg', offerBannerImg)

      await createOfferBanner(payload).unwrap()

      toast.success('Offer Banner created successfully')

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
      {/* ============================================
          OPEN BUTTON
      ============================================ */}

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Offer Banner
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
          <div>
            <h5 className="mb-1 fw-bold">Add Offer Banner</h5>

            <small className="text-muted">Select category and upload banner.</small>
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

        {/* ============================================
            FORM
        ============================================ */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row className="g-3">
              {/* CATEGORY */}

              <Col md={12}>
                <label className="form-label fw-semibold">
                  Category
                  <span className="text-danger ms-1">*</span>
                </label>

                <Select<SelectOption>
                  options={categoryOptions}
                  value={category}
                  onChange={handleCategoryChange}
                  placeholder={isCategoriesLoading ? 'Loading categories...' : 'Select category'}
                  isLoading={isCategoriesLoading}
                  isDisabled={isCategoriesLoading}
                  isSearchable
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={portalTarget}
                  menuPosition="fixed"
                  noOptionsMessage={() => 'No category found'}
                />
              </Col>

              {/* SUB CATEGORY */}

              <Col md={12}>
                <label className="form-label fw-semibold">Sub Category</label>

                <Select<SelectOption>
                  options={subCategoryOptions}
                  value={subCategory}
                  onChange={(option) => setSubCategory(option)}
                  placeholder={!category ? 'Select category first' : isSubCategoriesLoading ? 'Loading sub categories...' : 'Select sub category'}
                  isLoading={isSubCategoriesLoading}
                  isDisabled={!category || isSubCategoriesLoading}
                  isSearchable
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={portalTarget}
                  menuPosition="fixed"
                  noOptionsMessage={() => 'No sub category found'}
                />
              </Col>

              {/* REDIRECT URL */}

              <Col md={12}>
                <label className="form-label fw-semibold">Redirect URL</label>

                <input
                  type="text"
                  className="form-control"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="/products?category=..."
                />

                <small className="text-muted">Optional. You can use category based redirect automatically on frontend.</small>
              </Col>

              {/* IMAGE */}

              <Col md={12}>
                <label className="form-label fw-semibold">
                  Banner Image
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  id="offerBannerImg"
                  type="file"
                  className="form-control"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFile}
                />
              </Col>

              {/* PREVIEW */}

              {previewImage && (
                <Col md={12}>
                  <label className="form-label fw-semibold">Preview</label>

                  <div className="border rounded p-2 bg-light">
                    <Image
                      src={previewImage}
                      alt="Offer Banner Preview"
                      width={500}
                      height={220}
                      unoptimized
                      style={{
                        width: '100%',
                        height: '220px',

                        objectFit: 'cover',

                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </Col>
              )}

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

          {/* ============================================
              FOOTER
          ============================================ */}

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isLoading}>
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
                  Add Offer Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddOfferBannerDrawer
