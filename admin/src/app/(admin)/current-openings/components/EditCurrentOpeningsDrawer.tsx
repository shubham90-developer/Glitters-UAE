'use client'

import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetCurrentOpeningsByIdQuery, useUpdateCurrentOpeningsMutation } from '@/store/currentOpeningsApi'

// @ts-ignore
import 'react-quill/dist/quill.snow.css'

// ============================================
// REACT QUILL SSR FIX
// ============================================

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

// ============================================
// INITIAL FORM DATA
// ============================================

const initialFormData = {
  jobID: '',
  jobTitle: '',
  shortDesc: '',
  location: '',
  jobType: '',
  experience: '',
  dept: '',
  roles: '',
  salary: '',
  openings: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
}

const EditCurrentOpeningsDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const { data: currentOpeningsResponse, isLoading } = useGetCurrentOpeningsByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateCurrentOpenings, { isLoading: isUpdating }] = useUpdateCurrentOpeningsMutation()

  // ============================================
  // NORMALIZE RESPONSE
  // ============================================

  const currentOpenings = useMemo(() => {
    const response: any = currentOpeningsResponse

    if (!response) return null

    if (response?.data && typeof response.data === 'object') {
      return response.data
    }

    return response
  }, [currentOpeningsResponse])

  // ============================================
  // FORM STATE
  // ============================================

  const [formData, setFormData] = useState(initialFormData)

  // ============================================
  // LOAD EXISTING DATA
  // ============================================

  useEffect(() => {
    if (!currentOpenings) return

    setFormData({
      jobID: currentOpenings.jobID || '',

      jobTitle: currentOpenings.jobTitle || '',

      shortDesc: currentOpenings.shortDesc || '',

      location: currentOpenings.location || '',

      jobType: currentOpenings.jobType || '',

      experience: currentOpenings.experience || '',

      dept: currentOpenings.dept || '',

      roles: currentOpenings.roles || '',

      salary: currentOpenings.salary || '',

      openings: currentOpenings.openings || '',

      responsibilities: currentOpenings.responsibilities || '',

      requirements: currentOpenings.requirements || '',

      benefits: currentOpenings.benefits || '',
    })
  }, [currentOpenings])

  // ============================================
  // CHANGE
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    setOpen(false)
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.jobID.trim()) {
      toast.error('Job ID is required')
      return
    }

    if (!formData.jobTitle.trim()) {
      toast.error('Job title is required')
      return
    }

    if (!formData.location.trim()) {
      toast.error('Location is required')
      return
    }

    if (!formData.jobType.trim()) {
      toast.error('Job type is required')
      return
    }

    if (!formData.experience.trim()) {
      toast.error('Experience is required')
      return
    }

    if (!formData.dept.trim()) {
      toast.error('Department is required')
      return
    }

    try {
      await updateCurrentOpenings({
        id: item._id,

        data: {
          // @ts-ignore
          jobID: formData.jobID.trim(),

          jobTitle: formData.jobTitle.trim(),

          shortDesc: formData.shortDesc.trim(),

          location: formData.location.trim(),

          jobType: formData.jobType.trim(),

          experience: formData.experience.trim(),

          dept: formData.dept.trim(),

          roles: formData.roles,

          salary: formData.salary.trim(),

          openings: formData.openings.trim(),

          responsibilities: formData.responsibilities,

          requirements: formData.requirements,

          benefits: formData.benefits,
        },
      }).unwrap()

      toast.success('Current Opening updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-soft-dark btn-sm d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* OVERLAY */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={handleClose}
        />
      )}

      {/* DRAWER */}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '850px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        {/* HEADER */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Current Opening</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* LOADING */}

        {isLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              <Row>
                {/* JOB ID */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Job ID *</label>

                    <input type="text" className="form-control" name="jobID" value={formData.jobID} onChange={handleChange} />
                  </div>
                </Col>

                {/* JOB TITLE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Job Title *</label>

                    <input type="text" className="form-control" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                  </div>
                </Col>

                {/* DEPARTMENT */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Department *</label>

                    <input type="text" className="form-control" name="dept" value={formData.dept} onChange={handleChange} />
                  </div>
                </Col>

                {/* EXPERIENCE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Experience *</label>

                    <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleChange} />
                  </div>
                </Col>

                {/* LOCATION */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Location *</label>

                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} />
                  </div>
                </Col>

                {/* JOB TYPE */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Job Type *</label>

                    <select className="form-select" name="jobType" value={formData.jobType} onChange={handleChange}>
                      <option value="">Select Job Type</option>

                      <option value="Full Time">Full Time</option>

                      <option value="Part Time">Part Time</option>

                      <option value="Internship">Internship</option>

                      <option value="Contract">Contract</option>

                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </Col>

                {/* SALARY */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Salary</label>

                    <input type="text" className="form-control" name="salary" value={formData.salary} onChange={handleChange} />
                  </div>
                </Col>

                {/* OPENINGS */}

                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Number of Openings</label>

                    <input type="text" className="form-control" name="openings" value={formData.openings} onChange={handleChange} />
                  </div>
                </Col>

                {/* SHORT DESCRIPTION */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Short Description</label>

                    <textarea rows={4} className="form-control" name="shortDesc" value={formData.shortDesc} onChange={handleChange} />
                  </div>
                </Col>

                {/* ROLES */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Roles</label>

                    <div
                      style={{
                        minHeight: '210px',
                      }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.roles}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            roles: value,
                          }))
                        }
                        placeholder="Enter roles..."
                        style={{
                          height: '160px',
                        }}
                      />
                    </div>
                  </div>
                </Col>

                {/* RESPONSIBILITIES */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Responsibilities</label>

                    <div
                      style={{
                        minHeight: '210px',
                      }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.responsibilities}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            responsibilities: value,
                          }))
                        }
                        placeholder="Enter responsibilities..."
                        style={{
                          height: '160px',
                        }}
                      />
                    </div>
                  </div>
                </Col>

                {/* REQUIREMENTS */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Requirements</label>

                    <div
                      style={{
                        minHeight: '210px',
                      }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.requirements}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            requirements: value,
                          }))
                        }
                        placeholder="Enter requirements..."
                        style={{
                          height: '160px',
                        }}
                      />
                    </div>
                  </div>
                </Col>

                {/* BENEFITS */}

                <Col md={12}>
                  <div className="mb-4">
                    <label className="form-label">Benefits</label>

                    <div
                      style={{
                        minHeight: '210px',
                      }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.benefits}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            benefits: value,
                          }))
                        }
                        placeholder="Enter benefits..."
                        style={{
                          height: '160px',
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* FOOTER */}

            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isUpdating}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:diskette-broken" />
                    Update Opening
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default EditCurrentOpeningsDrawer
