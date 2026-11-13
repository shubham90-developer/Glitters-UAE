'use client'
import { useCreateCounterMutation, useGetCounterQuery, useUpdateCounterMutation } from '@/store/counterApi'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

const Counter = () => {
  const { data: counterData, isLoading, refetch } = useGetCounterQuery()
  const [createcounter, { isLoading: creating }] = useCreateCounterMutation()
  const [updatecounter, { isLoading: updating }] = useUpdateCounterMutation()

  // @ts-ignore
  const counter = counterData?.data || counterData?.[0]

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    happyCustomers: '',
    products: '',
    ordersDelivered: '',
    customerRating: '',
  })

  // fetch data
  useEffect(() => {
    if (counter) {
      setFormData({
        title: counter.title,
        subTitle: counter.subTitle,
        happyCustomers: counter.happyCustomers,
        products: counter.products,
        ordersDelivered: counter.ordersDelivered,
        customerRating: counter.customerRating,
      })
    }
  }, [counter])

  // handlechange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (counter) {
        await updatecounter({
          id: counter._id,
          data: formData as any,
        }).unwrap()
        toast.success('Counter updated successfully')
      } else {
        await createcounter(formData as any).unwrap()
        toast.success('Counter created successfully')
      }
      refetch()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Counter</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row>
                {/* <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input type="text" className="form-control" placeholder="" name="title" value={formData.title} onChange={handleChange} />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Sub-Title *</label>
                    <input type="text" className="form-control" placeholder="" name="subTitle" value={formData.subTitle} onChange={handleChange} />
                  </div>
                </Col> */}
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label">Happy Customers*</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="happyCustomers"
                      value={formData.happyCustomers}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label">Products *</label>
                    <input type="text" className="form-control" placeholder="" name="products" value={formData.products} onChange={handleChange} />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label">Orders Delivered *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="ordersDelivered"
                      value={formData.ordersDelivered}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label">Customer Rating *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="customerRating"
                      value={formData.customerRating}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>

              {/* Submit */}
              <button type="submit" className="btn btn-primary w-100 mt-1" disabled={creating || updating}>
                {creating || updating ? 'Please wait...' : counter?._id ? 'Update counter' : 'Create counter'}
              </button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default Counter
