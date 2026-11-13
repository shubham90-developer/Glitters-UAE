import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

const PendingOrderList = () => {
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>
            {/* ================= HEADER ================= */}
            <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <CardTitle as="h4" className="mb-0">
                  Pending Order List
                </CardTitle>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Selected Count */}

                {/* Search */}
                <div className="position-relative">
                  <input type="search" className="form-control form-control-sm ps-4" placeholder="Search products..." autoComplete="off" />

                  <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
                </div>
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <CardBody>
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      {/* Checkbox */}
                      <th
                        className="text-center"
                        style={{
                          width: '45px',
                          minWidth: '45px',
                        }}>
                        <input type="checkbox" className="form-check-input" />
                      </th>

                      {/* Basic Order Details */}
                      <th className="text-nowrap">Sr No.</th>
                      <th className="text-nowrap">Order ID</th>
                      <th className="text-nowrap">Product Details</th>
                      <th className="text-nowrap">Qty</th>

                      {/* Customer Details */}
                      <th className="text-nowrap">Customer Name</th>
                      <th className="text-nowrap">Email</th>
                      <th className="text-nowrap">Phone</th>

                      {/* Delivery Address */}
                      <th className="text-nowrap">Address</th>
                      <th className="text-nowrap">City</th>
                      <th className="text-nowrap">State</th>
                      <th className="text-nowrap">Pin Code</th>

                      {/* Amount / Payment */}
                      <th className="text-nowrap">Subtotal</th>
                      <th className="text-nowrap">Shipping Charge</th>
                      <th className="text-nowrap">Discount</th>
                      <th className="text-nowrap">Total Amount</th>
                      <th className="text-nowrap">Payment Status</th>
                      <th className="text-nowrap">Payment Method</th>
                      <th className="text-nowrap">Transaction ID</th>

                      {/* Order Date */}
                      <th className="text-nowrap">Order Date</th>

                      {/* Pending Order Details */}
                      <th className="text-nowrap">Pending Since</th>
                      <th className="text-nowrap">Pending Duration</th>
                      <th className="text-nowrap">Pending Reason</th>
                      <th className="text-nowrap">Pending Stage</th>
                      <th className="text-nowrap">Pending By</th>
                      <th className="text-nowrap">Assigned To</th>
                      <th className="text-nowrap">Expected Process Date</th>
                      <th className="text-nowrap">Follow-up Date</th>
                      <th className="text-nowrap">Pending Notes</th>

                      {/* Status */}
                      <th className="text-nowrap">Order Status</th>

                      {/* Action */}
                      <th className="text-nowrap">Action</th>
                    </tr>
                  </thead>

                  <tbody></tbody>
                </table>
              </div>
            </CardBody>

            {/* ================= PAGINATION ================= */}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PendingOrderList
