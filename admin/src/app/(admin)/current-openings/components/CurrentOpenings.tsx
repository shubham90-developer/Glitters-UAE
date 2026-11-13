'use client'

import React, { useMemo, useState } from 'react'

import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddCurrentOpeningsDrawer from './AddCurrentOpeningsDrawer'
import EditCurrentOpeningsDrawer from './EditCurrentOpeningsDrawer'

import { useDeleteCurrentOpeningsMutation, useGetCurrentOpeningsQuery } from '@/store/currentOpeningsApi'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const CurrentOpenings = () => {
  // ============================================
  // SEARCH
  // ============================================

  const [search, setSearch] = useState('')

  // ============================================
  // PAGINATION
  // ============================================

  const [currentPage, setCurrentPage] = useState(1)

  const [itemsPerPage, setItemsPerPage] = useState(10)

  // ============================================
  // MULTI SELECT
  // ============================================

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ============================================
  // API
  // ============================================

  const { data: currentOpenings = [], isLoading, isError } = useGetCurrentOpeningsQuery()

  const [deleteCurrentOpenings, { isLoading: isDeleting }] = useDeleteCurrentOpeningsMutation()

  // ============================================
  // FILTER
  // ============================================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return currentOpenings
    }

    return currentOpenings.filter((item: any) => {
      return (
        item?.jobID?.toLowerCase().includes(keyword) ||
        item?.jobTitle?.toLowerCase().includes(keyword) ||
        item?.shortDesc?.toLowerCase().includes(keyword) ||
        item?.location?.toLowerCase().includes(keyword) ||
        item?.jobType?.toLowerCase().includes(keyword) ||
        item?.experience?.toLowerCase().includes(keyword) ||
        item?.dept?.toLowerCase().includes(keyword) ||
        item?.roles?.toLowerCase().includes(keyword) ||
        item?.salary?.toLowerCase().includes(keyword)
      )
    })
  }, [currentOpenings, search])

  // ============================================
  // PAGINATION DATA
  // ============================================

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage

  const endIndex = startIndex + itemsPerPage

  const currentItems = filteredData.slice(startIndex, endIndex)

  // ============================================
  // SEARCH CHANGE
  // ============================================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ============================================
  // SINGLE SELECT
  // ============================================

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }

      return [...prev, id]
    })
  }

  // ============================================
  // SELECT CURRENT PAGE
  // ============================================

  const currentPageIds = currentItems.map((item: any) => item._id)

  const isCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const handleSelectAll = () => {
    if (isCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))

      return
    }

    setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
  }

  // ============================================
  // SINGLE DELETE
  // ============================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Current Opening?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteCurrentOpenings(id).unwrap()

      setSelectedIds((prev) => prev.filter((item) => item !== id))

      toast.success('Current Opening deleted successfully')
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================================
  // BULK DELETE
  // ============================================

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      toast.info('Please select at least one opening')

      return
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete ${selectedIds.length} selected opening(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await Promise.all(selectedIds.map((id) => deleteCurrentOpenings(id).unwrap()))

      toast.success(`${selectedIds.length} opening(s) deleted successfully`)

      setSelectedIds([])

      if (currentItems.length === selectedIds.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================================
  // PAGE CHANGE
  // ============================================

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return
    }

    setCurrentPage(page)
  }

  // ============================================
  // PER PAGE
  // ============================================

  const handleItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))

    setCurrentPage(1)
  }

  // ============================================
  // PAGE NUMBERS
  // ============================================

  const pageNumbers = useMemo(() => {
    const pages: number[] = []

    const maxVisible = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))

    let endPage = startPage + maxVisible - 1

    if (endPage > totalPages) {
      endPage = totalPages

      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages])

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />
        <div className="mt-2">Loading Current Openings...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load Current Openings.</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* ====================================
              HEADER
          ==================================== */}

          <div className="card-header">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <CardTitle as="h4" className="mb-0">
                All Current Openings List
              </CardTitle>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* BULK DELETE */}

                {selectedIds.length > 0 && (
                  <button type="button" className="btn btn-danger d-flex align-items-center gap-2" disabled={isDeleting} onClick={handleBulkDelete}>
                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                    Delete Selected ({selectedIds.length})
                  </button>
                )}

                {/* ADD */}

                <AddCurrentOpeningsDrawer />
              </div>
            </div>
          </div>

          <CardBody>
            {/* ====================================
                SEARCH + SHOW
            ==================================== */}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              {/* SEARCH */}

              <div
                className="position-relative"
                style={{
                  width: '320px',
                  maxWidth: '100%',
                }}>
                <input
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  className="form-control ps-4"
                  placeholder="Search current openings..."
                  autoComplete="off"
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>

              {/* PER PAGE */}

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Show</span>

                <select
                  className="form-select"
                  value={itemsPerPage}
                  onChange={handleItemsPerPage}
                  style={{
                    width: '90px',
                  }}>
                  <option value="5">5</option>

                  <option value="10">10</option>

                  <option value="20">20</option>

                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {/* ====================================
                TABLE
            ==================================== */}

            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th className="text-center">
                      <input type="checkbox" className="form-check-input" checked={isCurrentPageSelected} onChange={handleSelectAll} />
                    </th>

                    <th>Sr No.</th>

                    <th>Job ID</th>

                    <th>Job Title</th>

                    <th>Department</th>

                    <th>Experience</th>

                    <th>Location</th>

                    <th>Job Type</th>

                    <th>Salary</th>

                    <th>Openings</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length ? (
                    currentItems.map((item: any, idx: number) => {
                      const selected = selectedIds.includes(item._id)

                      return (
                        <tr key={item._id} className={selected ? 'table-active' : ''}>
                          <td className="text-center">
                            <input type="checkbox" className="form-check-input" checked={selected} onChange={() => handleSelectRow(item._id)} />
                          </td>

                          <td>{startIndex + idx + 1}</td>

                          <td>{item.jobID || '-'}</td>

                          <td>{item.jobTitle || '-'}</td>

                          <td>{item.dept || '-'}</td>

                          <td>{item.experience || '-'}</td>

                          <td>{item.location || '-'}</td>

                          <td>{item.jobType || '-'}</td>

                          <td>{item.salary || '-'}</td>

                          <td>{item.openings || '-'}</td>

                          <td>
                            <div className="d-flex gap-2">
                              <EditCurrentOpeningsDrawer item={item} />

                              <button
                                type="button"
                                className="btn btn-soft-danger btn-sm"
                                disabled={isDeleting}
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
                      <td colSpan={11} className="text-center py-4">
                        {search ? 'No matching openings found' : 'No data found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>

          {/* ====================================
              PAGINATION
          ==================================== */}

          {filteredData.length > 0 && (
            <CardFooter className="border-top">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                {/* INFO */}

                <div className="text-muted">
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredData.length)}</strong> of{' '}
                  <strong>{filteredData.length}</strong> entries
                </div>

                {/* PAGES */}

                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination justify-content-end mb-0">
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

                      {/* PAGE NUMBERS */}

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
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default CurrentOpenings
