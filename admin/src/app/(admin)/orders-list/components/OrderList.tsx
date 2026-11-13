import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

const OrderList = () => {
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>
            {/* ================= HEADER ================= */}
            <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <CardTitle as="h4" className="mb-0">
                  Order List
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

                      <th className="text-nowrap">Sr No.</th>
                      <th className="text-nowrap">Order ID</th>
                      <th className="text-nowrap">Product Details</th>
                      <th className="text-nowrap">Customer Name</th>
                      <th className="text-nowrap">Email</th>
                      <th className="text-nowrap">Phone</th>
                      <th className="text-nowrap">Address</th>
                      <th className="text-nowrap">City</th>
                      <th className="text-nowrap">Pin Code</th>
                      <th className="text-nowrap">Total Amount</th>
                      <th className="text-nowrap">Payment Status</th>
                      <th className="text-nowrap">Payment Method</th>
                      <th className="text-nowrap">Order Date</th>

                      {/* Order Status */}
                      <th className="text-nowrap">Order Status</th>

                      {/* Pending Fields */}
                      <th className="text-nowrap">Pending Since</th>
                      <th className="text-nowrap">Pending Reason</th>

                      {/* Cancel Fields */}
                      <th className="text-nowrap">Cancel Reason</th>

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

export default OrderList
