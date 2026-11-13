'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import AddHomeDrawer from './AddHomeDrawer'
import EditHomeBannerDrawer from './EditHomeBannerDrawer'
import { useDeleteHomeBannerMutation, useGetHomeBannerQuery } from '@/store/homeBanner'

const isVideoUrl = (url?: string) => !!url && /\.mp4($|\?)/i.test(url)

const HomeBanner = () => {
  const { data: homeBanner = [], isLoading, isError } = useGetHomeBannerQuery()
  const [deleteHomeBanner] = useDeleteHomeBannerMutation()

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Home Banner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteHomeBanner(id).unwrap()
      toast.success('Home Banner deleted successfully')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading banners</div>

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Home Banner List</CardTitle>
            {/* list refreshes via RTK tag invalidation, so no onAdd needed */}
            <AddHomeDrawer />
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Banner</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {homeBanner.length ? (
                    homeBanner.map((item, idx) => {
                      const mediaUrl = item.bgVideo || item.banner

                      return (
                        <tr key={item._id}>
                          <td>{idx + 1}</td>
                          <td>
                            {!mediaUrl ? (
                              <span>No Media</span>
                            ) : isVideoUrl(mediaUrl) ? (
                              <video src={mediaUrl} width={120} height={70} muted controls playsInline className="rounded" />
                            ) : (
                              // plain <img>: avoids next/image remotePatterns config for Cloudinary
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={mediaUrl}
                                alt={item.title || 'Banner'}
                                width={120}
                                height={70}
                                className="rounded"
                                style={{ objectFit: 'contain' }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <EditHomeBannerDrawer item={item} />
                              <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
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

export default HomeBanner