'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

/* ======================================================
   TYPES
====================================================== */

type PackageStatus = 'active' | 'inactive'

type PackageFormData = {
  package_badge: string
  package_name: string
  price: string
  duration: string
  package_description: string
  status: PackageStatus
}

type PackageSubmitData = PackageFormData & {
  package_features: string[]
}

type EditPackageDrawerProps = {
  onAdd?: (data: PackageSubmitData) => void
}

/* ======================================================
   COMPONENT
====================================================== */

const EditPackageDrawer = ({ onAdd }: EditPackageDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState<PackageFormData>({
    package_badge: '',
    package_name: '',
    price: '',
    duration: '',
    package_description: '',
    status: 'active',
  })

  const [features, setFeatures] = useState<string[]>([''])

  /* ======================================================
     INPUT CHANGE
  ====================================================== */

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /* ======================================================
     STATUS TOGGLE
  ====================================================== */

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,

      status: checked ? 'active' : 'inactive',
    }))
  }

  /* ======================================================
     FEATURE CHANGE
  ====================================================== */

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? value : feature)))
  }

  /* ======================================================
     ADD FEATURE
  ====================================================== */

  const addFeature = () => {
    setFeatures((prev) => [...prev, ''])
  }

  /* ======================================================
     REMOVE FEATURE
  ====================================================== */

  const removeFeature = (index: number) => {
    if (features.length === 1) {
      setFeatures([''])

      return
    }

    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  /* ======================================================
     RESET FORM
  ====================================================== */

  const resetForm = () => {
    setFormData({
      package_badge: '',
      package_name: '',
      price: '',
      duration: '',
      package_description: '',
      status: 'active',
    })

    setFeatures([''])
  }

  /* ======================================================
     CLOSE DRAWER
  ====================================================== */

  const closeDrawer = () => {
    setOpen(false)
  }

  /* ======================================================
     SUBMIT
  ====================================================== */

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalData: PackageSubmitData = {
      ...formData,

      package_features: features.filter((feature) => feature.trim().length > 0),
    }

    console.log('PACKAGE DATA:', finalData)

    /*
      API CALL HERE

      await axios.put(
        `/api/packages/${id}`,
        finalData,
      )
    */

    if (onAdd) {
      onAdd(finalData)
    }

    setOpen(false)
  }

  return (
    <>
      {/* ==================================================
          OPEN BUTTON
      ================================================== */}

      <button
        type="button"
        className="btn btn-soft-dark d-flex align-items-center justify-content-center gap-2"
        onClick={() => setOpen(true)}
        title="Edit Package">
        <IconifyIcon icon="solar:pen-2-broken" width={18} />
      </button>

      {/* ==================================================
          OVERLAY
      ================================================== */}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',

            zIndex: 1040,
          }}
          onClick={closeDrawer}
        />
      )}

      {/* ==================================================
          DRAWER
      ================================================== */}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '820px',

          maxWidth: '100%',

          zIndex: 1050,

          transform: open ? 'translateX(0)' : 'translateX(100%)',

          transition: 'transform 0.3s ease',

          overflowY: 'auto',
        }}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center position-sticky top-0 z-3">
          <div>
            <h5 className="mb-1 fw-bold">Edit Package</h5>

            <small className="text-muted">Update package information, features and availability.</small>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 32,
              height: 32,
            }}
            onClick={closeDrawer}>
            ✕
          </button>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <div className="row g-3">
              {/* ==================================================
                  PACKAGE BADGE
              ================================================== */}

              <div className="col-lg-6 col-md-6">
                <label className="form-label fw-semibold">Package Badge</label>

                <input
                  type="text"
                  name="package_badge"
                  className="form-control"
                  value={formData.package_badge}
                  onChange={handleChange}
                  placeholder="e.g. Popular, Premium, Best Value"
                />

                <small className="text-muted">Optional badge shown on package card.</small>
              </div>

              {/* ==================================================
                  PACKAGE NAME
              ================================================== */}

              <div className="col-lg-6 col-md-6">
                <label className="form-label fw-semibold">
                  Package Name
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  name="package_name"
                  className="form-control"
                  value={formData.package_name}
                  onChange={handleChange}
                  placeholder="Enter package name"
                  required
                />
              </div>

              {/* ==================================================
                  PRICE
              ================================================== */}

              <div className="col-lg-6 col-md-6">
                <label className="form-label fw-semibold">
                  Price
                  <span className="text-danger ms-1">*</span>
                </label>

                <div className="input-group">
                  <span className="input-group-text">AED</span>

                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* ==================================================
                  DURATION
              ================================================== */}

              <div className="col-lg-6 col-md-6">
                <label className="form-label fw-semibold">
                  Duration
                  <span className="text-danger ms-1">*</span>
                </label>

                <select name="duration" className="form-select" value={formData.duration} onChange={handleChange} required>
                  <option value="">Select Duration</option>

                  <option value="1_month">1 Month</option>

                  <option value="3_months">3 Months</option>

                  <option value="6_months">6 Months</option>

                  <option value="12_months">12 Months</option>

                  <option value="lifetime">Lifetime</option>
                </select>
              </div>

              {/* ==================================================
                  PACKAGE DESCRIPTION
              ================================================== */}

              <div className="col-12">
                <label className="form-label fw-semibold">Package Description</label>

                <textarea
                  name="package_description"
                  className="form-control"
                  rows={4}
                  value={formData.package_description}
                  onChange={handleChange}
                  placeholder="Enter package description..."
                />
              </div>

              {/* ==================================================
                  PACKAGE FEATURES
              ================================================== */}

              <div className="col-12">
                <div className="border rounded overflow-hidden">
                  {/* FEATURE HEADER */}

                  <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <div>
                      <h6 className="mb-1 fw-semibold">Package Features</h6>

                      <small className="text-muted">Add all features included in this package.</small>
                    </div>

                    <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={addFeature}>
                      <IconifyIcon icon="solar:add-circle-broken" width={17} />
                      Add Feature
                    </button>
                  </div>

                  {/* FEATURE LIST */}

                  <div className="p-3">
                    {features.map((feature, index) => (
                      <div key={index} className="d-flex align-items-center gap-2 mb-2">
                        {/* NUMBER */}

                        <div
                          className="bg-light border rounded d-flex align-items-center justify-content-center fw-semibold text-muted"
                          style={{
                            width: 38,

                            height: 38,

                            minWidth: 38,
                          }}>
                          {index + 1}
                        </div>

                        {/* INPUT */}

                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder={`Feature ${index + 1} - e.g. Up to 20 Products`}
                          />
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          className="btn btn-soft-danger d-flex align-items-center justify-content-center"
                          style={{
                            width: 38,

                            height: 38,

                            minWidth: 38,
                          }}
                          onClick={() => removeFeature(index)}
                          title="Remove Feature">
                          <IconifyIcon icon="solar:trash-bin-trash-broken" width={18} />
                        </button>
                      </div>
                    ))}

                    <button type="button" className="btn btn-outline-primary btn-sm mt-2 d-flex align-items-center gap-2" onClick={addFeature}>
                      <IconifyIcon icon="solar:add-circle-broken" width={17} />
                      Add Another Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  STATUS TOGGLE
              ================================================== */}

              <div className="col-12">
                <div
                  className={`package-status-box d-flex justify-content-between align-items-center gap-3 flex-wrap ${
                    formData.status === 'active' ? 'package-status-active' : 'package-status-inactive'
                  }`}>
                  {/* LEFT */}

                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`package-status-icon ${
                        formData.status === 'active' ? 'text-success bg-success-subtle' : 'text-danger bg-danger-subtle'
                      }`}>
                      <IconifyIcon
                        icon={formData.status === 'active' ? 'solar:check-circle-bold-duotone' : 'solar:close-circle-bold-duotone'}
                        width={24}
                      />
                    </div>

                    <div>
                      <div className="fw-semibold mb-1">Package Status</div>

                      <div className="text-muted small">
                        {formData.status === 'active'
                          ? 'This package is active and available for vendors.'
                          : 'This package is inactive and unavailable for vendors.'}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="d-flex align-items-center gap-3">
                    <span className={`badge ${formData.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>

                    <div className="form-check form-switch mb-0">
                      <input
                        id="packageStatus"
                        type="checkbox"
                        role="switch"
                        className="form-check-input package-status-switch"
                        checked={formData.status === 'active'}
                        onChange={(e) => handleStatusChange(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="p-3 border-top bg-white d-flex gap-2 position-sticky bottom-0"
            style={{
              zIndex: 20,
            }}>
            <button
              type="button"
              className="btn btn-light w-100"
              onClick={() => {
                resetForm()
                closeDrawer()
              }}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              <IconifyIcon icon="solar:diskette-broken" width={18} />
              Update Package
            </button>
          </div>
        </form>
      </div>

      {/* ==================================================
          STYLE
      ================================================== */}

      <style jsx global>{`
        .package-status-box {
          width: 100%;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fafbfc;
          transition: all 0.2s ease;
        }

        .package-status-active {
          border-color: rgba(25, 135, 84, 0.25);
          background: rgba(25, 135, 84, 0.03);
        }

        .package-status-inactive {
          border-color: rgba(220, 53, 69, 0.2);
          background: rgba(220, 53, 69, 0.025);
        }

        .package-status-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;
        }

        .package-status-switch {
          width: 48px !important;
          height: 24px !important;
          cursor: pointer;
          margin-top: 0 !important;
        }

        .package-status-switch:checked {
          background-color: var(--bs-success);

          border-color: var(--bs-success);
        }

        .package-status-switch:focus {
          box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.12);
        }
      `}</style>
    </>
  )
}

export default EditPackageDrawer
