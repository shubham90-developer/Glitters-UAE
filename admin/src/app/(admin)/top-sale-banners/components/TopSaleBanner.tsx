'use client'

import React, { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreateTopSaleBannerMutation, useGetTopSaleBannerQuery, useUpdateTopSaleBannerMutation } from '@/store/topSaleBannerApi'

// ============================================
// TYPES
// ============================================

type BannerField = 'offerBannerImg1' | 'offerBannerImg2' | 'offerBannerImg3'

type LinkField = 'offerBannerLink1' | 'offerBannerLink2' | 'offerBannerLink3'

type BannerFiles = {
  offerBannerImg1: File | null
  offerBannerImg2: File | null
  offerBannerImg3: File | null
}

type BannerPreviews = {
  offerBannerImg1: string
  offerBannerImg2: string
  offerBannerImg3: string
}

type BannerLinks = {
  offerBannerLink1: string
  offerBannerLink2: string
  offerBannerLink3: string
}

// maps each image field to its link field
const LINK_FOR: Record<BannerField, LinkField> = {
  offerBannerImg1: 'offerBannerLink1',
  offerBannerImg2: 'offerBannerLink2',
  offerBannerImg3: 'offerBannerLink3',
}

// ============================================
// COMPONENT
// ============================================

const TopSaleBanner = () => {
  // ============================================
  // GET API
  // ============================================

  const { data: topSaleBannerData, isLoading, isError, refetch } = useGetTopSaleBannerQuery()

  // ============================================
  // CREATE API
  // ============================================

  const [createTopSaleBanner, { isLoading: creating }] = useCreateTopSaleBannerMutation()

  // ============================================
  // UPDATE API
  // ============================================

  const [updateTopSaleBanner, { isLoading: updating }] = useUpdateTopSaleBannerMutation()

  // ============================================
  // NORMALIZE API RESPONSE
  // ============================================

  const topSaleData = useMemo(() => {
    const response: any = topSaleBannerData

    if (!response) {
      return null
    }

    // { data: [...] }
    if (Array.isArray(response?.data)) {
      return response.data[0] || null
    }

    // { data: {} }
    if (response?.data && typeof response.data === 'object') {
      return response.data
    }

    // direct array
    if (Array.isArray(response)) {
      return response[0] || null
    }

    // direct object
    return response
  }, [topSaleBannerData])

  // ============================================
  // FILE STATE
  // ============================================

  const [files, setFiles] = useState<BannerFiles>({
    offerBannerImg1: null,
    offerBannerImg2: null,
    offerBannerImg3: null,
  })

  // ============================================
  // PREVIEW STATE
  // ============================================

  const [previews, setPreviews] = useState<BannerPreviews>({
    offerBannerImg1: '',
    offerBannerImg2: '',
    offerBannerImg3: '',
  })

  // ============================================
  // LINK STATE
  // ============================================

  const [links, setLinks] = useState<BannerLinks>({
    offerBannerLink1: '',
    offerBannerLink2: '',
    offerBannerLink3: '',
  })

  // ============================================
  // LOAD EXISTING DATA FOR UPDATE
  // ============================================

  useEffect(() => {
    if (!topSaleData) {
      setPreviews({
        offerBannerImg1: '',
        offerBannerImg2: '',
        offerBannerImg3: '',
      })

      setLinks({
        offerBannerLink1: '',
        offerBannerLink2: '',
        offerBannerLink3: '',
      })

      return
    }

    setPreviews({
      offerBannerImg1: topSaleData?.offerBannerImg1 || '',

      offerBannerImg2: topSaleData?.offerBannerImg2 || '',

      offerBannerImg3: topSaleData?.offerBannerImg3 || '',
    })

    setLinks({
      offerBannerLink1: topSaleData?.offerBannerLink1 || '',
      offerBannerLink2: topSaleData?.offerBannerLink2 || '',
      offerBannerLink3: topSaleData?.offerBannerLink3 || '',
    })

    setFiles({
      offerBannerImg1: null,
      offerBannerImg2: null,
      offerBannerImg3: null,
    })
  }, [topSaleData])

  // ============================================
  // FILE CHANGE
  // ============================================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    const name = e.target.name as BannerField

    if (!file) return

    // ============================================
    // IMAGE TYPE CHECK
    // ============================================

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select PNG, JPG, JPEG or WEBP image')

      e.target.value = ''
      return
    }

    // ============================================
    // IMAGE SIZE CHECK
    // ============================================

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')

      e.target.value = ''
      return
    }

    // ============================================
    // REMOVE OLD LOCAL BLOB
    // ============================================

    const oldPreview = previews[name]

    if (oldPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(oldPreview)
    }

    // ============================================
    // SET FILE
    // ============================================

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }))

    // ============================================
    // SET PREVIEW
    // ============================================

    setPreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }))
  }

  // ============================================
  // REMOVE SELECTED NEW IMAGE
  // ============================================

  const handleRemoveImage = (field: BannerField) => {
    const current = previews[field]

    if (current?.startsWith('blob:')) {
      URL.revokeObjectURL(current)
    }

    // remove selected file
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }))

    // restore old DB image
    setPreviews((prev) => ({
      ...prev,
      [field]: topSaleData?.[field] || '',
    }))

    const input = document.getElementById(field) as HTMLInputElement | null

    if (input) {
      input.value = ''
    }
  }

  // ============================================
  // RESET FILE INPUTS
  // ============================================

  const resetFileInputs = () => {
    setFiles({
      offerBannerImg1: null,
      offerBannerImg2: null,
      offerBannerImg3: null,
    })
    ;['offerBannerImg1', 'offerBannerImg2', 'offerBannerImg3'].forEach((id) => {
      const input = document.getElementById(id) as HTMLInputElement | null

      if (input) {
        input.value = ''
      }
    })
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // ============================================
    // CREATE VALIDATION
    // ============================================

    if (!topSaleData?._id) {
      if (!files.offerBannerImg1) {
        toast.error('Banner 1 is required')
        return
      }

      if (!files.offerBannerImg2) {
        toast.error('Banner 2 is required')
        return
      }

      if (!files.offerBannerImg3) {
        toast.error('Banner 3 is required')
        return
      }
    }

    // ============================================
    // UPDATE VALIDATION
    // ============================================

    const linksChanged =
      links.offerBannerLink1 !== (topSaleData?.offerBannerLink1 || '') ||
      links.offerBannerLink2 !== (topSaleData?.offerBannerLink2 || '') ||
      links.offerBannerLink3 !== (topSaleData?.offerBannerLink3 || '')

    if (topSaleData?._id && !files.offerBannerImg1 && !files.offerBannerImg2 && !files.offerBannerImg3 && !linksChanged) {
      toast.info('Please change at least one banner or link to update')
      return
    }

    try {
      const form = new FormData()

      // ============================================
      // ONLY NEW/CHANGED IMAGES SEND
      // ============================================

      if (files.offerBannerImg1) {
        form.append('offerBannerImg1', files.offerBannerImg1)
      }

      if (files.offerBannerImg2) {
        form.append('offerBannerImg2', files.offerBannerImg2)
      }

      if (files.offerBannerImg3) {
        form.append('offerBannerImg3', files.offerBannerImg3)
      }

      // ============================================
      // LINKS (sent as text fields)
      // ============================================

      form.append('offerBannerLink1', links.offerBannerLink1.trim())
      form.append('offerBannerLink2', links.offerBannerLink2.trim())
      form.append('offerBannerLink3', links.offerBannerLink3.trim())

      // ============================================
      // UPDATE
      // ============================================

      if (topSaleData?._id) {
        await updateTopSaleBanner({
          id: topSaleData._id,
          data: form,
        }).unwrap()

        toast.success('Top Sale Banners updated successfully')
      }

      // ============================================
      // CREATE
      // ============================================
      else {
        await createTopSaleBanner(form).unwrap()

        toast.success('Top Sale Banners created successfully')
      }

      resetFileInputs()

      await refetch()
    } catch (error: any) {
      console.error('Top Sale Banner Error:', error)

      toast.error(error?.data?.message || error?.error || 'Something went wrong')
    }
  }

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />

        <div className="mt-2">Loading Top Sale Banners...</div>
      </div>
    )
  }

  // ============================================
  // ERROR
  // ============================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load Top Sale Banners.</div>
  }

  // ============================================
  // REUSABLE BANNER BLOCK
  // ============================================

  const renderBanner = (field: BannerField, label: string) => {
    const linkField = LINK_FOR[field]

    return (
      <Col xl={4} lg={4} md={6} sm={12}>
        <div className="h-100">
          <label className="form-label fw-semibold">
            {label}
            {!topSaleData?._id && <span className="text-danger ms-1">*</span>}
          </label>

          <input
            id={field}
            type="file"
            name={field}
            className="form-control"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
          />

          {previews[field] ? (
            <div className="mt-3">
              <div className="border rounded p-2 bg-light">
                <Image
                  src={previews[field]}
                  alt={label}
                  width={600}
                  height={300}
                  unoptimized
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>

              {files[field] && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small className="text-muted text-truncate">{files[field]?.name}</small>

                  <button type="button" className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => handleRemoveImage(field)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="border rounded bg-light mt-3 d-flex align-items-center justify-content-center text-muted"
              style={{
                height: '200px',
              }}>
              No Banner
            </div>
          )}

          {/* LINK FIELD */}
          <div className="mt-3">
            <label className="form-label fw-semibold">Redirect Link (optional)</label>

            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/offer"
              value={links[linkField]}
              onChange={(e) =>
                setLinks((prev) => ({
                  ...prev,
                  [linkField]: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </Col>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {/* ============================================
            HEADER
        ============================================ */}

        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            {topSaleData?._id ? 'Update Top Sale Banners' : 'Add Top Sale Banners'}
          </CardTitle>
        </CardHeader>

        {/* ============================================
            BODY
        ============================================ */}

        <CardBody>
          <Row className="g-4">
            {renderBanner('offerBannerImg1', 'Banner 1')}
            {renderBanner('offerBannerImg2', 'Banner 2 (1500 × 500 px)')}
            {renderBanner('offerBannerImg3', 'Banner 3 (1500 × 500 px)')}
          </Row>

          {/* ============================================
              CREATE / UPDATE BUTTON
          ============================================ */}

          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100" disabled={creating || updating}>
              {creating || updating ? (topSaleData?._id ? 'Updating...' : 'Creating...') : topSaleData?._id ? 'Update Banners' : 'Add Banners'}
            </button>
          </div>
        </CardBody>
      </Card>
    </form>
  )
}

export default TopSaleBanner
