'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React, { useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import AddPackageDrawer from './AddPackageDrawer'
import EditPackageDrawer from './EditPackageDrawer'

/* ======================================================
   TYPES
====================================================== */

type PackageStatus = 'active' | 'inactive'

type PackageItem = {
  id: number
  badge: string
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  status: PackageStatus
}

/* ======================================================
   STATIC DATA
====================================================== */

const packagesData: PackageItem[] = [
  {
    id: 1,
    badge: 'Basic',
    name: 'Basic Package',
    price: 1200,
    duration: '1 Month',
    description: 'Perfect for new sellers starting their online business.',
    features: ['Up to 20 Products', 'Order Management', 'Seller Dashboard', 'Email Support'],
    status: 'active',
  },

  {
    id: 2,
    badge: 'Popular',
    name: 'Professional Package',
    price: 2500,
    duration: '3 Months',
    description: 'Designed for growing sellers who need more products and advanced features.',
    features: ['Up to 100 Products', 'Order Management', 'Seller Dashboard', 'Priority Support', 'Sales Reports'],
    status: 'active',
  },

  {
    id: 3,
    badge: 'Premium',
    name: 'Premium Package',
    price: 5000,
    duration: '12 Months',
    description: 'Complete package for established sellers with advanced business tools.',
    features: ['Unlimited Products', 'Advanced Order Management', 'Seller Dashboard', 'Priority Support', 'Sales Reports', 'Marketing Tools'],
    status: 'active',
  },

  {
    id: 4,
    badge: 'Starter',
    name: 'Starter Package',
    price: 699,
    duration: '1 Month',
    description: 'Entry-level package suitable for small sellers and testing.',
    features: ['Up to 10 Products', 'Basic Dashboard', 'Order Management'],
    status: 'inactive',
  },
]

/* ======================================================
   COMPONENT
====================================================== */

const AllPackages = () => {
  /* ======================================================
     STATES
  ====================================================== */

  const [search, setSearch] = useState<string>('')

  const [packages, setPackages] = useState<PackageItem[]>(packagesData)

  /* ======================================================
     FILTER PACKAGES
  ====================================================== */

  const filteredPackages = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return packages
    }

    return packages.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.badge.toLowerCase().includes(keyword) ||
        item.duration.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.features.some((feature) => feature.toLowerCase().includes(keyword)),
    )
  }, [search, packages])

  /* ======================================================
     PRICE FORMAT
  ====================================================== */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  /* ======================================================
     STATUS TOGGLE
  ====================================================== */

  const handleStatusToggle = (id: number) => {
    setPackages((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,

              status: item.status === 'active' ? 'inactive' : 'active',
            }
          : item,
      ),
    )

    /*
      API CALL EXAMPLE

      const selectedPackage =
        packages.find(
          (item) =>
            item.id === id,
        )

      if (!selectedPackage) {
        return
      }

      const newStatus =
        selectedPackage.status ===
        'active'
          ? 'inactive'
          : 'active'

      await axios.patch(
        `/api/packages/${id}/status`,
        {
          status: newStatus,
        },
      )
    */
  }

  /* ======================================================
     DELETE
  ====================================================== */

  const handleDeletePackage = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this package?')

    if (!confirmed) {
      return
    }

    setPackages((prev) => prev.filter((item) => item.id !== id))

    /*
      API CALL

      await axios.delete(
        `/api/packages/${id}`,
      )
    */
  }

  /* ======================================================
     RETURN
  ====================================================== */

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card className="border-0 shadow-sm">
            {/* ==================================================
                HEADER
            ================================================== */}

            <CardHeader className="bg-white border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <CardTitle as="h4" className="mb-1">
                    All Packages
                  </CardTitle>

                  <p className="text-muted mb-0">Manage seller subscription packages.</p>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/* SEARCH */}

                  <div
                    className="position-relative"
                    style={{
                      minWidth: 260,
                    }}>
                    <input
                      type="search"
                      className="form-control ps-5"
                      placeholder="Search packages..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoComplete="off"
                    />

                    <IconifyIcon
                      icon="solar:magnifer-linear"
                      width={18}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    />
                  </div>

                  {/* ADD PACKAGE */}

                  <AddPackageDrawer />
                </div>
              </div>
            </CardHeader>

            {/* ==================================================
                BODY
            ================================================== */}

            <CardBody>
              {/* PACKAGE COUNT */}

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <div className="text-muted">
                  Showing <strong>{filteredPackages.length}</strong> packages
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="d-flex align-items-center gap-2 small">
                    <span className="package-status-dot bg-success" />
                    {packages.filter((item) => item.status === 'active').length} Active
                  </span>

                  <span className="d-flex align-items-center gap-2 small">
                    <span className="package-status-dot bg-danger" />
                    {packages.filter((item) => item.status === 'inactive').length} Inactive
                  </span>
                </div>
              </div>

              {/* ==================================================
                  PACKAGE CARDS
              ================================================== */}

              <Row className="g-4">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((item) => (
                    <Col key={item.id} xxl={4} xl={4} lg={6} md={6} sm={12}>
                      <Card className={`package-card h-100 ${item.status === 'inactive' ? 'package-card-inactive' : ''}`}>
                        <CardBody className="p-0 d-flex flex-column">
                          {/* ==================================
                                TOP AREA
                            ================================== */}

                          <div className="package-card-top p-4">
                            {/* BADGE + STATUS */}

                            <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                              {/* PACKAGE BADGE */}

                              <div className="package-badge">
                                <IconifyIcon icon="solar:medal-ribbon-star-bold-duotone" width={17} />

                                {item.badge}
                              </div>

                              {/* STATUS TOGGLE */}

                              <div className="d-flex align-items-center gap-2">
                                <span className={`package-status-label ${item.status === 'active' ? 'text-success' : 'text-danger'}`}>
                                  {item.status === 'active' ? 'Active' : 'Inactive'}
                                </span>

                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={item.status === 'active'}
                                  aria-label={`${item.status === 'active' ? 'Deactivate' : 'Activate'} ${item.name}`}
                                  className={`package-status-toggle ${item.status === 'active' ? 'active' : ''}`}
                                  onClick={() => handleStatusToggle(item.id)}
                                  title={item.status === 'active' ? 'Deactivate package' : 'Activate package'}>
                                  <span className="package-status-toggle-thumb" />
                                </button>
                              </div>
                            </div>

                            {/* PACKAGE ICON + NAME */}

                            <div className="d-flex align-items-center gap-3 mb-3">
                              <div className="package-main-icon">
                                <IconifyIcon icon="solar:box-bold-duotone" width={29} />
                              </div>

                              <div className="min-w-0">
                                <small className="text-muted d-block mb-1">Package Name</small>

                                <h4 className="mb-0 fw-bold text-truncate">{item.name}</h4>
                              </div>
                            </div>

                            {/* PRICE */}

                            <div className="package-price-wrap">
                              <span className="package-currency">AED</span>

                              <span className="package-price">{formatPrice(item.price)}</span>

                              <span className="package-duration-text">/ {item.duration}</span>
                            </div>
                          </div>

                          {/* ==================================
                                CONTENT
                            ================================== */}

                          <div className="p-4 pt-3 flex-grow-1">
                            {/* DURATION */}

                            <div className="package-info-row">
                              <div className="package-info-icon">
                                <IconifyIcon icon="solar:calendar-linear" width={18} />
                              </div>

                              <div>
                                <small>Duration</small>

                                <strong>{item.duration}</strong>
                              </div>
                            </div>

                            {/* DESCRIPTION */}

                            <div className="mt-4">
                              <h6 className="package-section-label">Package Description</h6>

                              <p className="text-muted package-description mb-0">{item.description}</p>
                            </div>

                            {/* ==================================
                                  FEATURES
                              ================================== */}

                            <div className="mt-4">
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="package-section-label mb-0">Package Features</h6>

                                <span className="package-feature-count">{item.features.length} Features</span>
                              </div>

                              <div className="package-feature-list">
                                {item.features.map((feature, index) => (
                                  <div key={`${item.id}-${index}`} className="package-feature-item">
                                    <IconifyIcon icon="solar:check-circle-bold" width={18} className="text-success" />

                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* ==================================
                                FOOTER ACTIONS
                            ================================== */}

                          <div className="package-card-footer p-3 border-top">
                            <div className="d-flex align-items-center justify-content-between gap-2">
                              {/* VIEW DETAILS */}

                              <div className="d-flex gap-2">
                                {/* EDIT */}

                                <EditPackageDrawer />

                                {/* DELETE */}

                                <Button
                                  type="button"
                                  variant="soft-danger"
                                  size="sm"
                                  className="package-action-btn"
                                  title="Delete Package"
                                  onClick={() => handleDeletePackage(item.id)}>
                                  <IconifyIcon icon="solar:trash-bin-trash-linear" width={17} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))
                ) : (
                  /* ============================================
                     EMPTY STATE
                  ============================================ */

                  <Col xs={12}>
                    <div className="text-center py-5">
                      <div className="package-empty-icon mx-auto mb-3">
                        <IconifyIcon icon="solar:box-minimalistic-linear" width={35} />
                      </div>

                      <h5>No Packages Found</h5>

                      <p className="text-muted mb-0">No package matches your search.</p>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ======================================================
          CSS
      ====================================================== */}

      <style jsx global>{`
        /* ==================================================
           CARD
        ================================================== */

        .package-card {
          position: relative;

          border: 1px solid #e7ebf0;

          border-radius: 16px;

          overflow: hidden;

          background: #ffffff;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            opacity 0.2s ease;
        }

        .package-card:hover {
          transform: translateY(-3px);

          border-color: #cfd8e3;

          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        .package-card-inactive {
          background: #fcfcfd;
        }

        /* ==================================================
           TOP
        ================================================== */

        .package-card-top {
          position: relative;

          background: linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.055) 0%, rgba(var(--bs-primary-rgb), 0.01) 100%);

          border-bottom: 1px solid rgba(var(--bs-primary-rgb), 0.08);
        }

        /* ==================================================
           PACKAGE BADGE
        ================================================== */

        .package-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 10px;

          border-radius: 8px;

          font-size: 12px;

          font-weight: 600;

          color: var(--bs-primary);

          background: rgba(var(--bs-primary-rgb), 0.1);

          white-space: nowrap;
        }

        /* ==================================================
           PACKAGE MAIN ICON
        ================================================== */

        .package-main-icon {
          width: 52px;

          height: 52px;

          min-width: 52px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 13px;

          color: var(--bs-primary);

          background: rgba(var(--bs-primary-rgb), 0.1);

          border: 1px solid rgba(var(--bs-primary-rgb), 0.1);
        }

        /* ==================================================
           PRICE
        ================================================== */

        .package-price-wrap {
          display: flex;

          align-items: baseline;

          gap: 5px;

          flex-wrap: wrap;

          margin-top: 18px;
        }

        .package-currency {
          font-size: 13px;

          font-weight: 700;

          color: var(--bs-primary);
        }

        .package-price {
          font-size: 28px;

          line-height: 1;

          font-weight: 700;

          color: #1e293b;
        }

        .package-duration-text {
          font-size: 12px;

          color: #8a94a6;
        }

        /* ==================================================
           STATUS TOGGLE
        ================================================== */

        .package-status-label {
          font-size: 12px;

          font-weight: 700;

          white-space: nowrap;
        }

        .package-status-toggle {
          position: relative;

          width: 46px;

          height: 24px;

          min-width: 46px;

          padding: 0;

          border: 0;

          outline: 0;

          border-radius: 50px;

          background: #d7dce3;

          cursor: pointer;

          transition: background 0.25s ease;
        }

        .package-status-toggle.active {
          background: var(--bs-success);
        }

        .package-status-toggle-thumb {
          position: absolute;

          top: 3px;

          left: 3px;

          width: 18px;

          height: 18px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

          transition: transform 0.25s ease;
        }

        .package-status-toggle.active .package-status-toggle-thumb {
          transform: translateX(22px);
        }

        .package-status-toggle:hover {
          opacity: 0.92;
        }

        .package-status-toggle:focus-visible {
          box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.15);
        }

        .package-status-dot {
          display: inline-block;

          width: 8px;

          height: 8px;

          min-width: 8px;

          border-radius: 50%;
        }

        /* ==================================================
           DETAILS
        ================================================== */

        .package-info-row {
          display: flex;

          align-items: center;

          gap: 10px;

          padding: 11px 12px;

          border-radius: 10px;

          background: #f8fafc;

          border: 1px solid #edf0f4;
        }

        .package-info-row small {
          display: block;

          color: #8a94a6;

          font-size: 11px;

          margin-bottom: 2px;
        }

        .package-info-row strong {
          display: block;

          font-size: 13px;

          color: #253045;
        }

        .package-info-icon {
          width: 35px;

          height: 35px;

          min-width: 35px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: var(--bs-primary);

          background: #ffffff;

          border: 1px solid #e7eaf0;
        }

        /* ==================================================
           DESCRIPTION
        ================================================== */

        .package-section-label {
          font-size: 13px;

          font-weight: 700;

          color: #334155;
        }

        .package-description {
          font-size: 13px;

          line-height: 1.6;
        }

        /* ==================================================
           FEATURES
        ================================================== */

        .package-feature-count {
          display: inline-flex;

          align-items: center;

          padding: 4px 8px;

          border: 1px solid #e4e8ee;

          border-radius: 6px;

          color: #64748b;

          background: #f8fafc;

          font-size: 11px;

          font-weight: 600;
        }

        .package-feature-list {
          display: flex;

          flex-direction: column;

          gap: 9px;
        }

        .package-feature-item {
          display: flex;

          align-items: flex-start;

          gap: 8px;

          font-size: 13px;

          font-weight: 500;

          color: #475569;
        }

        .package-feature-item svg {
          flex-shrink: 0;

          margin-top: 1px;
        }

        /* ==================================================
           FOOTER
        ================================================== */

        .package-card-footer {
          background: #fafbfc;
        }

        .package-action-btn {
          width: 34px;

          height: 34px;

          padding: 0;

          display: inline-flex;

          align-items: center;

          justify-content: center;
        }

        /* ==================================================
           EMPTY
        ================================================== */

        .package-empty-icon {
          width: 70px;

          height: 70px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          color: var(--bs-primary);

          background: rgba(var(--bs-primary-rgb), 0.08);
        }

        .min-w-0 {
          min-width: 0;
        }

        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 575.98px) {
          .package-card-top {
            padding: 16px !important;
          }

          .package-price {
            font-size: 24px;
          }

          .package-status-label {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default AllPackages
