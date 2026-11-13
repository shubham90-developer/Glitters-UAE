'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { Col, Row } from 'react-bootstrap'

const AddPackageDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    package_badge: '',
    package_name: '',
    price: '',
    duration: '',
    package_description: '',
    status: 'active',
  })

  const [features, setFeatures] = useState<string[]>([''])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? value : feature)))
  }

  const addFeature = () => {
    setFeatures((prev) => [...prev, ''])
  }

  const removeFeature = (index: number) => {
    if (features.length === 1) {
      setFeatures([''])
      return
    }

    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalData = {
      ...formData,

      package_features: features.filter((feature) => feature.trim() !== ''),
    }

    console.log('PACKAGE DATA:', finalData)
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Packages
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
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
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Add Packages</h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ==========================================
      FORM BODY
  ========================================== */}

          <div className="p-3">
            <div className="row g-3">
              {/* PACKAGE BADGE */}
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

              {/* PACKAGE NAME */}
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

              {/* PRICE */}
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

              {/* DURATION */}
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

              {/* PACKAGE DESCRIPTION */}
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

              {/* ==========================================
          PACKAGE FEATURES
      ========================================== */}

              <div className="col-12">
                <div className="border rounded">
                  {/* FEATURE HEADER */}
                  <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <div>
                      <h6 className="mb-1 fw-semibold">Package Features</h6>

                      <small className="text-muted">Add all features included in this package.</small>
                    </div>

                    <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={addFeature}>
                      <IconifyIcon icon="solar:add-circle-broken" />
                      Add Feature
                    </button>
                  </div>

                  {/* FEATURE ROWS */}
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

                        {/* FEATURE INPUT */}
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

                    {/* ADD ANOTHER */}
                    <button type="button" className="btn btn-outline-primary btn-sm mt-2 d-flex align-items-center gap-2" onClick={addFeature}>
                      <IconifyIcon icon="solar:add-circle-broken" />
                      Add Another Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
      FOOTER
  ========================================== */}

          <div className="p-3 border-top bg-white d-flex gap-2 position-sticky bottom-0">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              <IconifyIcon icon="solar:diskette-broken" />
              Add Package
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddPackageDrawer
