'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreateSEOPagesMutation, useGetSEOPagesQuery, useUpdateSEOPagesMutation } from '@/store/seoPages'

type Status = 'active' | 'inactive'

const Seo = () => {
  // ============================================
  // API
  // ============================================

  const { data: seoPagesData = [], isLoading, isError, refetch } = useGetSEOPagesQuery()

  const [createSeoPages, { isLoading: isCreating }] = useCreateSEOPagesMutation()

  const [updateSeoPages, { isLoading: isUpdating }] = useUpdateSEOPagesMutation()

  // ============================================
  // EXISTING DATA
  // ============================================

  const seoPage = seoPagesData?.[0]

  // ============================================
  // STATUS
  // ============================================

  const [status, setStatus] = useState<Status>('active')

  // ============================================
  // NEW FILES
  // ============================================

  const [productListImages, setProductListImages] = useState<File[]>([])

  const [wishListImages, setWishListImages] = useState<File[]>([])

  // ============================================
  // NEW FILE PREVIEWS
  // ============================================

  const [productListPreviews, setProductListPreviews] = useState<string[]>([])

  const [wishListPreviews, setWishListPreviews] = useState<string[]>([])

  // ============================================
  // EXISTING IMAGES
  // ============================================

  const [existingProductImages, setExistingProductImages] = useState<string[]>([])

  const [existingWishListImages, setExistingWishListImages] = useState<string[]>([])

  // ============================================
  // SET EXISTING DATA
  // ============================================

  useEffect(() => {
    if (!seoPage) {
      return
    }

    setStatus(seoPage.status === 'inactive' ? 'inactive' : 'active')

    setExistingProductImages(seoPage.productListBgImages || [])

    setExistingWishListImages(seoPage.wishListBgImages || [])
  }, [seoPage])

  // ============================================
  // PRODUCT IMAGES
  // ============================================

  const handleProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    const invalid = selectedFiles.find((file) => !file.type.startsWith('image/'))

    if (invalid) {
      toast.error('Please select only image files')

      return
    }

    setProductListImages(selectedFiles)

    const previews = selectedFiles.map((file) => URL.createObjectURL(file))

    setProductListPreviews(previews)
  }

  // ============================================
  // WISHLIST IMAGES
  // ============================================

  const handleWishListImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    const invalid = selectedFiles.find((file) => !file.type.startsWith('image/'))

    if (invalid) {
      toast.error('Please select only image files')

      return
    }

    setWishListImages(selectedFiles)

    const previews = selectedFiles.map((file) => URL.createObjectURL(file))

    setWishListPreviews(previews)
  }

  // ============================================
  // REMOVE NEW PRODUCT IMAGE
  // ============================================

  const removeProductImage = (index: number) => {
    setProductListImages((prev) => prev.filter((_, i) => i !== index))

    setProductListPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // ============================================
  // REMOVE NEW WISHLIST IMAGE
  // ============================================

  const removeWishListImage = (index: number) => {
    setWishListImages((prev) => prev.filter((_, i) => i !== index))

    setWishListPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // ============================================
  // STATUS
  // ============================================

  const handleStatus = () => {
    setStatus((prev) => (prev === 'active' ? 'inactive' : 'active'))
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const form = new FormData()

      // SAME KEY MULTIPLE TIMES
      productListImages.forEach((file) => {
        form.append('productListBgImages', file)
      })

      wishListImages.forEach((file) => {
        form.append('wishListBgImages', file)
      })

      form.append('status', status)

      if (seoPage?._id) {
        await updateSeoPages({
          id: seoPage._id,
          data: form,
        }).unwrap()

        toast.success('SEO Pages updated successfully')
      } else {
        await createSeoPages(form).unwrap()

        toast.success('SEO Pages created successfully')
      }

      // CLEAR ONLY NEW FILES

      setProductListImages([])

      setWishListImages([])

      setProductListPreviews([])

      setWishListPreviews([])

      await refetch()
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading SEO Pages...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load SEO Pages</div>
  }

  const isSaving = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        {/* ========================================
            PRODUCT LIST BACKGROUND IMAGES
        ======================================== */}

        <Col xl={12}>
          <Card className="mb-3">
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Product List Background Images
              </CardTitle>
            </CardHeader>

            <CardBody>
              <div className="mb-3">
                <label className="form-label">Upload Multiple Images</label>

                <input type="file" className="form-control" accept="image/*" multiple onChange={handleProductImages} />

                <small className="text-muted">You can select multiple images at once.</small>
              </div>

              {/* EXISTING */}

              {existingProductImages.length > 0 && (
                <>
                  <h6 className="mb-3">Existing Images</h6>

                  <Row>
                    {existingProductImages.map((image, index) => (
                      <Col md={3} sm={6} key={`${image}-${index}`}>
                        <div className="border rounded p-2 mb-3">
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            width={300}
                            height={150}
                            className="w-100 rounded object-fit-contain"
                            unoptimized
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {/* NEW */}

              {productListPreviews.length > 0 && (
                <>
                  <h6 className="mb-3 mt-2">New Images</h6>

                  <Row>
                    {productListPreviews.map((image, index) => (
                      <Col md={3} sm={6} key={`${image}-${index}`}>
                        <div className="position-relative border rounded p-2 mb-3">
                          <Image
                            src={image}
                            alt={`New Product ${index + 1}`}
                            width={300}
                            height={150}
                            className="w-100 rounded object-fit-contain"
                            unoptimized
                          />

                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeProductImage(index)}>
                            ×
                          </button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* ========================================
            WISHLIST BACKGROUND IMAGES
        ======================================== */}

        <Col xl={12}>
          <Card className="mb-3">
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Wishlist Background Images
              </CardTitle>
            </CardHeader>

            <CardBody>
              <div className="mb-3">
                <label className="form-label">Upload Multiple Images</label>

                <input type="file" className="form-control" accept="image/*" multiple onChange={handleWishListImages} />

                <small className="text-muted">You can select multiple images at once.</small>
              </div>

              {/* EXISTING */}

              {existingWishListImages.length > 0 && (
                <>
                  <h6 className="mb-3">Existing Images</h6>

                  <Row>
                    {existingWishListImages.map((image, index) => (
                      <Col md={3} sm={6} key={`${image}-${index}`}>
                        <div className="border rounded p-2 mb-3">
                          <Image
                            src={image}
                            alt={`Wishlist ${index + 1}`}
                            width={300}
                            height={150}
                            className="w-100 rounded object-fit-contain"
                            unoptimized
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {/* NEW */}

              {wishListPreviews.length > 0 && (
                <>
                  <h6 className="mb-3 mt-2">New Images</h6>

                  <Row>
                    {wishListPreviews.map((image, index) => (
                      <Col md={3} sm={6} key={`${image}-${index}`}>
                        <div className="position-relative border rounded p-2 mb-3">
                          <Image
                            src={image}
                            alt={`New Wishlist ${index + 1}`}
                            width={300}
                            height={150}
                            className="w-100 rounded object-fit-contain"
                            unoptimized
                          />

                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                            onClick={() => removeWishListImage(index)}>
                            ×
                          </button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* ========================================
            STATUS
        ======================================== */}

        <Col xl={12}>
          <Card className="mb-3">
            <CardHeader>
              <CardTitle as="h4" className="mb-0">
                Status
              </CardTitle>
            </CardHeader>

            <CardBody>
              <div className="d-flex align-items-center gap-3">
                <div className="form-check form-switch mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={status === 'active'}
                    onChange={handleStatus}
                    style={{
                      width: '46px',

                      height: '24px',
                    }}
                  />
                </div>

                <span className={`badge ${status === 'active' ? 'bg-success' : 'bg-danger'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* ========================================
            SAVE
        ======================================== */}

        <Col xl={12}>
          <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
            {isSaving ? 'Saving...' : seoPage?._id ? 'Update SEO Pages' : 'Create SEO Pages'}
          </button>
        </Col>
      </Row>
    </form>
  )
}

export default Seo
