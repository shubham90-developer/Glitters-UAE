'use client'

import React, { FormEvent, useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetAppBannerByIdQuery, useUpdateAppBannerMutation } from '@/store/appBannerApi'

const EditAppBannerDrawer = ({ item }: { item: any }) => {
  const [open, setOpen] = useState(false)

  const [bannerImage, setBannerImage] = useState<File | null>(null)

  const [preview, setPreview] = useState<string>('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const {
    data: bannerResponse,
    isLoading: bannerLoading,
    isFetching,
    refetch,
  } = useGetAppBannerByIdQuery(
    // @ts-ignore
    {
      id: item?._id,
    },
    {
      skip: !item?._id,
    },
  )

  const [updateBanner, { isLoading: updateLoading }] = useUpdateAppBannerMutation()

  const bannerData = (bannerResponse as any)?.data ?? bannerResponse

  // =====================================================
  // SET EXISTING DATA
  // =====================================================

  useEffect(() => {
    if (!bannerData) {
      return
    }

    const currentImage = bannerData?.AppBanner || bannerData?.appBanner || bannerData?.img || ''

    setPreview(currentImage)

    setBannerImage(null)

    setStatus(String(bannerData?.status).toLowerCase() === 'inactive' ? 'inactive' : 'active')
  }, [bannerData])

  // =====================================================
  // OPEN DRAWER
  // =====================================================

  const handleOpen = () => {
    setOpen(true)

    if (item?._id) {
      refetch()
    }
  }

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')

      return
    }

    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    const objectUrl = URL.createObjectURL(file)

    setBannerImage(file)

    setPreview(objectUrl)
  }

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusToggle = () => {
    setStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
  }

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (updateLoading) {
      return
    }

    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    const oldImage = bannerData?.AppBanner || bannerData?.appBanner || bannerData?.img || ''

    setPreview(oldImage)

    setBannerImage(null)

    setStatus(String(bannerData?.status).toLowerCase() === 'inactive' ? 'inactive' : 'active')

    setOpen(false)
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!item?._id) {
      toast.error('App Banner id is missing.')

      return
    }

    try {
      const formData = new FormData()

      // New image is optional
      if (bannerImage) {
        formData.append('AppBanner', bannerImage)
      }

      formData.append('status', status)

      await updateBanner({
        id: item._id,
        data: formData,
      }).unwrap()

      toast.success('App Banner updated successfully')

      await refetch()

      setBannerImage(null)

      setOpen(false)
    } catch (error: any) {
      console.error('Update App Banner Error:', error)

      toast.error(error?.data?.message || error?.error || error?.message || 'Unable to update App Banner')
    }
  }

  return (
    <>
      {/* EDIT BUTTON */}

      <button
        type="button"
        className="btn btn-soft-dark btn-sm d-flex align-items-center justify-content-center"
        title="Edit App Banner"
        onClick={handleOpen}>
        <IconifyIcon icon="solar:pen-2-broken" width={18} />
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

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Edit App Banner</h5>

            <small className="text-muted">Update banner image and status</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            disabled={updateLoading}
            onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            {(bannerLoading || isFetching) && (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" />
                Loading banner...
              </div>
            )}

            <Row>
              {/* IMAGE INPUT */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">App Banner</label>

                  <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />

                  <small className="text-muted">Leave blank if you want to keep the current image.</small>
                </div>
              </Col>

              {/* IMAGE PREVIEW */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">App Banner Preview</label>

                  {preview ? (
                    <div
                      className="border rounded p-2"
                      style={{
                        background: '#f8f9fa',
                      }}>
                      <Image
                        src={preview}
                        alt="App Banner Preview"
                        width={500}
                        height={250}
                        unoptimized
                        className="w-100 rounded"
                        style={{
                          width: '100%',
                          height: '220px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="border rounded d-flex align-items-center justify-content-center text-muted"
                      style={{
                        height: '220px',

                        background: '#f8f9fa',
                      }}>
                      <div className="text-center">
                        <IconifyIcon icon="solar:gallery-broken" width={42} />

                        <div className="mt-2">No image available</div>
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* STATUS */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label d-block fw-semibold">Status</label>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`statusToggle-${item?._id}`}
                        checked={status === 'active'}
                        onChange={handleStatusToggle}
                      />

                      <label className="form-check-label" htmlFor={`statusToggle-${item?._id}`}>
                        {status === 'active' ? 'Active' : 'Inactive'}
                      </label>
                    </div>

                    <span className={`badge ${status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}

          <div className="p-3 border-top bg-white d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={updateLoading}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={updateLoading || bannerLoading}>
              {updateLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
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
      </div>
    </>
  )
}

export default EditAppBannerDrawer
