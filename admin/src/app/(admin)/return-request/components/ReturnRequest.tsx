'use client'

import React, { useMemo, useState } from 'react'

import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { IReturnRequest, useDeleteReturnRequestMutation, useGetReturnRequestQuery, useUpdateReturnRequestMutation } from '@/store/returnRequestApi'

// =====================================================
// COMPONENT
// =====================================================

const ReturnRequest = () => {
  // ===================================================
  // API
  // ===================================================

  const { data: returnRequests = [], isLoading, isError } = useGetReturnRequestQuery()

  const [deleteReturnRequest, { isLoading: deleting }] = useDeleteReturnRequestMutation()

  const [updateReturnRequest, { isLoading: updating }] = useUpdateReturnRequestMutation()

  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] = useState('')

  // ===================================================
  // PAGINATION
  // ===================================================

  const [currentPage, setCurrentPage] = useState(1)

  const [perPage, setPerPage] = useState(10)

  // ===================================================
  // SELECT
  // ===================================================

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ===================================================
  // FILTER
  // ===================================================

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return returnRequests
    }

    return returnRequests.filter((item: IReturnRequest) => {
      const productName = typeof item.product === 'object' ? item.product?.productName || '' : item.product || ''

      return (
        item.orderNumber?.toLowerCase().includes(query) ||
        item.emailAddress?.toLowerCase().includes(query) ||
        item.reason?.toLowerCase().includes(query) ||
        item.additionalDetails?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        productName.toLowerCase().includes(query)
      )
    })
  }, [returnRequests, search])

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.ceil(filteredData.length / perPage)

  const startIndex = (currentPage - 1) * perPage

  const paginatedData = filteredData.slice(startIndex, startIndex + perPage)

  // ===================================================
  // SEARCH CHANGE
  // ===================================================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ===================================================
  // SELECT ONE
  // ===================================================

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, id])])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // ===================================================
  // SELECT ALL CURRENT PAGE
  // ===================================================

  const currentPageIds = paginatedData.map((item) => item._id)

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    } else {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  // ===================================================
  // DELETE ONE
  // ===================================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this return request?',
      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete it!',

      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteReturnRequest(id).unwrap()

      setSelectedIds((prev) => prev.filter((item) => item !== id))

      toast.success('Return request deleted successfully')
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // BULK DELETE
  // ===================================================

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      toast.warning('Please select at least one return request')

      return
    }

    const result = await Swal.fire({
      title: 'Delete selected requests?',

      text: `You are about to delete ${selectedIds.length} selected return request${selectedIds.length > 1 ? 's' : ''}.`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete selected',

      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await Promise.all(selectedIds.map((id) => deleteReturnRequest(id).unwrap()))

      toast.success(`${selectedIds.length} return request${selectedIds.length > 1 ? 's' : ''} deleted successfully`)

      setSelectedIds([])

      if (paginatedData.length === selectedIds.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Bulk delete failed')
    }
  }

  // ===================================================
  // STATUS UPDATE
  // ===================================================

  const handleStatusChange = async (item: IReturnRequest, status: 'pending' | 'approved' | 'rejected' | 'received' | 'refunded') => {
    try {
      await updateReturnRequest({
        _id: item._id,

        data: {
          status,
        },
      }).unwrap()

      toast.success('Return request status updated successfully')
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Unable to update status')
    }
  }

  // ===================================================
  // CONFIRM UPDATE
  // ===================================================

  const handleConfirmChange = async (item: IReturnRequest, checked: boolean) => {
    try {
      await updateReturnRequest({
        _id: item._id,

        data: {
          isConfirmed: checked,
        },
      }).unwrap()

      toast.success('Confirmation updated successfully')
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Unable to update confirmation')
    }
  }

  // ===================================================
  // PAGE CHANGE
  // ===================================================

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return
    }

    setCurrentPage(page)
  }

  // ===================================================
  // PAGE NUMBERS
  // ===================================================

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - 2)

    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    const pages: number[] = []

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page)
    }

    return pages
  }, [currentPage, totalPages])

  // ===================================================
  // PRODUCT NAME
  // ===================================================

  const getProductName = (item: IReturnRequest) => {
    if (typeof item.product === 'object') {
      return item.product?.productName || '-'
    }

    return item.product || '-'
  }

  // ===================================================
  // STATUS BADGE
  // ===================================================

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success'

      case 'rejected':
        return 'bg-danger'

      case 'received':
        return 'bg-info'

      case 'refunded':
        return 'bg-primary'

      case 'pending':
      default:
        return 'bg-warning text-dark'
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading Return Requests...</div>
      </div>
    )
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load Return Requests.</div>
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* =========================================
              HEADER
          ========================================= */}

          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <CardTitle as="h4" className="mb-1">
                All Return Request List
              </CardTitle>

              <small className="text-muted">Total {filteredData.length} return requests</small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* BULK DELETE */}

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  disabled={deleting}
                  onClick={handleBulkDelete}>
                  <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}

              {/* PER PAGE */}

              <select
                className="form-select form-select-sm"
                style={{
                  width: '80px',
                }}
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value))

                  setCurrentPage(1)
                }}>
                <option value={5}>5</option>

                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>
              </select>

              {/* SEARCH */}

              <div className="position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search return requests..."
                  autoComplete="off"
                  value={search}
                  onChange={handleSearch}
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
            </div>
          </div>

          <CardBody>
            {/* =========================================
                TABLE
            ========================================= */}

            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th
                      className="text-center"
                      style={{
                        width: 45,
                      }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isAllCurrentPageSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>

                    <th className="text-nowrap">Sr No.</th>

                    <th className="text-nowrap">Product</th>

                    <th className="text-nowrap">Order Number</th>

                    <th className="text-nowrap">Email Address</th>

                    <th className="text-nowrap">Reason</th>

                    <th className="text-nowrap">Additional Details</th>

                    <th className="text-nowrap">Confirmed</th>

                    <th className="text-nowrap">Status</th>

                    <th className="text-nowrap">Date</th>

                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length ? (
                    paginatedData.map((item, idx) => (
                      <tr key={item._id}>
                        {/* CHECKBOX */}

                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedIds.includes(item._id)}
                            onChange={(e) => handleSelectOne(item._id, e.target.checked)}
                          />
                        </td>

                        {/* SR NO */}

                        <td>{startIndex + idx + 1}</td>

                        {/* PRODUCT */}

                        <td
                          style={{
                            minWidth: '160px',
                          }}>
                          <span className="fw-medium">{getProductName(item)}</span>
                        </td>

                        {/* ORDER NUMBER */}

                        <td>
                          <span className="fw-medium">{item.orderNumber || '-'}</span>
                        </td>

                        {/* EMAIL */}

                        <td>{item.emailAddress || '-'}</td>

                        {/* REASON */}

                        <td
                          style={{
                            minWidth: '180px',
                            maxWidth: '240px',
                          }}>
                          <div className="text-truncate" title={item.reason}>
                            {item.reason || '-'}
                          </div>
                        </td>

                        {/* DETAILS */}

                        <td
                          style={{
                            minWidth: '220px',
                            maxWidth: '300px',
                          }}>
                          <div className="text-truncate" title={item.additionalDetails}>
                            {item.additionalDetails || '-'}
                          </div>
                        </td>

                        {/* CONFIRMED */}

                        <td>
                          <div className="form-check form-switch mb-0">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={item.isConfirmed}
                              disabled={updating}
                              onChange={(e) => handleConfirmChange(item, e.target.checked)}
                            />
                          </div>
                        </td>

                        {/* STATUS */}

                        <td
                          style={{
                            minWidth: '160px',
                          }}>
                          <select
                            className={`form-select form-select-sm ${getStatusClass(item.status)}`}
                            value={item.status}
                            disabled={updating}
                            onChange={(e) => handleStatusChange(item, e.target.value as IReturnRequest['status'])}>
                            <option value="pending">Pending</option>

                            <option value="approved">Approved</option>

                            <option value="rejected">Rejected</option>

                            <option value="received">Received</option>

                            <option value="refunded">Refunded</option>
                          </select>
                        </td>

                        {/* DATE */}

                        <td className="text-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}</td>

                        {/* ACTION */}

                        <td>
                          <button type="button" className="btn btn-soft-danger btn-sm" disabled={deleting} onClick={() => handleDelete(item._id)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center py-4">
                        {search ? 'No matching return requests found' : 'No return requests found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =========================================
                PAGINATION
            ========================================= */}

            {filteredData.length > 0 && (
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
                <div className="text-muted small">
                  Showing {startIndex + 1} to {Math.min(startIndex + perPage, filteredData.length)} of {filteredData.length} entries
                </div>

                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      {/* PREVIOUS */}

                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                          Previous
                        </button>
                      </li>

                      {/* FIRST */}

                      {pageNumbers[0] > 1 && (
                        <>
                          <li className="page-item">
                            <button type="button" className="page-link" onClick={() => handlePageChange(1)}>
                              1
                            </button>
                          </li>

                          {pageNumbers[0] > 2 && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                        </>
                      )}

                      {/* NUMBERS */}

                      {pageNumbers.map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button type="button" className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* LAST */}

                      {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}

                          <li className="page-item">
                            <button type="button" className="page-link" onClick={() => handlePageChange(totalPages)}>
                              {totalPages}
                            </button>
                          </li>
                        </>
                      )}

                      {/* NEXT */}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          type="button"
                          className="page-link"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default ReturnRequest
