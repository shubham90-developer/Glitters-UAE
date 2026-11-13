'use client'

import React, { FormEvent, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateAppBannerMutation } from '@/store/appBannerApi'

const AddAppBannerDrawer = () => {
  const [open, setOpen] = useState(false)

  const [bannerImage, setBannerImage] = useState<File | null>(null)

  const [preview, setPreview] = useState<string>('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [addBanner, { isLoading }] = useCreateAppBannerMutation()

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

    setBannerImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setBannerImage(null)
    setPreview('')
    setStatus('active')
  }

  const handleClose = () => {
    if (isLoading) {
      return
    }

    resetForm()
    setOpen(false)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!bannerImage) {
      toast.error('App Banner image is required.')
      return
    }

    try {
      const formData = new FormData()

      /*
        IMPORTANT:
        Multer must use the same field name:
        upload.single('AppBanner')
      */
      formData.append('AppBanner', bannerImage)

      formData.append('status', status)

      await addBanner(formData).unwrap()

      toast.success('App Banner added successfully')

      resetForm()
      setOpen(false)
    } catch (error: any) {
      console.error('App Banner Error:', error)

      toast.error(error?.data?.message || 'Unable to add App Banner')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add App Banner
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
            <h5 className="mb-1 fw-bold">Add App Banner</h5>

            <small className="text-muted">Upload application banner</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}
            disabled={isLoading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* APP BANNER */}
              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    App Banner
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                </div>
              </Col>

              {/* PREVIEW */}
              {preview && (
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Preview</label>

                    <div className="border rounded p-2">
                      <Image
                        src={preview}
                        alt="App Banner Preview"
                        width={450}
                        height={220}
                        unoptimized
                        className="w-100 rounded"
                        style={{
                          height: '220px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                </Col>
              )}

              {/* STATUS */}
              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>

                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}>
                    <option value="active">Active</option>

                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
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

export default AddAppBannerDrawer
