'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDeleteCareerMutation, useGetCareerQuery } from '@/store/careerEnquiriesApi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import Link from 'next/link'

const CareersEnquiries = () => {
  // pagniation
  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 10

  const { data: contactData = [], isLoading, isError } = useGetCareerQuery()
  const [deleteEnquiries] = useDeleteCareerMutation()

  // pagniation

  const startIndex = (currentPage - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = contactData.slice(startIndex, endIndex)

  const totalPages = Math.ceil(contactData.length / itemPerPage)

  // SINGLE DELETE
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Enquiries?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteEnquiries(id).unwrap()

      toast.success('Enquiries deleted successfully')
    } catch (error) {
      console.log(error)

      toast.error('Something went wrong')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Careers Enquiries List</CardTitle>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Resume</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems?.length ? (
                    currentItems.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{`${item.firstName} ${item.lastName}`.trim()}</td>
                        <td>{item.emailAddress}</td>
                        <td>{item.phone}</td>
                        <td>
                          {item.resume && (
                            <Link href={item.resume} target="_blank" rel="noopener noreferrer" className="btn btn-soft-dark btn-sm">
                              <i className="solar:document-text-bold-duotone"></i> View
                            </Link>
                          )}
                        </td>
                        <td>{item.message}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className="border-top">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item">
                  <button className="page-link" onClick={() => setCurrentPage((prev) => prev - 1)}>
                    Previous
                  </button>
                </li>
                {/* PAGE */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  return (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                      <button type="button" className="page-link" onClick={() => setCurrentPage(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}

                <li className="page-item">
                  <button className="page-link" onClick={() => setCurrentPage((prev) => prev + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

export default CareersEnquiries
