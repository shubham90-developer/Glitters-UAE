'use client'

import React, { useEffect, useState } from 'react'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { toast } from 'react-toastify'
import { Col, Row } from 'react-bootstrap'

import { useGetFaqByIdQuery, useUpdateFaqMutation } from '@/store/faqApi'

const EditFaqDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] = useState({
    category: '',
    question: '',
    answer: '',
    status: 'active',
  })

  // ============================================
  // API
  // ============================================

  const { data: faqResponse, isLoading } = useGetFaqByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()

  // ============================================
  // NORMALIZE API RESPONSE
  // ============================================

  const faqData = (faqResponse as any)?.data || faqResponse

  // ============================================
  // LOAD EXISTING DATA
  // ============================================

  useEffect(() => {
    if (!faqData) return

    setFormData({
      category: typeof faqData.category === 'object' ? faqData.category?._id || '' : faqData.category || '',

      question: faqData.question || '',

      answer: faqData.answer || '',

      status: faqData.status === 'inactive' ? 'inactive' : 'active',
    })
  }, [faqData])

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

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }
  // ============================================
  // VALIDATION + SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.category) {
      toast.error('Please select category')
      return
    }

    if (!formData.question.trim()) {
      toast.error('Question is required')
      return
    }

    if (!formData.answer.trim()) {
      toast.error('Answer is required')
      return
    }

    try {
      await updateFaq({
        id: item._id,

        data: {
          // @ts-ignore
          category: formData.category,

          question: formData.question.trim(),

          answer: formData.answer.trim(),

          status: formData.status,
        },
      }).unwrap()

      toast.success('FAQ updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Failed to update FAQ')
    }
  }

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    setOpen(false)
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
          width: '520px',
          maxWidth: '100%',
          zIndex: 1050,

          transform: open ? 'translateX(0)' : 'translateX(100%)',

          transition: 'transform 0.3s ease',

          overflowY: 'auto',
        }}>
        {/* HEADER */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit FAQ</h5>

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
                {/* CATEGORY */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">
                      Category
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                      <option value="">Select Category</option>

                      <option value="orders">Orders</option>

                      <option value="shipping">Shipping</option>

                      <option value="payments">Payments</option>

                      <option value="returns">Returns</option>

                      <option value="products">Products</option>
                    </select>
                  </div>
                </Col>

                {/* QUESTION */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">
                      Question
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter question"
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                    />
                  </div>
                </Col>

                {/* ANSWER */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">
                      Answer
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <textarea
                      name="answer"
                      value={formData.answer}
                      onChange={handleChange}
                      placeholder="Enter answer"
                      rows={5}
                      className="form-control"
                    />
                  </div>
                </Col>

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label d-block">Status</label>

                    <div className="d-flex align-items-center gap-3">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.status === 'active'}
                          onChange={handleStatusToggle}
                          style={{
                            width: '46px',
                            height: '24px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>

                      <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
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
                    Update
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

export default EditFaqDrawer
