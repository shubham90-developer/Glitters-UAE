'use client'

import React, { useMemo, useState } from 'react'

import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useDeleteStoreMutation, useGetStoreQuery } from '@/store/storeEnquiryApi'

const StoreEnquiries = () => {
  // ===================================================
  // API
  // ===================================================

  const { data: enquiryData = [], isLoading, isError } = useGetStoreQuery()

  const [deleteEnquiry, { isLoading: isDeleting }] = useDeleteStoreMutation()

  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] = useState('')

  // ===================================================
  // PAGINATION
  // ===================================================

  const [currentPage, setCurrentPage] = useState(1)

  const [itemPerPage, setItemPerPage] = useState(10)

  // ===================================================
  // MULTI SELECT
  // ===================================================

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ===================================================
  // STORE NAME HELPER
  // ===================================================

  const getStoreName = (item: any) => {
    if (!item?.storeName) {
      return '-'
    }

    if (typeof item.storeName === 'object') {
      return item.storeName?.storeName || '-'
    }

    return item.storeName
  }

  // ===================================================
  // FILTER
  // ===================================================

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return enquiryData
    }

    return enquiryData.filter((item: any) => {
      const storeName = typeof item.storeName === 'object' ? item.storeName?.storeName || '' : item.storeName || ''

      return (
        storeName.toLowerCase().includes(query) ||
        item?.fullName?.toLowerCase().includes(query) ||
        item?.email?.toLowerCase().includes(query) ||
        item?.phone?.toLowerCase().includes(query) ||
        item?.msg?.toLowerCase().includes(query)
      )
    })
  }, [enquiryData, search])

  // ===================================================
  // PAGINATION CALCULATION
  // ===================================================

  const totalPages = Math.ceil(filteredData.length / itemPerPage)

  const startIndex = (currentPage - 1) * itemPerPage

  const endIndex = startIndex + itemPerPage

  const currentItems = filteredData.slice(startIndex, endIndex)

  // ===================================================
  // CURRENT PAGE IDS
  // ===================================================

  const currentPageIds = currentItems.map((item: any) => item._id)

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    } else {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  // ===================================================
  // SINGLE DELETE
  // ===================================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',

      text: 'You want to delete this enquiry?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete it!',

      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteEnquiry(id).unwrap()

      setSelectedIds((prev) => prev.filter((item) => item !== id))

      toast.success('Enquiry deleted successfully')

      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
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
      toast.warning('Please select at least one enquiry')

      return
    }

    const result = await Swal.fire({
      title: 'Delete selected enquiries?',

      text: `You are about to delete ${selectedIds.length} selected ${selectedIds.length > 1 ? 'enquiries' : 'enquiry'}.`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete selected',

      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await Promise.all(selectedIds.map((id) => deleteEnquiry(id).unwrap()))

      toast.success(`${selectedIds.length} ${selectedIds.length > 1 ? 'enquiries' : 'enquiry'} deleted successfully`)

      const deletedOnPage = selectedIds.filter((id) => currentPageIds.includes(id)).length

      if (deletedOnPage === currentItems.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }

      setSelectedIds([])
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Bulk delete failed')
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
  // LOADING
  // ===================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading enquiries...</div>
      </div>
    )
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load enquiries.</div>
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
                All Enquiries List
              </CardTitle>

              <small className="text-muted">Total {filteredData.length} enquiries</small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* =====================================
                  BULK DELETE
              ===================================== */}

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                  onClick={handleBulkDelete}
                  disabled={isDeleting}>
                  <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}

              {/* =====================================
                  PER PAGE
              ===================================== */}

              <select
                className="form-select form-select-sm"
                style={{
                  width: '80px',
                }}
                value={itemPerPage}
                onChange={(e) => {
                  setItemPerPage(Number(e.target.value))

                  setCurrentPage(1)
                }}>
                <option value={5}>5</option>

                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>
              </select>

              {/* =====================================
                  SEARCH
              ===================================== */}

              <div className="position-relative">
                <input
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  className="form-control form-control-sm ps-4"
                  placeholder="Search enquiries..."
                  autoComplete="off"
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
            </div>
          </div>

          {/* =========================================
              BODY
          ========================================= */}

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    {/* SELECT */}

                    <th
                      className="text-center"
                      style={{
                        width: 45,
                        minWidth: 45,
                      }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isAllCurrentPageSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>

                    <th className="text-nowrap">Sr No.</th>

                    <th className="text-nowrap">Store Name</th>

                    <th className="text-nowrap">Full Name</th>

                    <th className="text-nowrap">Email Address</th>

                    <th className="text-nowrap">Phone</th>

                    <th className="text-nowrap">Message</th>

                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length ? (
                    currentItems.map((item: any, idx: number) => (
                      <tr key={item._id}>
                        {/* SELECT */}

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

                        {/* STORE NAME */}

                        <td>{getStoreName(item)}</td>

                        {/* FULL NAME */}

                        <td>{item.fullName || '-'}</td>

                        {/* EMAIL */}

                        <td>{item.email || '-'}</td>

                        {/* PHONE */}

                        <td>{item.phone || '-'}</td>

                        {/* MESSAGE */}

                        <td
                          style={{
                            minWidth: '220px',
                            maxWidth: '350px',
                          }}>
                          <div className="text-truncate" title={item.msg}>
                            {item.msg || '-'}
                          </div>
                        </td>

                        {/* ACTION */}

                        <td>
                          <button type="button" className="btn btn-soft-danger btn-sm" disabled={isDeleting} onClick={() => handleDelete(item._id)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        {search ? 'No matching enquiries found' : 'No enquiry data found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>

          {/* =========================================
              PAGINATION
          ========================================= */}

          {filteredData.length > 0 && (
            <CardFooter className="border-top">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="text-muted small">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemPerPage, filteredData.length)} of {filteredData.length} entries
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

                      {/* FIRST PAGE */}

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

                      {/* PAGE NUMBERS */}

                      {pageNumbers.map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button type="button" className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* LAST PAGE */}

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
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default StoreEnquiries
