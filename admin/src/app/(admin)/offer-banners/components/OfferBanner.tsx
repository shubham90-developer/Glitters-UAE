'use client'

import React from 'react'

import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddOfferBannerDrawer from './AddOfferBannerDrawer'
import EditOfferBannerDrawer from './EditOfferBannerDrawer'

import { useDeleteOfferBannerMutation, useGetOfferBannerQuery } from '@/store/offerBannerApi'

const OfferBanner = () => {
  const { data: offerBanner = [], isLoading, isError } = useGetOfferBannerQuery()

  const [deleteOfferBanner, { isLoading: isDeleting }] = useDeleteOfferBannerMutation()

  // ============================================
  // SINGLE DELETE
  // ============================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Offer Banner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteOfferBanner(id).unwrap()

      toast.success('Offer Banner deleted successfully')
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
      <div className="py-4 text-center">
        <div className="spinner-border text-primary" role="status" />

        <div className="mt-2">Loading offer banners...</div>
      </div>
    )
  }

  // ============================================
  // ERROR
  // ============================================

  if (isError) {
    return <div className="py-4 text-center text-danger">Failed to load offer banners.</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* ======================================
              HEADER
          ====================================== */}

          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <CardTitle as="h4" className="mb-0">
              All Offer Banner List
            </CardTitle>

            <AddOfferBannerDrawer />
          </div>

          {/* ======================================
              BODY
          ====================================== */}

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th className="text-nowrap">Sr No.</th>

                    <th className="text-nowrap">Category</th>

                    <th className="text-nowrap">Sub-Category</th>

                    <th className="text-nowrap">Redirect URL</th>

                    <th className="text-nowrap">Banner</th>

                    <th className="text-nowrap">Status</th>

                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {offerBanner.length ? (
                    offerBanner.map((item, idx) => {
                      const categoryName = typeof item.category === 'object' ? item.category?.categoryName || '-' : item.category || '-'

                      const subCategoryName =
                        typeof item.subCategory === 'object' ? item.subCategory?.subCategoryName || '-' : item.subCategory || '-'

                      return (
                        <tr key={item._id}>
                          {/* SR NO */}

                          <td>{idx + 1}</td>

                          {/* CATEGORY */}

                          <td>{typeof item.category === 'object' ? item.category?.categoryName || '-' : '-'}</td>

                          <td>{typeof item.subCategory === 'object' ? item.subCategory?.subCategoryName || '-' : '-'}</td>

                          {/* REDIRECT URL */}

                          <td
                            style={{
                              maxWidth: '280px',
                            }}>
                            {item.redirectUrl ? (
                              <span
                                className="d-inline-block text-truncate"
                                style={{
                                  maxWidth: '260px',
                                }}
                                title={item.redirectUrl}>
                                {item.redirectUrl}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>

                          {/* BANNER */}

                          <td>
                            {item.offerBannerImg ? (
                              <Image
                                src={item.offerBannerImg}
                                width={120}
                                height={70}
                                alt="Offer Banner"
                                className="rounded object-fit-contain"
                                style={{
                                  width: '120px',
                                  height: '70px',
                                  objectFit: 'contain',
                                }}
                              />
                            ) : (
                              <span className="text-muted">No Banner</span>
                            )}
                          </td>

                          {/* STATUS */}

                          <td>
                            <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                              {item.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td>
                            <div className="d-flex gap-2">
                              <EditOfferBannerDrawer item={item} />

                              <button
                                type="button"
                                disabled={isDeleting}
                                className="btn btn-soft-danger btn-sm"
                                onClick={() => handleDelete(item._id)}>
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default OfferBanner
