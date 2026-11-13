'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import Swal from 'sweetalert2'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddAppBannerDrawer from './AddAppBannerDrawer'
import EditAppBannerDrawer from './EditAppBannerDrawer'

import { useDeleteAppBannerMutation, useGetAppBannerQuery } from '@/store/appBannerApi'

type AppBannerItem = {
  _id: string
  AppBanner?: string
  appBanner?: string
  status?: 'active' | 'inactive'
  isDeleted?: boolean
}

const AppBanners = () => {
  const { data: appBannerResponse, isLoading, isError } = useGetAppBannerQuery()

  const [deleteAppBanner, { isLoading: isDeleting }] = useDeleteAppBannerMutation()

  const rawData = (appBannerResponse as any)?.data ?? appBannerResponse ?? []

  const appBanners: AppBannerItem[] = Array.isArray(rawData) ? rawData.filter((item: AppBannerItem) => !item.isDeleted) : rawData ? [rawData] : []

  const handleDelete = async (item: AppBannerItem) => {
    const result = await Swal.fire({
      title: 'Delete App Banner?',
      text: 'Are you sure you want to delete this app banner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteAppBanner(item._id).unwrap()

      await Swal.fire({
        title: 'Deleted!',
        text: 'App Banner deleted successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error: any) {
      await Swal.fire({
        title: 'Delete Failed',
        text: error?.data?.message || error?.message || 'Unable to delete app banner.',
        icon: 'error',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />

        <div className="text-muted mt-2">Loading app banners...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load app banners.</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-3">
            <CardTitle as="h4" className="mb-0">
              All App Banners List
            </CardTitle>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <AddAppBannerDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th
                      className="text-center"
                      style={{
                        width: '45px',
                        minWidth: '45px',
                      }}>
                      #
                    </th>

                    <th className="text-nowrap">Sr No.</th>

                    <th className="text-nowrap">App Banner</th>

                    <th className="text-nowrap">Status</th>

                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appBanners.length > 0 ? (
                    appBanners.map((item, index) => {
                      const bannerImage = item.AppBanner || item.appBanner || ''

                      const isActive = String(item.status).toLowerCase() === 'active'

                      return (
                        <tr key={item._id}>
                          <td className="text-center">
                            <input type="checkbox" className="form-check-input" />
                          </td>

                          <td>{index + 1}</td>

                          <td>
                            {bannerImage ? (
                              <Image
                                src={bannerImage}
                                alt="App Banner"
                                width={150}
                                height={80}
                                unoptimized
                                className="rounded border"
                                style={{
                                  width: '150px',
                                  height: '80px',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <div className="text-muted">No Image</div>
                            )}
                          </td>

                          <td>
                            <span className={`badge ${isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <EditAppBannerDrawer item={item} />

                              <button
                                type="button"
                                className="btn btn-soft-danger btn-sm"
                                title="Delete"
                                disabled={isDeleting}
                                onClick={() => handleDelete(item)}>
                                <IconifyIcon icon="solar:trash-bin-trash-bold" width={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No App Banner found.
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

export default AppBanners
