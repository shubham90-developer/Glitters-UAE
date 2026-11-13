'use client'

import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import Select, { SingleValue, StylesConfig } from 'react-select'

import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetOfferBannerByIdQuery, useUpdateOfferBannerMutation } from '@/store/offerBannerApi'

import { useGetcategoryQuery } from '@/store/categoriesApi'

import { useGetSubCategoryQuery } from '@/store/subCategoryApi'

type SelectOption = {
  value: string
  label: string
}

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
}

const EditOfferBannerDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  const { data: offerBannerData, isLoading: isOfferBannerLoading } = useGetOfferBannerByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetcategoryQuery()

  const { data: subCategories = [], isLoading: isSubCategoriesLoading } = useGetSubCategoryQuery()

  const [updateOfferBanner, { isLoading: isUpdating }] = useUpdateOfferBannerMutation()

  const [category, setCategory] = useState<SelectOption | null>(null)

  const [subCategory, setSubCategory] = useState<SelectOption | null>(null)

  const [redirectUrl, setRedirectUrl] = useState('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [offerBannerImg, setOfferBannerImg] = useState<File | null>(null)

  const [previewImage, setPreviewImage] = useState('')

  // CATEGORY OPTIONS
  const categoryOptions = useMemo<SelectOption[]>(() => {
    return categories.map((item: any) => ({
      value: item._id,
      label: item.categoryName,
    }))
  }, [categories])

  // SUB CATEGORY OPTIONS
  const subCategoryOptions = useMemo<SelectOption[]>(() => {
    if (!category) return []

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

  // LOAD EXISTING DATA
  useEffect(() => {
    if (!offerBannerData) return

    const data = (offerBannerData as any)?.data || offerBannerData

    const categoryData = data?.category

    if (categoryData) {
      if (typeof categoryData === 'object') {
        setCategory({
          value: categoryData._id,
          label: categoryData.categoryName || 'Category',
        })
      } else {
        const found = categories.find((cat: any) => cat._id === categoryData)

        if (found) {
          setCategory({
            value: found._id,
            label: found.categoryName,
          })
        }
      }
    }

    const subCategoryData = data?.subCategory

    if (subCategoryData) {
      if (typeof subCategoryData === 'object') {
        setSubCategory({
          value: subCategoryData._id,
          label: subCategoryData.subCategoryName || 'Sub Category',
        })
      } else {
        const found = subCategories.find((sub: any) => sub._id === subCategoryData)

        if (found) {
          setSubCategory({
            value: found._id,
            label: found.subCategoryName,
          })
        }
      }
    } else {
      setSubCategory(null)
    }

    setRedirectUrl(data?.redirectUrl || '')

    setStatus(data?.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active')

    setOfferBannerImg(null)

    setPreviewImage(data?.offerBannerImg || '')
  }, [offerBannerData, categories, subCategories])

  // CATEGORY CHANGE
  const handleCategoryChange = (option: SingleValue<SelectOption>) => {
    setCategory(option)
    setSubCategory(null)
  }

  // FILE CHANGE
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select PNG, JPG, JPEG or WEBP image')

      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
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

  // STATUS
  const handleStatusToggle = () => {
    setStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
  }

  // SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!category) {
      toast.error('Please select category')
      return
    }

    try {
      const data = new FormData()

      data.append('category', category.value)

      if (subCategory) {
        data.append('subCategory', subCategory.value)
      }

      data.append('redirectUrl', redirectUrl.trim())

      data.append('status', status)

      if (offerBannerImg) {
        data.append('offerBannerImg', offerBannerImg)
      }

      await updateOfferBanner({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Offer Banner updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const portalTarget = typeof window !== 'undefined' ? document.body : undefined

  return (
    <>
      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

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
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Offer Banner</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {isOfferBannerLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              <Row className="g-3">
                {/* CATEGORY */}
                <Col md={12}>
                  <label className="form-label">Category *</label>

                  <Select<SelectOption>
                    options={categoryOptions}
                    value={category}
                    onChange={handleCategoryChange}
                    isLoading={isCategoriesLoading}
                    placeholder="Select category"
                    isSearchable
                    isClearable
                    styles={selectStyles}
                    menuPortalTarget={portalTarget}
                    menuPosition="fixed"
                  />
                </Col>

                {/* SUB CATEGORY */}
                <Col md={12}>
                  <label className="form-label">Sub Category</label>

                  <Select<SelectOption>
                    options={subCategoryOptions}
                    value={subCategory}
                    onChange={setSubCategory}
                    isLoading={isSubCategoriesLoading}
                    isDisabled={!category}
                    placeholder={!category ? 'Select category first' : 'Select sub category'}
                    isSearchable
                    isClearable
                    styles={selectStyles}
                    menuPortalTarget={portalTarget}
                    menuPosition="fixed"
                  />
                </Col>

                {/* REDIRECT */}
                <Col md={12}>
                  <label className="form-label">Redirect URL</label>

                  <input
                    type="text"
                    className="form-control"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="/products?category=..."
                  />
                </Col>

                {/* PREVIEW */}
                {previewImage && (
                  <Col md={12}>
                    <label className="form-label">Current Banner</label>

                    <div className="border rounded p-2 bg-light">
                      <Image
                        src={previewImage}
                        alt="Offer Banner"
                        width={500}
                        height={220}
                        unoptimized
                        style={{
                          width: '100%',
                          height: '220px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                    </div>
                  </Col>
                )}

                {/* IMAGE */}
                <Col md={12}>
                  <label className="form-label">Change Banner Image</label>

                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="form-control" onChange={handleFile} />

                  <small className="text-muted">Leave empty to keep current banner.</small>
                </Col>

                {/* STATUS */}
                <Col md={12}>
                  <label className="form-label d-block">Status</label>

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

            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isUpdating}>
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

export default EditOfferBannerDrawer
