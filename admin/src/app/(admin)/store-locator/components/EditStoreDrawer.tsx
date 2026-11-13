'use client'

import React, { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetStoreLocatorByIdQuery, useUpdateStoreLocatorMutation } from '@/store/storeLocatorApi'

type StoreStatus = 'active' | 'inactive'

interface StoreFormState {
  badgeTitle: string
  storeName: string
  rating: string
  shortDesc: string
  address: string
  phone: string
  email: string
  workingHours: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  status: StoreStatus

  img: File | null
  qrcode: File | null
}

const initialFormData: StoreFormState = {
  badgeTitle: '',
  storeName: '',
  rating: '',
  shortDesc: '',
  address: '',
  phone: '',
  email: '',
  workingHours: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  status: 'active',

  img: null,
  qrcode: null,
}

const EditStoreDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ===================================================
  // API
  // ===================================================

  const {
    data: storeResponse,
    isLoading: isStoreLoading,
    refetch,
  } = useGetStoreLocatorByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreLocatorMutation()

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<StoreFormState>(initialFormData)

  const [imagePreview, setImagePreview] = useState('')

  const [qrPreview, setQrPreview] = useState('')

  // ===================================================
  // NORMALIZE STORE
  // ===================================================

  const storeData: any = storeResponse && typeof storeResponse === 'object' && 'data' in storeResponse ? (storeResponse as any).data : storeResponse

  // ===================================================
  // SET EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!storeData) {
      return
    }

    setFormData({
      badgeTitle: storeData.badgeTitle || '',

      storeName: storeData.storeName || '',

      rating: storeData.rating || '',

      shortDesc: storeData.shortDesc || '',

      address: storeData.address || '',

      phone: storeData.phone || '',

      email: storeData.email || '',

      workingHours: storeData.workingHours || '',

      facebook: storeData.facebook || '',

      instagram: storeData.instagram || '',

      twitter: storeData.twitter || '',

      youtube: storeData.youtube || '',

      status: storeData.status === 'inactive' ? 'inactive' : 'active',

      img: null,

      qrcode: null,
    })

    setImagePreview(storeData.img || '')

    setQrPreview(storeData.qrcode || '')
  }, [storeData])

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }))
  }

  // ===================================================
  // STATUS
  // ===================================================

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,

      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  // ===================================================
  // STORE IMAGE
  // ===================================================

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setFormData((prev) => ({
      ...prev,

      img: file,
    }))

    setImagePreview(URL.createObjectURL(file))
  }

  // ===================================================
  // QR CODE
  // ===================================================

  const handleQrCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (qrPreview.startsWith('blob:')) {
      URL.revokeObjectURL(qrPreview)
    }

    setFormData((prev) => ({
      ...prev,

      qrcode: file,
    }))

    setQrPreview(URL.createObjectURL(file))
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

    if (!formData.badgeTitle.trim()) {
      toast.error('Badge title is required')

      return
    }

    if (!formData.storeName.trim()) {
      toast.error('Store name is required')

      return
    }

    if (!formData.address.trim()) {
      toast.error('Address is required')

      return
    }

    if (!formData.email.trim()) {
      toast.error('Email is required')

      return
    }

    if (!item?._id) {
      toast.error('Store ID not found')

      return
    }

    try {
      const data = new FormData()

      data.append('badgeTitle', formData.badgeTitle.trim())

      data.append('storeName', formData.storeName.trim())

      data.append('rating', formData.rating.trim())

      data.append('shortDesc', formData.shortDesc.trim())

      data.append('address', formData.address.trim())

      data.append('phone', formData.phone.trim())

      data.append('email', formData.email.trim())

      data.append('workingHours', formData.workingHours.trim())

      data.append('facebook', formData.facebook.trim())

      data.append('instagram', formData.instagram.trim())

      data.append('twitter', formData.twitter.trim())

      data.append('youtube', formData.youtube.trim())

      data.append('status', formData.status)

      if (formData.img) {
        data.append('img', formData.img)
      }

      if (formData.qrcode) {
        data.append('qrcode', formData.qrcode)
      }

      await updateStore({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Store updated successfully')

      setOpen(false)

      await refetch()
    } catch (error: any) {
      console.error('Update Store Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={handleOpen}>
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
          width: '820px',
          maxWidth: '100%',
          zIndex: 1050,

          transform: open ? 'translateX(0)' : 'translateX(100%)',

          transition: 'transform 0.3s ease',

          overflowY: 'auto',
        }}>
        {/* HEADER */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Edit Store</h5>

            <small className="text-muted">Update complete store information.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}
            disabled={isUpdating}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* LOADING */}

        {isStoreLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading store...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              {/* STORE INFO */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Store Information</h5>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Badge Title *</label>

                      <input
                        type="text"
                        className="form-control"
                        name="badgeTitle"
                        value={formData.badgeTitle}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Store Name *</label>

                      <input
                        type="text"
                        className="form-control"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Rating</label>

                      <input
                        type="text"
                        className="form-control"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>

                      <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} disabled={isUpdating} />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>

                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Working Hours</label>

                      <input
                        type="text"
                        className="form-control"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Short Description</label>

                      <textarea
                        rows={3}
                        className="form-control"
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label">Address *</label>

                      <textarea
                        rows={3}
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* IMAGES */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Store Images</h5>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Store Image</label>

                      <input type="file" className="form-control" accept="image/*" onChange={handleImage} disabled={isUpdating} />

                      {imagePreview && (
                        <div className="mt-3">
                          <Image
                            src={imagePreview}
                            alt="Store"
                            width={180}
                            height={120}
                            unoptimized
                            style={{
                              width: '180px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">QR Code</label>

                      <input type="file" className="form-control" accept="image/*" onChange={handleQrCode} disabled={isUpdating} />

                      {qrPreview && (
                        <div className="mt-3">
                          <Image
                            src={qrPreview}
                            alt="QR Code"
                            width={120}
                            height={120}
                            unoptimized
                            style={{
                              width: '120px',
                              height: '120px',
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

              {/* SOCIAL */}

              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Social Links</h5>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Facebook</label>

                      <input type="text" className="form-control" name="facebook" value={formData.facebook} onChange={handleChange} />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Instagram</label>

                      <input type="text" className="form-control" name="instagram" value={formData.instagram} onChange={handleChange} />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Twitter</label>

                      <input type="text" className="form-control" name="twitter" value={formData.twitter} onChange={handleChange} />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">YouTube</label>

                      <input type="text" className="form-control" name="youtube" value={formData.youtube} onChange={handleChange} />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* STATUS */}

              <div className="border rounded p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Store Status</h5>

                    <small className="text-muted">Enable or disable this store.</small>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
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
                      {formData.status === 'active' ? 'Active' : 'inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

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
                    Update Store
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

export default EditStoreDrawer
