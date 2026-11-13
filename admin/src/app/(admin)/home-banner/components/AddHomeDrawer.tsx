'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'
import { useCreateHomeBannerMutation } from '@/store/homeBanner'
import Image from 'next/image'

const ALLOWED_TYPES = ['video/mp4', 'image/png']

const AddHomeDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)
 const [preview, setPreview] = useState<string>('')
const [previewType, setPreviewType] = useState<'image' | 'video' | ''>('')
  // api
  const [createHomeBanner] = useCreateHomeBannerMutation()

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    shortDesc: '',
    bgVideo: null as File | null,
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // revoke previous local preview
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setFormData((prev) => ({
      ...prev,
      bgVideo: file,
    }))

    const previewUrl = URL.createObjectURL(file)

    setPreview(previewUrl)

    if (file.type.startsWith('video/')) {
      setPreviewType('video')
    } else if (file.type.startsWith('image/')) {
      setPreviewType('image')
    } else {
      setPreviewType('')
      toast.error('Please select a valid image or video file')
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = new FormData()

      payload.append('title', formData.title)
      payload.append('subTitle', formData.subTitle)
      payload.append('shortDesc', formData.shortDesc)

      if (formData.bgVideo) {
        payload.append('bgVideo', formData.bgVideo)
      }

      await createHomeBanner(payload).unwrap()

      toast.success('Home Banner created successfully')
      setOpen(false)
      onAdd()

      setFormData({
        title: '',
        subTitle: '',
        shortDesc: '',
        bgVideo: null,
      })
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
        Add Home Banner
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
          <h5 className="mb-0 fw-bold">Add Home Banner</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

      <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* MEDIA PREVIEW */}

              {preview && (
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Current Preview</label>

                    <div
                      className="border rounded p-2 bg-light"
                      style={{
                        width: '100%',
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                      {previewType === 'video' && (
                        <video
                          src={preview}
                          controls
                          muted
                          playsInline
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      )}

                      {previewType === 'image' && (
                        <Image
                          src={preview}
                          alt="Banner preview"
                          width={0}
                          height={0}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              )}

              {/* FILE INPUT */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">Banner Image / Video</label>

                  <input type="file" accept="image/*,video/*" className="form-control" onChange={handleFile} />

                  <small className="text-muted">Select image or video to replace current banner.</small>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              <IconifyIcon icon="solar:diskette-broken" />
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddHomeDrawer