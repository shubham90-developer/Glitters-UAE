import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

const PaymentList = () => {
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>
            {/* ================= HEADER ================= */}
            <div className="d-flex card-header justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <CardTitle as="h4" className="mb-0">
                  Payment List
                </CardTitle>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Selected Count */}

                {/* Search */}
                <div className="position-relative">
                  <input type="search" className="form-control form-control-sm ps-4" placeholder="Search..." autoComplete="off" />

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

                      {/* Basic Details */}
                      <th className="text-nowrap">Sr No.</th>
                      <th className="text-nowrap">Payment ID</th>
                      <th className="text-nowrap">Order ID</th>

                      {/* Customer Details */}
                      <th className="text-nowrap">Customer Name</th>
                      <th className="text-nowrap">Email</th>
                      <th className="text-nowrap">Phone</th>

                      {/* Amount Details */}
                      <th className="text-nowrap">Order Amount</th>
                      <th className="text-nowrap">Discount</th>
                      <th className="text-nowrap">Shipping Charge</th>
                      <th className="text-nowrap">Paid Amount</th>
                      <th className="text-nowrap">Gateway Fee</th>
                      <th className="text-nowrap">Net Amount</th>

                      {/* Payment Details */}
                      <th className="text-nowrap">Payment Method</th>
                      <th className="text-nowrap">Payment Gateway</th>
                      <th className="text-nowrap">Transaction ID</th>
                      <th className="text-nowrap">Gateway Transaction ID</th>

                      {/* Status */}
                      <th className="text-nowrap">Payment Status</th>
                      <th className="text-nowrap">Order Status</th>

                      {/* Refund Details */}
                      <th className="text-nowrap">Refund Status</th>
                      <th className="text-nowrap">Refund Amount</th>
                      <th className="text-nowrap">Refund ID</th>

                      {/* Date Details */}
                      <th className="text-nowrap">Payment Date</th>
                      <th className="text-nowrap">Refund Date</th>

                      {/* Notes */}
                      <th className="text-nowrap">Payment Notes</th>

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

export default PaymentList
