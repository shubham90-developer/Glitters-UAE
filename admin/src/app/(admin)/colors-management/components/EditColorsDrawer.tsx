'use client'

import React, { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetColorsByIdQuery, useUpdateColorsMutation } from '@/store/colorsApi'

type ColorStatus = 'active' | 'inactive'

interface ColorFormState {
  colorName: string
  hexCode: string
  status: ColorStatus
}

const initialFormData: ColorFormState = {
  colorName: '',
  hexCode: '#000000',
  status: 'active',
}

const EditColorsDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  // ===================================================
  // API
  // ===================================================

  const {
    data: colorData,
    isLoading: isColorLoading,
    refetch,
  } = useGetColorsByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateColors, { isLoading: isUpdating }] = useUpdateColorsMutation()

  // ===================================================
  // FORM
  // ===================================================

  const [formData, setFormData] = useState<ColorFormState>(initialFormData)

  // ===================================================
  // SET EXISTING DATA
  // ===================================================

  useEffect(() => {
    if (!colorData) {
      return
    }

    setFormData({
      colorName: colorData.colorName || '',

      hexCode: colorData.hexCode || '#000000',

      status: colorData.status === 'inactive' ? 'inactive' : 'active',
    })
  }, [colorData])

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
  // HEX VALIDATION
  // ===================================================

  const isValidHex = (value: string) => {
    return /^#([0-9A-Fa-f]{6})$/.test(value)
  }

  // ===================================================
  // OPEN
  // ===================================================

  const handleOpen = async () => {
    setOpen(true)

    if (item?._id) {
      try {
        await refetch()
      } catch {
        //
      }
    }
  }

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (isUpdating) {
      return
    }

    setOpen(false)
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.colorName.trim()) {
      toast.error('Color name is required')

      return
    }

    if (!formData.hexCode.trim()) {
      toast.error('Hex code is required')

      return
    }

    if (!isValidHex(formData.hexCode)) {
      toast.error('Please enter a valid hex code like #455566')

      return
    }

    if (!item?._id) {
      toast.error('Color ID not found')

      return
    }

    try {
      const payload = {
        colorName: formData.colorName.trim(),

        hexCode: formData.hexCode.trim(),

        status: formData.status,
      }

      await updateColors({
        id: item._id,
        data: payload,
      }).unwrap()

      toast.success('Color updated successfully')

      setOpen(false)

      await refetch()
    } catch (error: any) {
      console.error('Update Color Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={handleOpen}>
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
          <div>
            <h5 className="mb-1 fw-bold">Edit Color</h5>

            <small className="text-muted">Update color details.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={handleClose}
            disabled={isUpdating}>
            <IconifyIcon icon="solar:close-circle-broken" />
          </button>
        </div>

        {/* LOADING */}

        {isColorLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading color...</div>
          </div>
        ) : (
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
                      disabled={isUpdating}
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
                        disabled={isUpdating}
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
                        maxLength={7}
                        disabled={isUpdating}
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
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={formData.status === 'active'}
                              onChange={handleStatusToggle}
                              disabled={isUpdating}
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
                    Update Color
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

export default EditColorsDrawer
