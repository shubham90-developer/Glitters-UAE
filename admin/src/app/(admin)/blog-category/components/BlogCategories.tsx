'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'

import Image from 'next/image'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddCategoriesDrawer from './AddCategoriesDrawer'
import EditCategoriesDrawer from './EditCategoriesDrawer'

import { useDeleteBlogCategoryMutation, useGetBlogCategoryQuery } from '@/store/blogCategoryApi'

const BlogCategories = () => {
  const { data: categories = [], isLoading, isError } = useGetBlogCategoryQuery()

  const [deleteCategory] = useDeleteBlogCategoryMutation()

  // ============================
  // SEARCH
  // ============================

  const [search, setSearch] = useState('')

  // ============================
  // PAGINATION
  // ============================

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // ============================
  // BULK SELECT
  // ============================

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // ============================
  // SEARCH FILTER
  // ============================

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return categories
    }

    return categories.filter((item: any) => {
      return item?.categoryName?.toLowerCase().includes(query) || item?.status?.toLowerCase().includes(query)
    })
  }, [categories, search])

  // ============================
  // PAGINATION CALCULATION
  // ============================

  const totalPages = Math.ceil(filteredCategories.length / perPage)

  const startIndex = (currentPage - 1) * perPage

  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + perPage)

  // ============================
  // SEARCH CHANGE
  // ============================

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // ============================
  // SINGLE CHECKBOX
  // ============================

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, id])])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // ============================
  // SELECT ALL CURRENT PAGE
  // ============================

  const currentPageIds = paginatedCategories.map((item: any) => item._id)

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id: string) => selectedIds.includes(id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])])
    } else {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  // ============================
  // SINGLE DELETE
  // ============================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this blog category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteCategory(id).unwrap()

      setSelectedIds((prev) => prev.filter((item) => item !== id))

      toast.success('Category deleted successfully')
    } catch (error: any) {
      console.log(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================
  // BULK DELETE
  // ============================

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      toast.warning('Please select at least one category')
      return
    }

    const result = await Swal.fire({
      title: 'Delete selected categories?',
      text: `You are about to delete ${selectedIds.length} selected categor${selectedIds.length > 1 ? 'ies' : 'y'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete selected',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await Promise.all(selectedIds.map((id) => deleteCategory(id).unwrap()))

      toast.success(`${selectedIds.length} categor${selectedIds.length > 1 ? 'ies' : 'y'} deleted successfully`)

      setSelectedIds([])

      // If current page becomes empty,
      // move one page back.
      if (paginatedCategories.length === selectedIds.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    } catch (error: any) {
      console.log(error)

      toast.error(error?.data?.message || 'Bulk delete failed')
    }
  }

  // ============================
  // PAGE CHANGE
  // ============================

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return
    }

    setCurrentPage(page)
  }

  // ============================
  // PAGE NUMBERS
  // ============================

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  if (isLoading) {
    return <div className="py-4 text-center">Loading...</div>
  }

  if (isError) {
    return <div className="py-4 text-center text-danger">Error loading categories</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* ==============================
              HEADER
          ============================== */}

          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <CardTitle as="h4" className="mb-1">
                All Blog Categories List
              </CardTitle>

              <small className="text-muted">Total {filteredCategories.length} categories</small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* BULK DELETE */}

              {selectedIds.length > 0 && (
                <button type="button" className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={handleBulkDelete}>
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
                  placeholder="Search categories..."
                  autoComplete="off"
                  value={search}
                  onChange={handleSearch}
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>

              {/* ADD */}

              <AddCategoriesDrawer />
            </div>
          </div>

          <CardBody>
            {/* ==============================
                TABLE
            ============================== */}

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
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isAllCurrentPageSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>

                    <th className="text-nowrap">Sr No.</th>

                    <th className="text-nowrap">Category Name</th>

                    <th className="text-nowrap">Status</th>

                    <th className="text-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCategories.length ? (
                    paginatedCategories.map((item: any, idx: number) => (
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

                        {/* NAME */}

                        <td>{item.categoryName}</td>

                        {/* STATUS */}

                        <td>
                          <span className={`badge ${item.status?.toLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}`}>{item.status}</span>
                        </td>

                        {/* ACTION */}

                        <td>
                          <div className="d-flex gap-2">
                            <EditCategoriesDrawer item={item} />

                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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

            {/* ==============================
                PAGINATION
            ============================== */}

            {filteredCategories.length > 0 && (
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
                <div className="text-muted small">
                  Showing {startIndex + 1} to {Math.min(startIndex + perPage, filteredCategories.length)} of {filteredCategories.length} entries
                </div>

                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    {/* PREVIOUS */}

                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                      </button>
                    </li>

                    {/* PAGE NUMBERS */}

                    {pageNumbers.map((page) => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(page)}>
                          {page}
                        </button>
                      </li>
                    ))}

                    {/* NEXT */}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default BlogCategories
