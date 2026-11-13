'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React, { useMemo, useState } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

/* ======================================================
   TYPES
====================================================== */

type VendorStatus = 'approved' | 'pending' | 'rejected' | 'inactive'

type Vendor = {
  id: number
  businessName: string
  businessType: string
  registeredNo: string
  gstNo: string
  sellerType: string
  year: string
  status: VendorStatus
  email: string
  phone: string
  address: string
}

/* ======================================================
   STATIC DATA
====================================================== */

const vendorsData: Vendor[] = [
  {
    id: 1,
    businessName: 'Satish Consultancy Services',
    businessType: 'Partnership',
    registeredNo: '7800787807879009',
    gstNo: '27ABCDE1234F1Z5',
    sellerType: 'Distributor',
    year: '2026',
    status: 'approved',
    email: 'satishconsultant@gmail.com',
    phone: '+91 98765 43210',
    address: 'Dhanbad, Maharashtra, India',
  },
  {
    id: 2,
    businessName: 'Royal Fashion Store',
    businessType: 'Proprietorship',
    registeredNo: 'REG20260002',
    gstNo: '27AAACR5055K1Z2',
    sellerType: 'Retailer',
    year: '2026',
    status: 'pending',
    email: 'royalfashion@gmail.com',
    phone: '+91 99887 66554',
    address: 'Mumbai, Maharashtra, India',
  },
  {
    id: 3,
    businessName: 'Shree Enterprises',
    businessType: 'Private Limited',
    registeredNo: 'REG20260003',
    gstNo: '08ABCDE5678M1Z5',
    sellerType: 'Wholesaler',
    year: '2025',
    status: 'approved',
    email: 'shreeenterprises@gmail.com',
    phone: '+91 98123 45678',
    address: 'Jaipur, Rajasthan, India',
  },
  {
    id: 4,
    businessName: 'Urban Lifestyle',
    businessType: 'Proprietorship',
    registeredNo: 'REG20260004',
    gstNo: '24ABCDE1111P1Z1',
    sellerType: 'Retailer',
    year: '2026',
    status: 'inactive',
    email: 'urbanlifestyle@gmail.com',
    phone: '+91 97654 32109',
    address: 'Ahmedabad, Gujarat, India',
  },
]

/* ======================================================
   STATUS CONFIG
====================================================== */

const getStatusConfig = (status: VendorStatus) => {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        bg: 'success',
        icon: 'solar:verified-check-bold',
      }

    case 'pending':
      return {
        label: 'Pending',
        bg: 'warning',
        icon: 'solar:clock-circle-bold',
      }

    case 'rejected':
      return {
        label: 'Rejected',
        bg: 'danger',
        icon: 'solar:close-circle-bold',
      }

    case 'inactive':
      return {
        label: 'Inactive',
        bg: 'secondary',
        icon: 'solar:minus-circle-bold',
      }

    default:
      return {
        label: 'Unknown',
        bg: 'secondary',
        icon: 'solar:question-circle-bold',
      }
  }
}

/* ======================================================
   COMPONENT
====================================================== */

const AllVendors = () => {
  const [search, setSearch] = useState<string>('')
  const [selected, setSelected] = useState<number[]>([])

  /* ======================================================
     FILTER
  ====================================================== */

  const filteredVendors = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return vendorsData
    }

    return vendorsData.filter((vendor) => {
      return (
        vendor.businessName.toLowerCase().includes(value) ||
        vendor.businessType.toLowerCase().includes(value) ||
        vendor.registeredNo.toLowerCase().includes(value) ||
        vendor.gstNo.toLowerCase().includes(value) ||
        vendor.sellerType.toLowerCase().includes(value) ||
        vendor.email.toLowerCase().includes(value) ||
        vendor.phone.toLowerCase().includes(value)
      )
    })
  }, [search])

  /* ======================================================
     SELECT VENDOR
  ====================================================== */

  const handleSelectVendor = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  /* ======================================================
     SELECT ALL
  ====================================================== */

  const handleSelectAll = () => {
    const visibleIds = filteredVendors.map((vendor) => vendor.id)

    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id))

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)))

      return
    }

    setSelected((prev) => [...new Set([...prev, ...visibleIds])])
  }

  const isAllSelected = filteredVendors.length > 0 && filteredVendors.every((vendor) => selected.includes(vendor.id))

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
                    All Vendors
                  </CardTitle>

                  <p className="text-muted mb-0">Manage and review all registered vendors.</p>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {/* SELECTED COUNT */}

                  {selected.length > 0 && (
                    <div className="px-3 py-2 rounded bg-primary-subtle text-primary fw-semibold">{selected.length} Selected</div>
                  )}

                  {/* SEARCH */}

                  <div
                    className="position-relative"
                    style={{
                      minWidth: '260px',
                    }}>
                    <input
                      type="search"
                      className="form-control ps-5"
                      placeholder="Search vendors..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoComplete="off"
                    />

                    <IconifyIcon
                      icon="solar:magnifer-linear"
                      width={19}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* ==================================================
                CARD BODY
            ================================================== */}

            <CardBody>
              {/* ==================================================
                  TOP CONTROL
              ================================================== */}

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <input type="checkbox" className="form-check-input mt-0" checked={isAllSelected} onChange={handleSelectAll} id="selectAllVendors" />

                  <label
                    htmlFor="selectAllVendors"
                    className="mb-0 text-muted"
                    style={{
                      cursor: 'pointer',
                    }}>
                    Select All
                  </label>
                </div>

                <div className="text-muted">
                  Showing <strong>{filteredVendors.length}</strong> vendors
                </div>
              </div>

              {/* ==================================================
                  VENDOR CARDS
              ================================================== */}

              <Row className="g-4">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => {
                    const status = getStatusConfig(vendor.status)

                    const isSelected = selected.includes(vendor.id)

                    return (
                      <Col key={vendor.id} xxl={4} xl={6} lg={6} md={12}>
                        <Card className={`h-100 vendor-card ${isSelected ? 'vendor-card-selected' : ''}`}>
                          <CardBody className="p-0">
                            {/* ==================================
                                CARD HEADER
                            ================================== */}

                            <div className="p-3 border-bottom">
                              <div className="d-flex align-items-start justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3 min-w-0">
                                  {/* CHECKBOX */}

                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={isSelected}
                                      onChange={() => handleSelectVendor(vendor.id)}
                                    />
                                  </div>

                                  {/* ICON */}

                                  <div className="vendor-icon">
                                    <IconifyIcon icon="solar:shop-2-bold-duotone" width={27} />
                                  </div>

                                  {/* NAME */}

                                  <div className="min-w-0">
                                    <h5 className="mb-1 fw-bold text-truncate">{vendor.businessName}</h5>

                                    <div className="d-flex align-items-center gap-1 text-muted">
                                      <IconifyIcon icon="solar:buildings-2-linear" width={15} />

                                      <span>{vendor.businessType}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* STATUS */}

                                <Badge bg={status.bg} className="d-inline-flex align-items-center gap-1 px-2 py-2">
                                  <IconifyIcon icon={status.icon} width={15} />

                                  {status.label}
                                </Badge>
                              </div>
                            </div>

                            {/* ==================================
                                DETAILS
                            ================================== */}

                            <div className="p-3">
                              <Row className="g-3">
                                {/* REGISTERED NUMBER */}

                                <Col sm={6}>
                                  <div className="vendor-detail-box">
                                    <div className="detail-icon">
                                      <IconifyIcon icon="solar:document-text-linear" width={18} />
                                    </div>

                                    <div>
                                      <div className="detail-label">Registered No.</div>

                                      <div className="detail-value">{vendor.registeredNo}</div>
                                    </div>
                                  </div>
                                </Col>

                                {/* GST */}

                                <Col sm={6}>
                                  <div className="vendor-detail-box">
                                    <div className="detail-icon">
                                      <IconifyIcon icon="solar:bill-list-linear" width={18} />
                                    </div>

                                    <div>
                                      <div className="detail-label">GST No.</div>

                                      <div className="detail-value">{vendor.gstNo}</div>
                                    </div>
                                  </div>
                                </Col>

                                {/* SELLER TYPE */}

                                <Col sm={6}>
                                  <div className="vendor-detail-box">
                                    <div className="detail-icon">
                                      <IconifyIcon icon="solar:user-id-linear" width={18} />
                                    </div>

                                    <div>
                                      <div className="detail-label">Seller Type</div>

                                      <div className="detail-value">{vendor.sellerType}</div>
                                    </div>
                                  </div>
                                </Col>

                                {/* YEAR */}

                                <Col sm={6}>
                                  <div className="vendor-detail-box">
                                    <div className="detail-icon">
                                      <IconifyIcon icon="solar:calendar-linear" width={18} />
                                    </div>

                                    <div>
                                      <div className="detail-label">Year</div>

                                      <div className="detail-value">{vendor.year}</div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              {/* ==================================
                                  CONTACT
                              ================================== */}

                              <div className="vendor-contact mt-3">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <IconifyIcon icon="solar:letter-linear" width={17} className="text-primary" />

                                  <span className="text-break">{vendor.email}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <IconifyIcon icon="solar:phone-linear" width={17} className="text-primary" />

                                  <span>{vendor.phone}</span>
                                </div>

                                <div className="d-flex align-items-start gap-2">
                                  <IconifyIcon icon="solar:map-point-linear" width={17} className="text-primary mt-1" />

                                  <span>{vendor.address}</span>
                                </div>
                              </div>
                            </div>

                            {/* ==================================
                                FOOTER ACTIONS
                            ================================== */}

                            <div className="p-3 border-top bg-light-subtle">
                              <div className="d-flex align-items-center justify-content-between gap-2">
                                <Button variant="soft-primary" size="sm" className="d-flex align-items-center gap-1">
                                  <IconifyIcon icon="solar:eye-linear" width={17} />
                                  View Details
                                </Button>

                                <div className="d-flex gap-2">
                                  <Button
                                    variant="soft-info"
                                    size="sm"
                                    className="d-flex align-items-center justify-content-center"
                                    title="Edit Vendor">
                                    <IconifyIcon icon="solar:pen-new-square-linear" width={17} />
                                  </Button>

                                  <Button
                                    variant="soft-danger"
                                    size="sm"
                                    className="d-flex align-items-center justify-content-center"
                                    title="Delete Vendor">
                                    <IconifyIcon icon="solar:trash-bin-trash-linear" width={17} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    )
                  })
                ) : (
                  <Col xs={12}>
                    <div className="text-center py-5">
                      <div className="empty-icon mx-auto mb-3">
                        <IconifyIcon icon="solar:shop-minimalistic-linear" width={34} />
                      </div>

                      <h5>No Vendors Found</h5>

                      <p className="text-muted mb-0">No vendor matches your search.</p>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ==================================================
          STYLES
      ================================================== */}

      <style jsx global>{`
        .vendor-card {
          border: 1px solid #e7eaf0;
          border-radius: 14px;
          overflow: hidden;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
          background: #ffffff;
        }

        .vendor-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.07);
          transform: translateY(-2px);
        }

        .vendor-card-selected {
          border-color: var(--bs-primary);
          box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.08);
        }

        .vendor-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bs-primary);
          background: rgba(var(--bs-primary-rgb), 0.1);
        }

        .vendor-detail-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-height: 65px;
          padding: 10px;
          border: 1px solid #edf0f4;
          border-radius: 10px;
          background: #fafbfc;
        }

        .detail-icon {
          width: 34px;
          height: 34px;
          min-width: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e7eaf0;
        }

        .detail-label {
          color: #8a94a6;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .detail-value {
          color: #263244;
          font-size: 13px;
          font-weight: 600;
          word-break: break-word;
        }

        .vendor-contact {
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          color: #5f6b7a;
          font-size: 13px;
        }

        .empty-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(var(--bs-primary-rgb), 0.08);
          color: var(--bs-primary);
        }

        .min-w-0 {
          min-width: 0;
        }

        @media (max-width: 575.98px) {
          .vendor-card .card-body {
            font-size: 13px;
          }

          .vendor-detail-box {
            min-height: auto;
          }
        }
      `}</style>
    </>
  )
}

export default AllVendors
