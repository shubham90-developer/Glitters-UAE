'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddFaqDrawer from './AddFaqDrawer'
import EditFaqDrawer from './EditFaqDrawer'

import { useDeleteFaqMutation, useGetFaqQuery } from '@/store/faqApi'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const Faq = () => {
  const { data: faqData = [], isLoading, isError } = useGetFaqQuery()

  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation()

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
  // FILTER DATA
  // ============================================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return faqData
    }

    return faqData.filter((item: any) => {
      return (
        item?.category?.toString().toLowerCase().includes(keyword) ||
        item?.question?.toLowerCase().includes(keyword) ||
        item?.answer?.toLowerCase().includes(keyword)
      )
    })
  }, [faqData, search])

  // ============================================
  // PAGINATION DATA
  // ============================================

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage

  const endIndex = startIndex + itemsPerPage

  const paginatedData = filteredData.slice(startIndex, endIndex)

  // ============================================
  // SEARCH CHANGE
  // ============================================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ============================================
  // ROW SELECT
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
  // CURRENT PAGE SELECT ALL
  // ============================================

  const currentPageIds = paginatedData.map((item: any) => item._id)

  const isCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const handleSelectAll = () => {
    if (isCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    }
  }

  // ============================================
  // SINGLE DELETE
  // ============================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this FAQ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteFaq(id).unwrap()

      setSelectedIds((prev) => prev.filter((item) => item !== id))

      toast.success('FAQ deleted successfully')
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================================
  // MULTI DELETE
  // ============================================

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      toast.info('Please select at least one FAQ')
      return
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete ${selectedIds.length} selected FAQ(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await Promise.all(selectedIds.map((id) => deleteFaq(id).unwrap()))

      toast.success(`${selectedIds.length} FAQ(s) deleted successfully`)

      setSelectedIds([])

      if (paginatedData.length === selectedIds.length && currentPage > 1) {
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
  // ITEMS PER PAGE
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
        <div className="mt-2">Loading FAQs...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load FAQ data.</div>
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
                All FAQ List
              </CardTitle>

              <div className="d-flex align-items-center gap-2">
                {selectedIds.length > 0 && (
                  <button type="button" className="btn btn-danger d-flex align-items-center gap-2" disabled={isDeleting} onClick={handleBulkDelete}>
                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                    Delete Selected ({selectedIds.length})
                  </button>
                )}

                <AddFaqDrawer />
              </div>
            </div>
          </div>

          <CardBody>
            {/* ====================================
                SEARCH + PER PAGE
            ==================================== */}

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
              <div
                className="position-relative"
                style={{
                  width: '320px',
                  maxWidth: '100%',
                }}>
                <IconifyIcon
                  icon="solar:magnifer-broken"
                  className="position-absolute top-50 translate-middle-y"
                  style={{
                    left: 12,
                    fontSize: 18,
                    zIndex: 2,
                  }}
                />

                <input
                  type="text"
                  className="form-control"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search FAQ..."
                  style={{
                    paddingLeft: 38,
                  }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="mb-0 text-muted">Show</label>

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
                    <th
                      style={{
                        width: '50px',
                      }}
                      className="text-center">
                      <input type="checkbox" className="form-check-input" checked={isCurrentPageSelected} onChange={handleSelectAll} />
                    </th>

                    <th
                      style={{
                        width: '80px',
                      }}>
                      Sr No.
                    </th>

                    <th>Category</th>

                    <th>Question</th>

                    <th>Answer</th>
                    <th>Status</th>

                    <th
                      style={{
                        width: '130px',
                      }}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length ? (
                    paginatedData.map((item: any, idx: number) => {
                      const isSelected = selectedIds.includes(item._id)

                      return (
                        <tr key={item._id} className={isSelected ? 'table-active' : ''}>
                          {/* CHECKBOX */}

                          <td className="text-center">
                            <input type="checkbox" className="form-check-input" checked={isSelected} onChange={() => handleSelectRow(item._id)} />
                          </td>

                          {/* SR NO */}

                          <td>{startIndex + idx + 1}</td>

                          {/* CATEGORY */}

                          <td>
                            {typeof item.category === 'object' ? item.category?.categoryName || item.category?.name || '-' : item.category || '-'}
                          </td>

                          {/* QUESTION */}

                          <td>{item.question || '-'}</td>

                          {/* ANSWER */}

                          <td>
                            <div
                              style={{
                                maxWidth: '450px',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                              }}>
                              {item.answer || '-'}
                            </div>
                          </td>

                          {/* status */}
                          <td>
                            <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                              {item.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td>
                            <div className="d-flex gap-2">
                              <EditFaqDrawer item={item} />

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
                      <td colSpan={6} className="text-center py-5">
                        <IconifyIcon
                          icon="solar:magnifer-broken"
                          style={{
                            fontSize: 32,
                          }}
                        />

                        <div className="mt-2">{search ? 'No FAQ found for your search' : 'No FAQ data found'}</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ====================================
                PAGINATION
            ==================================== */}

            {filteredData.length > 0 && (
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
                {/* INFO */}

                <div className="text-muted">
                  Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredData.length)}</strong> of{' '}
                  <strong>{filteredData.length}</strong> entries
                </div>

                {/* PAGE */}

                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination mb-0">
                      {/* PREVIOUS */}

                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
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
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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

export default Faq
