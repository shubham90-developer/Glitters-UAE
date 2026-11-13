'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useCreateReturnRefundMutation, useGetReturnRefundQuery, useUpdateReturnRefundMutation } from '@/store/returnRefundApi'

// =====================================================
// TYPES
// UI uses `description` / `step`; backend uses `desc` / `stepNo`.
// =====================================================

type FeatureItem = { icon?: string; title: string; description: string }
type ReturnStepItem = { icon?: string; step: string; title: string; description: string }
type RefundTimelineItem = { stepNo?: string; title: string; description: string }

type FormData = {
  badgeTitle: string
  title: string
  shortDesc: string

  startReturnBtnText: string
  startReturnBtnUrl: string
  contactSupportBtnText: string
  contactSupportBtnUrl: string

  features: FeatureItem[]

  howItWorksTitle: string
  howItWorksDesc: string
  returnSteps: ReturnStepItem[]

  eligibleTitle: string
  eligibleDesc: string
  eligibleItems: string[]

  nonReturnableTitle: string
  nonReturnableDesc: string
  nonReturnableItems: string[]

  refundTimelineTitle: string
  refundTimelineDesc: string
  refundTimeline: RefundTimelineItem[]

  refundProcessingTitle: string
  refundProcessingDesc: string
}

type ListKey = 'features' | 'returnSteps' | 'eligibleItems' | 'nonReturnableItems' | 'refundTimeline'
type TextKey = Exclude<keyof FormData, ListKey>
type ListItem<K extends ListKey> = FormData[K][number]

// =====================================================
// EMPTY ITEMS + INITIAL DATA
// =====================================================

const emptyFeature: FeatureItem = { icon: '', title: '', description: '' }
const emptyStep: ReturnStepItem = { icon: '', step: '', title: '', description: '' }
const emptyTimeline: RefundTimelineItem = { stepNo: '', title: '', description: '' }

const initialFormData: FormData = {
  badgeTitle: '',
  title: '',
  shortDesc: '',
  startReturnBtnText: '',
  startReturnBtnUrl: '',
  contactSupportBtnText: '',
  contactSupportBtnUrl: '',
  features: [emptyFeature],
  howItWorksTitle: '',
  howItWorksDesc: '',
  returnSteps: [emptyStep],
  eligibleTitle: '',
  eligibleDesc: '',
  eligibleItems: [''],
  nonReturnableTitle: '',
  nonReturnableDesc: '',
  nonReturnableItems: [''],
  refundTimelineTitle: '',
  refundTimelineDesc: '',
  refundTimeline: [emptyTimeline],
  refundProcessingTitle: '',
  refundProcessingDesc: '',
}

// =====================================================
// API <-> FORM MAPPING
// =====================================================

const toList = <T,>(value: unknown, map: (item: any) => T, empty: T): T[] => (Array.isArray(value) && value.length > 0 ? value.map(map) : [empty])

const fromApi = (d: any): FormData => ({
  badgeTitle: d.badgeTitle || '',
  title: d.title || '',
  shortDesc: d.shortDesc || '',

  startReturnBtnText: d.startReturnBtnText || '',
  startReturnBtnUrl: d.startReturnBtnUrl || '',
  contactSupportBtnText: d.contactSupportBtnText || '',
  contactSupportBtnUrl: d.contactSupportBtnUrl || '',

  features: toList(d.features, (i) => ({ icon: i?.icon || '', title: i?.title || '', description: i?.desc || '' }), emptyFeature),

  howItWorksTitle: d.howItWorksTitle || '',
  howItWorksDesc: d.howItWorksDesc || '',

  returnSteps: toList(
    d.returnSteps,
    (i) => ({ icon: i?.icon || '', step: i?.stepNo || '', title: i?.title || '', description: i?.desc || '' }),
    emptyStep,
  ),

  eligibleTitle: d.eligibleTitle || '',
  eligibleDesc: d.eligibleDesc || '',
  eligibleItems: toList(d.eligibleItems, (i) => String(i || ''), ''),

  nonReturnableTitle: d.nonReturnableTitle || '',
  nonReturnableDesc: d.nonReturnableDesc || '',
  nonReturnableItems: toList(d.nonReturnableItems, (i) => String(i || ''), ''),

  refundTimelineTitle: d.refundTimelineTitle || '',
  refundTimelineDesc: d.refundTimelineDesc || '',
  refundTimeline: toList(d.refundTimeline, (i) => ({ stepNo: i?.stepNo || '', title: i?.title || '', description: i?.desc || '' }), emptyTimeline),

  refundProcessingTitle: d.refundProcessingTitle || '',
  refundProcessingDesc: d.refundProcessingDesc || '',
})

const cleanStrings = (items: string[]) => items.map((i) => i.trim()).filter(Boolean)

const toPayload = (f: FormData) => ({
  badgeTitle: f.badgeTitle.trim(),
  title: f.title.trim(),
  shortDesc: f.shortDesc.trim(),

  startReturnBtnText: f.startReturnBtnText.trim(),
  startReturnBtnUrl: f.startReturnBtnUrl.trim(),
  contactSupportBtnText: f.contactSupportBtnText.trim(),
  contactSupportBtnUrl: f.contactSupportBtnUrl.trim(),

  features: f.features
    .filter((i) => i.title.trim() || i.description.trim())
    .map((i) => ({ icon: i.icon || '', title: i.title.trim(), desc: i.description.trim() })),

  howItWorksTitle: f.howItWorksTitle.trim(),
  howItWorksDesc: f.howItWorksDesc.trim(),

  returnSteps: f.returnSteps
    .filter((i) => i.step.trim() || i.title.trim() || i.description.trim())
    .map((i) => ({ stepNo: i.step.trim(), icon: i.icon || '', title: i.title.trim(), desc: i.description.trim() })),

  eligibleTitle: f.eligibleTitle.trim(),
  eligibleDesc: f.eligibleDesc.trim(),
  eligibleItems: cleanStrings(f.eligibleItems),

  nonReturnableTitle: f.nonReturnableTitle.trim(),
  nonReturnableDesc: f.nonReturnableDesc.trim(),
  nonReturnableItems: cleanStrings(f.nonReturnableItems),

  refundTimelineTitle: f.refundTimelineTitle.trim(),
  refundTimelineDesc: f.refundTimelineDesc.trim(),
  refundTimeline: f.refundTimeline
    .filter((i) => i.title.trim() || i.description.trim())
    .map((i) => ({ stepNo: i.stepNo || '', title: i.title.trim(), desc: i.description.trim() })),

  refundProcessingTitle: f.refundProcessingTitle.trim(),
  refundProcessingDesc: f.refundProcessingDesc.trim(),
})

// =====================================================
// NORMALIZE API RESPONSE -> SINGLE DOCUMENT
// =====================================================

const extractDocument = (response: any) => {
  if (!response) return null
  if (Array.isArray(response?.data)) return response.data[0] || null
  if (response?.data && typeof response.data === 'object') return response.data
  if (Array.isArray(response)) return response[0] || null
  return response
}

// =====================================================
// COMPONENT
// =====================================================

const ReturnRefunds = () => {
  const { data: response, isLoading, isError, refetch } = useGetReturnRefundQuery()
  const [createReturnRefund, { isLoading: creating }] = useCreateReturnRefundMutation()
  const [updateReturnRefund, { isLoading: updating }] = useUpdateReturnRefundMutation()

  const returnData = useMemo(() => extractDocument(response), [response])
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    if (returnData) setFormData(fromApi(returnData))
  }, [returnData])

  // ---------- generic text field binding ----------
  const field = (name: TextKey) => ({
    value: formData[name],
    onChange: (value: string) => setFormData((prev) => ({ ...prev, [name]: value })),
  })

  // ---------- generic list helpers ----------
  const updateItem = <K extends ListKey>(key: K, index: number, value: ListItem<K>) =>
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as ListItem<K>[]).map((item, i) => (i === index ? value : item)),
    }))

  const patchItem = <K extends ListKey>(key: K, index: number, patch: Partial<ListItem<K>>) =>
    updateItem(key, index, { ...(formData[key][index] as object), ...patch } as ListItem<K>)

  const addItem = <K extends ListKey>(key: K, empty: ListItem<K>, errorMessage: string, isComplete: (last: ListItem<K>) => boolean) => {
    const list = formData[key] as ListItem<K>[]
    const last = list[list.length - 1]

    if (last !== undefined && !isComplete(last)) {
      toast.error(errorMessage)
      return
    }

    setFormData((prev) => ({ ...prev, [key]: [...(prev[key] as ListItem<K>[]), empty] }))
  }

  const removeItem = (key: ListKey, index: number) =>
    setFormData((prev) => {
      const list = prev[key] as unknown[]
      return list.length > 1 ? { ...prev, [key]: list.filter((_, i) => i !== index) } : prev
    })

  // ---------- submit ----------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.badgeTitle.trim()) return toast.error('Badge Title is required')
    if (!formData.title.trim()) return toast.error('Title is required')
    if (!formData.shortDesc.trim()) return toast.error('Short Description is required')

    const payload = toPayload(formData)

    try {
      if (returnData?._id) {
        // @ts-ignore
        await updateReturnRefund({ _id: returnData._id, data: payload }).unwrap()
        toast.success('Returns & Refunds updated successfully')
      } else {
        // @ts-ignore
        await createReturnRefund(payload).unwrap()
        toast.success('Returns & Refunds created successfully')
      }

      await refetch()
    } catch (error: any) {
      console.error('Return Refund Error:', error)
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ---------- states ----------
  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" />
        <div className="mt-2">Loading Returns & Refunds...</div>
      </div>
    )
  }

  if (isError) {
    return <div className="alert alert-danger">Unable to load Returns & Refunds.</div>
  }

  // ---------- reusable title + description block ----------
  const titleDesc = (titleKey: TextKey, descKey: TextKey) => (
    <Row>
      <Col md={6}>
        <Field label="Title" {...field(titleKey)} />
      </Col>
      <Col md={12}>
        <Field label="Description" textarea {...field(descKey)} />
      </Col>
    </Row>
  )

  const isBusy = creating || updating

  return (
    <form onSubmit={handleSubmit}>
      {/* HERO */}
      <Section title="Hero Section">
        <Row>
          <Col md={6}>
            <Field label="Badge Title" {...field('badgeTitle')} />
          </Col>
          <Col md={6}>
            <Field label="Title" {...field('title')} />
          </Col>
          <Col md={12}>
            <Field label="Short Description" textarea {...field('shortDesc')} />
          </Col>
        </Row>
      </Section>

      {/* BUTTONS */}
      <Section title="Action Buttons">
        <Row>
          <Col md={6}>
            <Field label="Start Return Button Text" {...field('startReturnBtnText')} />
          </Col>
          <Col md={6}>
            <Field label="Start Return Button URL" {...field('startReturnBtnUrl')} />
          </Col>
          <Col md={6}>
            <Field label="Contact Support Button Text" {...field('contactSupportBtnText')} />
          </Col>
          <Col md={6}>
            <Field label="Contact Support Button URL" {...field('contactSupportBtnUrl')} />
          </Col>
        </Row>
      </Section>

      {/* FEATURES */}
      <Section
        title="Features"
        addLabel="Add Feature"
        onAdd={() => addItem('features', emptyFeature, 'Please complete current feature first', (l) => !!l.title.trim() && !!l.description.trim())}>
        {formData.features.map((item, index) => (
          <RepeatCard
            key={index}
            title={`Feature ${index + 1}`}
            showRemove={formData.features.length > 1}
            onRemove={() => removeItem('features', index)}>
            <Row>
              <Col md={5}>
                <Field label="Title" value={item.title} onChange={(v) => patchItem('features', index, { title: v })} />
              </Col>
              <Col md={7}>
                <Field label="Description" textarea value={item.description} onChange={(v) => patchItem('features', index, { description: v })} />
              </Col>
            </Row>
          </RepeatCard>
        ))}
      </Section>

      {/* HOW IT WORKS */}
      <Section title="How Returns Work">{titleDesc('howItWorksTitle', 'howItWorksDesc')}</Section>

      {/* RETURN STEPS */}
      <Section
        title="Return Steps"
        addLabel="Add Step"
        onAdd={() =>
          addItem(
            'returnSteps',
            emptyStep,
            'Please complete current return step first',
            (l) => !!l.step.trim() && !!l.title.trim() && !!l.description.trim(),
          )
        }>
        {formData.returnSteps.map((item, index) => (
          <RepeatCard
            key={index}
            title={`Return Step ${index + 1}`}
            showRemove={formData.returnSteps.length > 1}
            onRemove={() => removeItem('returnSteps', index)}>
            <Row>
              <Col md={2}>
                <Field label="Step" value={item.step} onChange={(v) => patchItem('returnSteps', index, { step: v })} />
              </Col>
              <Col md={4}>
                <Field label="Title" value={item.title} onChange={(v) => patchItem('returnSteps', index, { title: v })} />
              </Col>
              <Col md={6}>
                <Field label="Description" textarea value={item.description} onChange={(v) => patchItem('returnSteps', index, { description: v })} />
              </Col>
            </Row>
          </RepeatCard>
        ))}
      </Section>

      {/* ELIGIBLE */}
      <Section
        title="Eligible for Return"
        addLabel="Add Item"
        onAdd={() => addItem('eligibleItems', '', 'Please enter current eligible item first', (l) => !!l.trim())}>
        {titleDesc('eligibleTitle', 'eligibleDesc')}

        {formData.eligibleItems.map((item, index) => (
          <StringItem
            key={index}
            label={`Eligible Item ${index + 1}`}
            value={item}
            showRemove={formData.eligibleItems.length > 1}
            onChange={(v) => updateItem('eligibleItems', index, v)}
            onRemove={() => removeItem('eligibleItems', index)}
          />
        ))}
      </Section>

      {/* NON RETURNABLE */}
      <Section
        title="Non-Returnable Products"
        addLabel="Add Item"
        onAdd={() => addItem('nonReturnableItems', '', 'Please enter current non-returnable item first', (l) => !!l.trim())}>
        {titleDesc('nonReturnableTitle', 'nonReturnableDesc')}

        {formData.nonReturnableItems.map((item, index) => (
          <StringItem
            key={index}
            label={`Non-Returnable Item ${index + 1}`}
            value={item}
            showRemove={formData.nonReturnableItems.length > 1}
            onChange={(v) => updateItem('nonReturnableItems', index, v)}
            onRemove={() => removeItem('nonReturnableItems', index)}
          />
        ))}
      </Section>

      {/* REFUND TIMELINE */}
      <Section
        title="Refund Timeline"
        addLabel="Add Timeline"
        onAdd={() =>
          addItem('refundTimeline', emptyTimeline, 'Please complete current timeline item first', (l) => !!l.title.trim() && !!l.description.trim())
        }>
        {titleDesc('refundTimelineTitle', 'refundTimelineDesc')}

        {formData.refundTimeline.map((item, index) => (
          <RepeatCard
            key={index}
            title={`Timeline ${index + 1}`}
            showRemove={formData.refundTimeline.length > 1}
            onRemove={() => removeItem('refundTimeline', index)}>
            <Row>
              <Col md={5}>
                <Field label="Title" value={item.title} onChange={(v) => patchItem('refundTimeline', index, { title: v })} />
              </Col>
              <Col md={7}>
                <Field
                  label="Description"
                  textarea
                  value={item.description}
                  onChange={(v) => patchItem('refundTimeline', index, { description: v })}
                />
              </Col>
            </Row>
          </RepeatCard>
        ))}
      </Section>

      {/* REFUND PROCESSING */}
      <Section title="Refund Processing">{titleDesc('refundProcessingTitle', 'refundProcessingDesc')}</Section>

      <button type="submit" className="btn btn-primary w-100 mb-4" disabled={isBusy}>
        {isBusy ? 'Please wait...' : returnData?._id ? 'Update Returns & Refunds' : 'Create Returns & Refunds'}
      </button>
    </form>
  )
}

// =====================================================
// SMALL UI COMPONENTS
// =====================================================

const Section = ({ title, addLabel, onAdd, children }: { title: string; addLabel?: string; onAdd?: () => void; children: React.ReactNode }) => (
  <Card className="mb-4">
    <CardHeader>
      <div className="d-flex justify-content-between align-items-center">
        <CardTitle as="h4" className="mb-0">
          {title}
        </CardTitle>

        {onAdd && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
            + {addLabel}
          </button>
        )}
      </div>
    </CardHeader>

    <CardBody>{children}</CardBody>
  </Card>
)

const Field = ({ label, value, onChange, textarea }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>

    {textarea ? (
      <textarea rows={3} className="form-control" value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input type="text" className="form-control" value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
)

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className="btn btn-soft-danger btn-sm" onClick={onClick}>
    Remove
  </button>
)

const RepeatCard = ({
  title,
  children,
  showRemove,
  onRemove,
}: {
  title: string
  children: React.ReactNode
  showRemove: boolean
  onRemove: () => void
}) => (
  <div className="border rounded p-3 mb-3 bg-light">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="mb-0">{title}</h6>
      {showRemove && <RemoveButton onClick={onRemove} />}
    </div>

    {children}
  </div>
)

const StringItem = ({
  label,
  value,
  showRemove,
  onChange,
  onRemove,
}: {
  label: string
  value: string
  showRemove: boolean
  onChange: (value: string) => void
  onRemove: () => void
}) => (
  <div className="border rounded p-3 mb-3 bg-light">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label className="form-label mb-0">{label}</label>
      {showRemove && <RemoveButton onClick={onRemove} />}
    </div>

    <input type="text" className="form-control" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
)

export default ReturnRefunds
