'use client'

import React, { useEffect, useState } from 'react'

import { Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetMaterialByIdQuery, useUpdateMaterialMutation } from '@/store/materialApi'

type BrandStatus = 'active' | 'inactive'

interface BrandFormState {
  name: string
  status: BrandStatus
}

interface EditBrandsDrawerProps {
  item: {
    _id: string
    name?: string
    status?: BrandStatus
  }
}

const initialFormData: BrandFormState = {
  name: '',
  status: 'active',
}

const EditMaterialDrawer = ({ item }: EditBrandsDrawerProps) => {
  const [open, setOpen] = useState(false)

  // ============================================
  // API
  // ============================================

  const {
    data: materialData,
    isLoading: isMaterialLoading,
    isFetching,
    refetch,
  } = useGetMaterialByIdQuery(item?._id, {
    skip: !item?._id,
  })

  const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation()

  // ============================================
  // FORM
  // ============================================

  const [formData, setFormData] = useState<BrandFormState>(initialFormData)

  // ============================================
  // SET API DATA
  // ============================================

  useEffect(() => {
    if (!materialData) {
      return
    }

    setFormData({
      name: materialData.name || '',

      status: materialData.status === 'inactive' ? 'inactive' : 'active',
    })
  }, [materialData])

  // ============================================
  // INPUT CHANGE
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
  // OPEN
  // ============================================

  const handleOpen = async () => {
    setOpen(true)

    setFormData({
      name: item?.name || '',

      status: item?.status === 'inactive' ? 'inactive' : 'active',
    })

    if (item?._id) {
      try {
        await refetch()
      } catch (error) {
        console.error('Brand refetch error:', error)
      }
    }
  }

  // ============================================
  // CLOSE
  // ============================================

  const handleClose = () => {
    if (isUpdating) {
      return
    }

    setOpen(false)
  }

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!item?._id) {
      toast.error('Brand ID not found')

      return
    }

    if (!formData.name.trim()) {
      toast.error('Material name is required')

      return
    }

    try {
      const payload = {
        name: formData.name.trim(),

        status: formData.status,
      }

      await updateMaterial({
        id: item._id,
        // @ts-ignore
        data: payload,
      }).unwrap()

      toast.success('Material updated successfully')

      setOpen(false)
    } catch (error: any) {
      console.error('Update Material Error:', error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}

      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={handleOpen} title="Edit">
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
            <h5 className="mb-1 fw-bold">Edit Material</h5>

            <small className="text-muted">Update Material name and status.</small>
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

        {/* BODY */}

        {isMaterialLoading || isFetching ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />

            <div className="mt-2">Loading Material...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-3">
              <Row>
                {/* Material NAME */}

                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">
                      Material Name
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Example: Apple, Samsung"
                      autoComplete="off"
                      disabled={isUpdating}
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
                          <div className="fw-medium">Material Status</div>

                          <small className="text-muted">Enable or disable this Material.</small>
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

                          <span
                            className={`badge ${formData.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
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
                    Update Material
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

export default EditMaterialDrawer
