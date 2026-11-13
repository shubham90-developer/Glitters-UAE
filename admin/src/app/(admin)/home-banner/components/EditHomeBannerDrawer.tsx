'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'
import { useGetHomeBannerByIdQuery, useUpdateHomeBannerMutation } from '@/store/homeBanner'
import Image from 'next/image'

const EditHomeBannerDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  const { data: homeBannerData, isLoading } = useGetHomeBannerByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateHomeBanner] = useUpdateHomeBannerMutation()

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    shortDesc: '',
    bgVideo: null as File | null,
  })

  const [preview, setPreview] = useState<string>('')
  const [previewType, setPreviewType] = useState<'image' | 'video' | ''>('')

  // ============================================
  // LOAD EXISTING DATA
  // ============================================

  useEffect(() => {
    if (homeBannerData) {
      setFormData({
        title: homeBannerData?.title || '',
        subTitle: homeBannerData?.subTitle || '',
        shortDesc: homeBannerData?.shortDesc || '',
        bgVideo: null,
      })

      // Existing media preview
      const existingMedia = homeBannerData?.bgVideo || homeBannerData?.banner || ''

      if (existingMedia) {
        setPreview(existingMedia)

        // simple extension detection
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']

        const isVideo = videoExtensions.some((ext) => existingMedia.toLowerCase().includes(ext))

        setPreviewType(isVideo ? 'video' : 'image')
      }
    }
  }, [homeBannerData])

  // ============================================
  // CLEANUP OBJECT URL
  // ============================================

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // ============================================
  // INPUT CHANGE
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // FILE CHANGE + PREVIEW
  // ============================================

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

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = new FormData()

      data.append('title', formData.title)
      data.append('subTitle', formData.subTitle)
      data.append('shortDesc', formData.shortDesc)

      if (formData.bgVideo) {
        data.append('bgVideo', formData.bgVideo)
      }

      await updateHomeBanner({
        id: item._id,
        data,
      }).unwrap()

      toast.success('Banner updated successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
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
          <h5 className="mb-0 fw-bold">Edit Home Banner</h5>

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

export default EditHomeBannerDrawer
