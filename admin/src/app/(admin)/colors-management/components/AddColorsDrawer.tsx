'use client'

import React, { useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useCreateColorsMutation } from '@/store/colorsApi'

// =====================================================
// TYPES
// =====================================================

type ColorStatus = 'active' | 'inactive'

interface ColorFormState {
  colorName: string
  hexCode: string
  status: ColorStatus
}

// =====================================================
// INITIAL FORM
// =====================================================

const initialFormData: ColorFormState = {
  colorName: '',
  hexCode: '#000000',
  status: 'active',
}

// =====================================================
// COMPONENT
// =====================================================

const AddColorsDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  // ===================================================
  // API
  // ===================================================

  const [createColors, { isLoading }] = useCreateColorsMutation()

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<ColorFormState>(initialFormData)

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ===================================================
  // COLOR PICKER
  // ===================================================

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      hexCode: e.target.value,
    }))
  }

  // ===================================================
  // STATUS TOGGLE
  // ===================================================

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,

      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  // ===================================================
  // RESET
  // ===================================================

  const resetForm = () => {
    setFormData(initialFormData)
  }

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (isLoading) {
      return
    }

    setOpen(false)

    resetForm()
  }

  // ===================================================
  // VALID HEX
  // ===================================================

  const isValidHex = (value: string) => {
    return /^#([0-9A-Fa-f]{6})$/.test(value)
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = {
        colorName: formData.colorName.trim(),

        hexCode: formData.hexCode.trim(),

        status: formData.status as 'active' | 'inactive',
      }

      console.log('COLOR PAYLOAD =>', payload)

      await createColors(payload).unwrap()

      toast.success('Color created successfully')

      setOpen(false)

      resetForm()
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }
  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Color
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
            <h5 className="mb-1 fw-bold">Add Color</h5>

            <small className="text-muted">Add color name, hex code and status.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            disabled={isLoading}
            onClick={handleClose}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <Row>
              {/* COLOR NAME */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Color Name
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="colorName"
                    value={formData.colorName}
                    onChange={handleChange}
                    placeholder="Example: White"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
              </Col>

              {/* HEX CODE */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label">
                    Hex Code
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <div className="d-flex gap-2">
                    <input
                      type="color"
                      value={isValidHex(formData.hexCode) ? formData.hexCode : '#000000'}
                      onChange={handleColorPicker}
                      disabled={isLoading}
                      style={{
                        width: '55px',
                        height: '38px',
                        padding: '2px',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                      }}
                    />

                    <input
                      type="text"
                      className="form-control"
                      name="hexCode"
                      value={formData.hexCode}
                      onChange={handleChange}
                      placeholder="#455566"
                      maxLength={7}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </Col>

              {/* PREVIEW */}

              <Col md={12}>
                <div className="mb-4">
                  <label className="form-label">Color Preview</label>

                  <div className="border rounded p-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: '60px',

                          height: '60px',

                          borderRadius: '10px',

                          backgroundColor: isValidHex(formData.hexCode) ? formData.hexCode : '#ffffff',

                          border: '1px solid #ddd',
                        }}
                      />

                      <div>
                        <div className="fw-medium">{formData.colorName || 'Color'}</div>

                        <code>{formData.hexCode}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* STATUS */}

              <Col md={12}>
                <div className="mb-3">
                  <label className="form-label d-block">Status</label>

                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-medium">Color Status</div>

                        <small className="text-muted">Enable or disable this color.</small>
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
                  Add Color
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddColorsDrawer
