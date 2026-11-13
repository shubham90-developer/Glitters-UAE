'use client'

import { useCreateCareerInfoMutation, useGetCareerInfoQuery, useUpdateCareerInfoMutation } from '@/store/careerinfoApi'
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

import { toast } from 'react-toastify'

// =====================================================
// TYPES
// =====================================================

type EmployeeBenefit = {
  title: string
  description: string
}

type HiringProcess = {
  step: string
  title: string
  description: string
}

type CareerFormData = {
  badgeText: string

  heroTitle: string
  heroHighlight: string
  heroDescription: string

  benefitsLabel: string
  benefitsTitle: string
  employeeBenefits: EmployeeBenefit[]

  cultureTitle: string
  cultureDescription: string
  culturePoints: string[]

  hiringProcessLabel: string
  hiringProcessTitle: string
  hiringProcess: HiringProcess[]
}

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData: CareerFormData = {
  badgeText: '',

  heroTitle: '',
  heroHighlight: '',
  heroDescription: '',

  benefitsLabel: '',
  benefitsTitle: '',

  employeeBenefits: [
    {
      title: '',
      description: '',
    },
  ],

  cultureTitle: '',
  cultureDescription: '',

  culturePoints: [''],

  hiringProcessLabel: '',
  hiringProcessTitle: '',

  hiringProcess: [
    {
      step: '',
      title: '',
      description: '',
    },
  ],
}

// =====================================================
// COMPONENT
// =====================================================

const CareerInfo = () => {
  // =====================================================
  // API
  // =====================================================

  const { data: careerResponse, isLoading, isError, refetch } = useGetCareerInfoQuery()

  const [createCareerInfo, { isLoading: creating }] = useCreateCareerInfoMutation()

  const [updateCareerInfo, { isLoading: updating }] = useUpdateCareerInfoMutation()

  // =====================================================
  // NORMALIZE RESPONSE
  // =====================================================

  const careerData = useMemo(() => {
    const response: any = careerResponse

    if (!response) {
      return null
    }

    if (Array.isArray(response?.data)) {
      return response.data[0] || null
    }

    if (response?.data && typeof response.data === 'object') {
      return response.data
    }

    if (Array.isArray(response)) {
      return response[0] || null
    }

    return response
  }, [careerResponse])

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState<CareerFormData>(initialFormData)

  // =====================================================
  // LOAD EXISTING DATA
  // =====================================================

  useEffect(() => {
    if (!careerData) {
      return
    }

    setFormData({
      badgeText: careerData.badgeText || '',

      heroTitle: careerData.heroTitle || '',

      heroHighlight: careerData.heroHighlight || '',

      heroDescription: careerData.heroDescription || '',

      benefitsLabel: careerData.benefitsLabel || '',

      benefitsTitle: careerData.benefitsTitle || '',

      employeeBenefits:
        Array.isArray(careerData.employeeBenefits) && careerData.employeeBenefits.length > 0
          ? careerData.employeeBenefits.map((item: any) => ({
              title: item?.title || '',
              description: item?.description || '',
            }))
          : [
              {
                title: '',
                description: '',
              },
            ],

      cultureTitle: careerData.cultureTitle || '',

      cultureDescription: careerData.cultureDescription || '',

      culturePoints:
        Array.isArray(careerData.culturePoints) && careerData.culturePoints.length > 0
          ? careerData.culturePoints.map((item: any) => String(item || ''))
          : [''],

      hiringProcessLabel: careerData.hiringProcessLabel || '',

      hiringProcessTitle: careerData.hiringProcessTitle || '',

      hiringProcess:
        Array.isArray(careerData.hiringProcess) && careerData.hiringProcess.length > 0
          ? careerData.hiringProcess.map((item: any) => ({
              step: item?.step || '',
              title: item?.title || '',
              description: item?.description || '',
            }))
          : [
              {
                step: '',
                title: '',
                description: '',
              },
            ],
    })
  }, [careerData])

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // EMPLOYEE BENEFITS
  // =====================================================

  const handleBenefitChange = (index: number, field: keyof EmployeeBenefit, value: string) => {
    setFormData((prev) => {
      const items = [...prev.employeeBenefits]

      items[index] = {
        ...items[index],
        [field]: value,
      }

      return {
        ...prev,
        employeeBenefits: items,
      }
    })
  }

  const addBenefit = () => {
    const lastItem = formData.employeeBenefits[formData.employeeBenefits.length - 1]

    if (lastItem) {
      if (!lastItem.title.trim()) {
        toast.error('Please enter current benefit title first')
        return
      }

      if (!lastItem.description.trim()) {
        toast.error('Please enter current benefit description first')
        return
      }
    }

    setFormData((prev) => ({
      ...prev,

      employeeBenefits: [
        ...prev.employeeBenefits,

        {
          title: '',
          description: '',
        },
      ],
    }))
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => {
      if (prev.employeeBenefits.length <= 1) {
        return prev
      }

      return {
        ...prev,

        employeeBenefits: prev.employeeBenefits.filter((_, i) => i !== index),
      }
    })
  }

  // =====================================================
  // CULTURE POINTS => STRING[]
  // =====================================================

  const handleCulturePointChange = (index: number, value: string) => {
    setFormData((prev) => {
      const items = [...prev.culturePoints]

      items[index] = value

      return {
        ...prev,
        culturePoints: items,
      }
    })
  }

  const addCulturePoint = () => {
    const lastItem = formData.culturePoints[formData.culturePoints.length - 1]

    if (lastItem !== undefined && !lastItem.trim()) {
      toast.error('Please enter current culture point first')
      return
    }

    setFormData((prev) => ({
      ...prev,

      culturePoints: [...prev.culturePoints, ''],
    }))
  }

  const removeCulturePoint = (index: number) => {
    setFormData((prev) => {
      if (prev.culturePoints.length <= 1) {
        return prev
      }

      return {
        ...prev,

        culturePoints: prev.culturePoints.filter((_, i) => i !== index),
      }
    })
  }

  // =====================================================
  // HIRING PROCESS
  // =====================================================

  const handleHiringProcessChange = (index: number, field: keyof HiringProcess, value: string) => {
    setFormData((prev) => {
      const items = [...prev.hiringProcess]

      items[index] = {
        ...items[index],
        [field]: value,
      }

      return {
        ...prev,
        hiringProcess: items,
      }
    })
  }

  const addHiringProcess = () => {
    const lastItem = formData.hiringProcess[formData.hiringProcess.length - 1]

    if (lastItem) {
      if (!lastItem.step.trim()) {
        toast.error('Please enter current step first')
        return
      }

      if (!lastItem.title.trim()) {
        toast.error('Please enter current title first')
        return
      }

      if (!lastItem.description.trim()) {
        toast.error('Please enter current description first')
        return
      }
    }

    setFormData((prev) => ({
      ...prev,

      hiringProcess: [
        ...prev.hiringProcess,

        {
          step: '',
          title: '',
          description: '',
        },
      ],
    }))
  }

  const removeHiringProcess = (index: number) => {
    setFormData((prev) => {
      if (prev.hiringProcess.length <= 1) {
        return prev
      }

      return {
        ...prev,

        hiringProcess: prev.hiringProcess.filter((_, i) => i !== index),
      }
    })
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!formData.badgeText.trim()) {
      toast.error('Badge text is required')
      return false
    }

    if (!formData.heroTitle.trim()) {
      toast.error('Hero title is required')
      return false
    }

    if (!formData.heroDescription.trim()) {
      toast.error('Hero description is required')
      return false
    }

    const employeeBenefits = formData.employeeBenefits.filter((item) => item.title.trim() || item.description.trim())

    for (let i = 0; i < employeeBenefits.length; i++) {
      const item = employeeBenefits[i]

      if (!item.title.trim()) {
        toast.error(`Employee Benefit ${i + 1}: Title is required`)
        return false
      }

      if (!item.description.trim()) {
        toast.error(`Employee Benefit ${i + 1}: Description is required`)
        return false
      }
    }

    const hiringProcess = formData.hiringProcess.filter((item) => item.step.trim() || item.title.trim() || item.description.trim())

    for (let i = 0; i < hiringProcess.length; i++) {
      const item = hiringProcess[i]

      if (!item.step.trim()) {
        toast.error(`Hiring Process ${i + 1}: Step is required`)
        return false
      }

      if (!item.title.trim()) {
        toast.error(`Hiring Process ${i + 1}: Title is required`)
        return false
      }

      if (!item.description.trim()) {
        toast.error(`Hiring Process ${i + 1}: Description is required`)
        return false
      }
    }

    return true
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // ===================================================
    // CLEAN BENEFITS
    // ===================================================

    const cleanedEmployeeBenefits = formData.employeeBenefits
      .filter((item) => item.title.trim() || item.description.trim())
      .map((item) => ({
        title: item.title.trim(),

        description: item.description.trim(),
      }))

    // ===================================================
    // CLEAN CULTURE POINTS
    // string[]
    // ===================================================

    const cleanedCulturePoints = formData.culturePoints.map((item) => item.trim()).filter(Boolean)

    // ===================================================
    // CLEAN HIRING PROCESS
    // ===================================================

    const cleanedHiringProcess = formData.hiringProcess
      .filter((item) => item.step.trim() || item.title.trim() || item.description.trim())
      .map((item) => ({
        step: item.step.trim(),

        title: item.title.trim(),

        description: item.description.trim(),
      }))

    // ===================================================
    // FINAL PAYLOAD
    // ===================================================

    const payload = {
      badgeText: formData.badgeText.trim(),

      heroTitle: formData.heroTitle.trim(),

      heroHighlight: formData.heroHighlight.trim(),

      heroDescription: formData.heroDescription.trim(),

      benefitsLabel: formData.benefitsLabel.trim(),

      benefitsTitle: formData.benefitsTitle.trim(),

      employeeBenefits: cleanedEmployeeBenefits,

      cultureTitle: formData.cultureTitle.trim(),

      cultureDescription: formData.cultureDescription.trim(),

      culturePoints: cleanedCulturePoints,

      hiringProcessLabel: formData.hiringProcessLabel.trim(),

      hiringProcessTitle: formData.hiringProcessTitle.trim(),

      hiringProcess: cleanedHiringProcess,
    }

    try {
      // =================================================
      // UPDATE
      // =================================================

      if (careerData?._id) {
        await updateCareerInfo({
          id: careerData._id,
          // @ts-ignore
          data: payload,
        }).unwrap()

        toast.success('Career Info updated successfully')
      }

      // =================================================
      // CREATE
      // =================================================
      else {
        // @ts-ignore
        await createCareerInfo(payload).unwrap()

        toast.success('Career Info created successfully')
      }

      await refetch()
    } catch (error: any) {
      console.error('Career Info Error:', error)

      // ZOD VALIDATION ERROR
      if (error?.data?.message && typeof error.data.message === 'string') {
        toast.error(error.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />

        <div className="mt-2">Loading Career Info...</div>
      </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return <div className="alert alert-danger">Unable to load Career Info.</div>
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <form onSubmit={handleSubmit}>
      {/* =================================================
          HERO SECTION
      ================================================= */}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle as="h4" className="mb-0">
            Hero Section
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Badge Text" name="badgeText" value={formData.badgeText} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Hero Title" name="heroTitle" value={formData.heroTitle} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Hero Highlight" name="heroHighlight" value={formData.heroHighlight} onChange={handleChange} />
            </Col>

            <Col md={12}>
              <TextArea label="Hero Description" name="heroDescription" value={formData.heroDescription} onChange={handleChange} />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* =================================================
          EMPLOYEE BENEFITS
      ================================================= */}

      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <CardTitle as="h4" className="mb-0">
              Employee Benefits
            </CardTitle>

            <button type="button" className="btn btn-primary btn-sm" onClick={addBenefit}>
              + Add Benefit
            </button>
          </div>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Benefits Label" name="benefitsLabel" value={formData.benefitsLabel} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Benefits Title" name="benefitsTitle" value={formData.benefitsTitle} onChange={handleChange} />
            </Col>
          </Row>

          <hr />

          {formData.employeeBenefits.map((benefit, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-semibold">Benefit {index + 1}</h6>

                {formData.employeeBenefits.length > 1 && (
                  <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => removeBenefit(index)}>
                    Remove
                  </button>
                )}
              </div>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>

                    <input
                      type="text"
                      className="form-control"
                      value={benefit.title}
                      onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                      placeholder="Enter benefit title"
                    />
                  </div>
                </Col>

                <Col md={12}>
                  <div>
                    <label className="form-label">Description</label>

                    <textarea
                      rows={3}
                      className="form-control"
                      value={benefit.description}
                      onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                      placeholder="Enter benefit description"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* =================================================
          CULTURE SECTION
      ================================================= */}

      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <CardTitle as="h4" className="mb-0">
              Culture Section
            </CardTitle>

            <button type="button" className="btn btn-primary btn-sm" onClick={addCulturePoint}>
              + Add Culture Point
            </button>
          </div>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Culture Title" name="cultureTitle" value={formData.cultureTitle} onChange={handleChange} />
            </Col>

            <Col md={12}>
              <TextArea label="Culture Description" name="cultureDescription" value={formData.cultureDescription} onChange={handleChange} />
            </Col>
          </Row>

          <hr />

          {formData.culturePoints.map((point, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-semibold">Culture Point {index + 1}</h6>

                {formData.culturePoints.length > 1 && (
                  <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => removeCulturePoint(index)}>
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                className="form-control"
                value={point}
                placeholder="Enter culture point"
                onChange={(e) => handleCulturePointChange(index, e.target.value)}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* =================================================
          HIRING PROCESS
      ================================================= */}

      <Card className="mb-4">
        <CardHeader>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <CardTitle as="h4" className="mb-0">
              Hiring Process
            </CardTitle>

            <button type="button" className="btn btn-primary btn-sm" onClick={addHiringProcess}>
              + Add Step
            </button>
          </div>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={6}>
              <TextInput label="Hiring Process Label" name="hiringProcessLabel" value={formData.hiringProcessLabel} onChange={handleChange} />
            </Col>

            <Col md={6}>
              <TextInput label="Hiring Process Title" name="hiringProcessTitle" value={formData.hiringProcessTitle} onChange={handleChange} />
            </Col>
          </Row>

          <hr />

          {formData.hiringProcess.map((process, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-semibold">Hiring Step {index + 1}</h6>

                {formData.hiringProcess.length > 1 && (
                  <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => removeHiringProcess(index)}>
                    Remove
                  </button>
                )}
              </div>

              <Row>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label">Step</label>

                    <input
                      type="text"
                      className="form-control"
                      value={process.step}
                      onChange={(e) => handleHiringProcessChange(index, 'step', e.target.value)}
                      placeholder="01"
                    />
                  </div>
                </Col>

                <Col md={9}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>

                    <input
                      type="text"
                      className="form-control"
                      value={process.title}
                      onChange={(e) => handleHiringProcessChange(index, 'title', e.target.value)}
                      placeholder="Enter step title"
                    />
                  </div>
                </Col>

                <Col md={12}>
                  <div>
                    <label className="form-label">Description</label>

                    <textarea
                      rows={3}
                      className="form-control"
                      value={process.description}
                      onChange={(e) => handleHiringProcessChange(index, 'description', e.target.value)}
                      placeholder="Enter step description"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* =================================================
          SAVE
      ================================================= */}

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={creating || updating}>
        {creating || updating ? (careerData?._id ? 'Updating...' : 'Creating...') : careerData?._id ? 'Update Career Info' : 'Create Career Info'}
      </button>
    </form>
  )
}

// =====================================================
// TEXT INPUT
// =====================================================

const TextInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <input type="text" className="form-control" name={name} value={value} onChange={onChange} />
    </div>
  )
}

// =====================================================
// TEXT AREA
// =====================================================

const TextArea = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <textarea rows={4} className="form-control" name={name} value={value} onChange={onChange} />
    </div>
  )
}

export default CareerInfo
