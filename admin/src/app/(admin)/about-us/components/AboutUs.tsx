'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

import { useCreateAboutUsMutation, useGetAboutUsQuery, useUpdateAboutUsMutation } from '@/store/aboutUsApi'

// ============================================
// INITIAL FORM DATA
// ============================================

const initialFormData = {
  // Hero
  title: '',
  subTitle: '',
  shortDesc: '',

  // Counters
  ProductsCounter: '',
  CustomersCounter: '',
  DeliveriesCounter: '',
  Rating: '',

  // Trusted
  trustedTitle: '',
  trustedDesc: '',

  // Story
  storySubTitle: '',
  storyTitle: '',
  storyDesc: '',
  storySecondDesc: '',

  // Features
  customerFirstTitle: '',
  customerFirstDesc: '',

  qualityFocusTitle: '',
  qualityFocusDesc: '',

  transparentPricingTitle: '',
  transparentPricingDesc: '',

  reliableSupportTitle: '',
  reliableSupportDesc: '',

  // Values
  valuesTitle: '',
  valuesSubTitle: '',

  CustomerFirstTitle: '',
  CustomerFirstDesc: '',

  TrustSecurityTitle: '',
  TrustSecurityDesc: '',

  QualityTitle: '',
  QualityDesc: '',

  ContinuousImprovementTitle: '',
  ContinuousImprovementDesc: '',

  // Why Shop
  whyShopSubTitle: '',
  whyShopTitle: '',
  whyShopDesc: '',

  wideSelectionTitle: '',
  wideSelectionDesc: '',

  fastDeliveryTitle: '',
  fastDeliveryDesc: '',

  secureCheckoutTitle: '',
  secureCheckoutDesc: '',

  easyReturnsTitle: '',
  easyReturnsDesc: '',

  // Promise
  promiseTitle: '',
  promiseDesc: '',
  promisePoint1: '',
  promisePoint2: '',
  promisePoint3: '',
  promisePoint4: '',

  status: 'active',
}

const AboutUs = () => {
  // ============================================
  // API
  // ============================================

  const { data: aboutUsData, isLoading, isError, refetch } = useGetAboutUsQuery()

  const [createAboutUs, { isLoading: creating }] = useCreateAboutUsMutation()

  const [updateAboutUs, { isLoading: updating }] = useUpdateAboutUsMutation()

  // ============================================
  // NORMALIZE RESPONSE
  // ============================================

  const aboutData = useMemo(() => {
    const response: any = aboutUsData

    if (!response) return null

    // { data: [...] }
    if (Array.isArray(response?.data)) {
      return response.data[0] || null
    }

    // { data: {} }
    if (response?.data && typeof response.data === 'object') {
      return response.data
    }

    // direct array
    if (Array.isArray(response)) {
      return response[0] || null
    }

    return response
  }, [aboutUsData])

  // ============================================
  // FORM STATE
  // ============================================

  const [formData, setFormData] = useState(initialFormData)

  // ============================================
  // STORY IMAGE
  // ============================================

  const [storyImg, setStoryImg] = useState<File | null>(null)

  const [storyImgPreview, setStoryImgPreview] = useState('')

  // ============================================
  // LOAD EXISTING DATA
  // ============================================

  useEffect(() => {
    if (!aboutData) return

    setFormData({
      title: aboutData.title || '',
      subTitle: aboutData.subTitle || '',
      shortDesc: aboutData.shortDesc || '',

      ProductsCounter: aboutData.ProductsCounter || '',
      CustomersCounter: aboutData.CustomersCounter || '',
      DeliveriesCounter: aboutData.DeliveriesCounter || '',
      Rating: aboutData.Rating || '',

      trustedTitle: aboutData.trustedTitle || '',
      trustedDesc: aboutData.trustedDesc || '',

      storySubTitle: aboutData.storySubTitle || '',
      storyTitle: aboutData.storyTitle || '',
      storyDesc: aboutData.storyDesc || '',
      storySecondDesc: aboutData.storySecondDesc || '',

      customerFirstTitle: aboutData.customerFirstTitle || '',
      customerFirstDesc: aboutData.customerFirstDesc || '',

      qualityFocusTitle: aboutData.qualityFocusTitle || '',
      qualityFocusDesc: aboutData.qualityFocusDesc || '',

      transparentPricingTitle: aboutData.transparentPricingTitle || '',
      transparentPricingDesc: aboutData.transparentPricingDesc || '',

      reliableSupportTitle: aboutData.reliableSupportTitle || '',
      reliableSupportDesc: aboutData.reliableSupportDesc || '',

      valuesTitle: aboutData.valuesTitle || '',
      valuesSubTitle: aboutData.valuesSubTitle || '',

      CustomerFirstTitle: aboutData.CustomerFirstTitle || '',
      CustomerFirstDesc: aboutData.CustomerFirstDesc || '',

      TrustSecurityTitle: aboutData.TrustSecurityTitle || '',
      TrustSecurityDesc: aboutData.TrustSecurityDesc || '',

      QualityTitle: aboutData.QualityTitle || '',
      QualityDesc: aboutData.QualityDesc || '',

      ContinuousImprovementTitle: aboutData.ContinuousImprovementTitle || '',
      ContinuousImprovementDesc: aboutData.ContinuousImprovementDesc || '',

      whyShopSubTitle: aboutData.whyShopSubTitle || '',
      whyShopTitle: aboutData.whyShopTitle || '',
      whyShopDesc: aboutData.whyShopDesc || '',

      wideSelectionTitle: aboutData.wideSelectionTitle || '',
      wideSelectionDesc: aboutData.wideSelectionDesc || '',

      fastDeliveryTitle: aboutData.fastDeliveryTitle || '',
      fastDeliveryDesc: aboutData.fastDeliveryDesc || '',

      secureCheckoutTitle: aboutData.secureCheckoutTitle || '',
      secureCheckoutDesc: aboutData.secureCheckoutDesc || '',

      easyReturnsTitle: aboutData.easyReturnsTitle || '',
      easyReturnsDesc: aboutData.easyReturnsDesc || '',

      promiseTitle: aboutData.promiseTitle || '',
      promiseDesc: aboutData.promiseDesc || '',
      promisePoint1: aboutData.promisePoint1 || '',
      promisePoint2: aboutData.promisePoint2 || '',
      promisePoint3: aboutData.promisePoint3 || '',
      promisePoint4: aboutData.promisePoint4 || '',

      status: aboutData.status || 'active',
    })

    setStoryImgPreview(aboutData.storyImg || '')

    setStoryImg(null)
  }, [aboutData])

  // ============================================
  // INPUT CHANGE
  // ============================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ============================================
  // STORY IMAGE
  // ============================================

  const handleStoryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select JPG, PNG or WEBP image')

      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')

      e.target.value = ''
      return
    }

    if (storyImgPreview.startsWith('blob:')) {
      URL.revokeObjectURL(storyImgPreview)
    }

    setStoryImg(file)

    setStoryImgPreview(URL.createObjectURL(file))
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
  // SUBMIT CREATE / UPDATE
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      const form = new FormData()

      // append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, String(value ?? ''))
      })

      // image
      if (storyImg) {
        form.append('storyImg', storyImg)
      }

      // ============================================
      // UPDATE
      // ============================================

      if (aboutData?._id) {
        await updateAboutUs({
          id: aboutData._id,
          data: form,
        }).unwrap()

        toast.success('About Us updated successfully')
      }

      // ============================================
      // CREATE
      // ============================================
      else {
        if (!storyImg) {
          toast.error('Story image is required')
          return
        }

        await createAboutUs(form).unwrap()

        toast.success('About Us created successfully')
      }

      setStoryImg(null)

      await refetch()
    } catch (error: any) {
      console.error(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ============================================
  // LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />

        <div className="mt-2">Loading About Us...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load About Us data.</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ============================================
          1. HERO SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Hero Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Title</label>

                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Sub Title</label>

                <input type="text" name="subTitle" className="form-control" value={formData.subTitle} onChange={handleChange} />
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label className="form-label">Short Description</label>

                <textarea rows={4} name="shortDesc" className="form-control" value={formData.shortDesc} onChange={handleChange} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          2. COUNTER SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Counter Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            {[
              ['ProductsCounter', 'Products Counter'],
              ['CustomersCounter', 'Customers Counter'],
              ['DeliveriesCounter', 'Deliveries Counter'],
              ['Rating', 'Rating'],
            ].map(([name, label]) => (
              <Col md={3} sm={6} key={name}>
                <div className="mb-3">
                  <label className="form-label">{label}</label>

                  <input type="text" name={name} className="form-control" value={formData[name as keyof typeof formData]} onChange={handleChange} />
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          3. TRUSTED SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Trusted Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Trusted Title</label>

                <input type="text" name="trustedTitle" className="form-control" value={formData.trustedTitle} onChange={handleChange} />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Trusted Description</label>

                <textarea rows={3} name="trustedDesc" className="form-control" value={formData.trustedDesc} onChange={handleChange} />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          4. STORY SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Story Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Story Sub Title</label>

                <input type="text" name="storySubTitle" className="form-control" value={formData.storySubTitle} onChange={handleChange} />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Story Title</label>

                <input type="text" name="storyTitle" className="form-control" value={formData.storyTitle} onChange={handleChange} />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Story Description</label>

                <textarea rows={4} name="storyDesc" className="form-control" value={formData.storyDesc} onChange={handleChange} />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <label className="form-label">Story Second Description</label>

                <textarea rows={4} name="storySecondDesc" className="form-control" value={formData.storySecondDesc} onChange={handleChange} />
              </div>
            </Col>

            <Col md={12}>
              <div className="mb-3">
                <label className="form-label">Story Image</label>

                <input type="file" className="form-control" accept="image/*" onChange={handleStoryImage} />

                {storyImgPreview && (
                  <div className="mt-3">
                    <Image
                      src={storyImgPreview}
                      alt="Story"
                      width={600}
                      height={300}
                      unoptimized
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          5. CUSTOMER EXPERIENCE SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Customer Experience Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <SectionFields
              title="Customer First"
              titleName="customerFirstTitle"
              descName="customerFirstDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Quality Focus"
              titleName="qualityFocusTitle"
              descName="qualityFocusDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Transparent Pricing"
              titleName="transparentPricingTitle"
              descName="transparentPricingDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Reliable Support"
              titleName="reliableSupportTitle"
              descName="reliableSupportDesc"
              formData={formData}
              handleChange={handleChange}
            />
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          6. VALUES SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Values Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Values Title" name="valuesTitle" value={formData.valuesTitle} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Values Sub Title" name="valuesSubTitle" value={formData.valuesSubTitle} onChange={handleChange} />
            </Col>

            <SectionFields
              title="Customer First"
              titleName="CustomerFirstTitle"
              descName="CustomerFirstDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Trust & Security"
              titleName="TrustSecurityTitle"
              descName="TrustSecurityDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields title="Quality" titleName="QualityTitle" descName="QualityDesc" formData={formData} handleChange={handleChange} />

            <SectionFields
              title="Continuous Improvement"
              titleName="ContinuousImprovementTitle"
              descName="ContinuousImprovementDesc"
              formData={formData}
              handleChange={handleChange}
            />
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          7. WHY SHOP SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Why Shop With Us
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Sub Title" name="whyShopSubTitle" value={formData.whyShopSubTitle} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Title" name="whyShopTitle" value={formData.whyShopTitle} onChange={handleChange} />
            </Col>

            <Col md={12}>
              <TextArea label="Description" name="whyShopDesc" value={formData.whyShopDesc} onChange={handleChange} />
            </Col>

            <SectionFields
              title="Wide Selection"
              titleName="wideSelectionTitle"
              descName="wideSelectionDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Fast Delivery"
              titleName="fastDeliveryTitle"
              descName="fastDeliveryDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Secure Checkout"
              titleName="secureCheckoutTitle"
              descName="secureCheckoutDesc"
              formData={formData}
              handleChange={handleChange}
            />

            <SectionFields
              title="Easy Returns"
              titleName="easyReturnsTitle"
              descName="easyReturnsDesc"
              formData={formData}
              handleChange={handleChange}
            />
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          8. PROMISE SECTION
      ============================================ */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Promise Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Promise Title" name="promiseTitle" value={formData.promiseTitle} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextArea label="Promise Description" name="promiseDesc" value={formData.promiseDesc} onChange={handleChange} />
            </Col>

            {['promisePoint1', 'promisePoint2', 'promisePoint3', 'promisePoint4'].map((name, index) => (
              <Col md={6} key={name}>
                <TextInput label={`Promise Point ${index + 1}`} name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      {/* ============================================
          9. STATUS
      ============================================ */}

      <Card className="mb-4">
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-1">Status</h5>

              <small className="text-muted">Enable or disable About Us page.</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={handleStatusToggle}
                  style={{
                    width: '48px',
                    height: '24px',
                  }}
                />
              </div>

              <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ============================================
          SAVE
      ============================================ */}

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={creating || updating}>
        {creating || updating ? 'Please wait...' : aboutData?._id ? 'Update About Us' : 'Create About Us'}
      </button>
    </form>
  )
}

// ============================================
// REUSABLE TEXT INPUT
// ============================================

const TextInput = ({ label, name, value, onChange }: any) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <input type="text" className="form-control" name={name} value={value} onChange={onChange} />
    </div>
  )
}

// ============================================
// REUSABLE TEXTAREA
// ============================================

const TextArea = ({ label, name, value, onChange }: any) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <textarea rows={4} className="form-control" name={name} value={value} onChange={onChange} />
    </div>
  )
}

// ============================================
// REUSABLE TITLE + DESCRIPTION BLOCK
// ============================================

const SectionFields = ({ title, titleName, descName, formData, handleChange }: any) => {
  return (
    <>
      <Col md={6}>
        <TextInput label={`${title} Title`} name={titleName} value={formData[titleName] || ''} onChange={handleChange} />
      </Col>

      <Col md={6}>
        <TextArea label={`${title} Description`} name={descName} value={formData[descName] || ''} onChange={handleChange} />
      </Col>
    </>
  )
}

export default AboutUs
