'use client'

import React, { useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateSizeMutation } from '@/store/sizeApi'

type SizeStatus = 'active' | 'inactive'

interface SizeFormState {
  size: string
  status: SizeStatus
}

const initialFormData: SizeFormState = {
  size: '',
  status: 'active',
}

const AddSizeDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [createSize, { isLoading }] = useCreateSizeMutation()

  const [formData, setFormData] = useState<SizeFormState>(initialFormData)

  // ============================================
  // CHANGE
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // STATUS
  // ============================================

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,

      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  // ============================================
  // RESET
  // ============================================

  const resetForm = () => {
    setFormData(initialFormData)
  }

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    if (isLoading) {
      return
    }

    setOpen(false)
    resetForm()
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.size.trim()) {
      toast.error('Size name is required')

      return
    }

    try {
      const payload = {
        size: formData.size.trim(),

        status: formData.status,
      }
      // @ts-ignore
      await createSize(payload).unwrap()

      toast.success('Size created successfully')

      setOpen(false)
      resetForm()

      if (onAdd) {
        onAdd()
      }
    } catch (error: any) {
      console.error('Create Size Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Size
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
          <div>
            <h5 className="mb-1 fw-bold">Add Size</h5>

            <small className="text-muted">Add size name and status.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}
            disabled={isLoading}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* SIZE NAME */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Size Name
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="Example: S, M, L, XL, 128GB"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
              </Col>

              {/* STATUS */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label d-block">Status</label>

                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-medium">Size Status</div>

                        <small className="text-muted">Enable or disable this size.</small>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check form-switch mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.status === 'active'}
                            onChange={handleStatusToggle}
                            disabled={isLoading}
                            style={{
                              width: '46px',

                              height: '24px',
                            }}
                          />
                        </div>

                        <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {formData.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={handleClose} disabled={isLoading}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Creating...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:diskette-broken" />
                  Add Size
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddSizeDrawer
