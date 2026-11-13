'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Select, { SingleValue, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
// @ts-ignore
import 'react-quill-new/dist/quill.snow.css'

import { useGetProductsByIdQuery, useUpdateProductsMutation } from '@/store/productsApi'
import { useGetcategoryQuery } from '@/store/categoriesApi'
import { useGetSubCategoryQuery } from '@/store/subCategoryApi'
import { useGetMaterialQuery } from '@/store/materialApi'
import { useGetBrandQuery } from '@/store/brandApi'
import { useGetCouponQuery } from '@/store/couponApi'
import { useGetSizeQuery } from '@/store/sizeApi'
import { useGetColorsQuery } from '@/store/colorsApi'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
})

// =====================================================
// TYPES
// =====================================================

type SelectOption = {
  value: string
  label: string
}

type TagOption = SelectOption

type ApiItem = {
  _id: string
  status?: string
  isDeleted?: boolean
  categoryName?: string
  subCategoryName?: string
  materialName?: string
  brandName?: string
  couponCode?: string
  couponName?: string
  code?: string
  colorName?: string
  size?: string
  sizeName?: string
  name?: string
  category?: string | { _id?: string } | null
}

type ApiError = {
  data?: { message?: string }
  error?: string
  message?: string
}

type RefLike = string | { _id?: string } | null | undefined

type VariantApi = {
  _id?: string
  size?: RefLike
  color?: RefLike
  stock?: number | string
  price?: number | string
  delPrice?: number | string
  discount?: number | string
  images?: string[]
  image?: string
}

type SpecificationApi = {
  specificationName?: string
  value?: string
}

type SectionValue = '' | 'New Offers' | 'Popular Products' | 'New Arrivals'

type ProductApi = {
  _id?: string
  productName?: string
  category?: RefLike
  subCategory?: RefLike
  material?: RefLike
  section?: string
  brand?: RefLike
  coupon?: RefLike
  dealOfTheDay?: boolean
  dealStartTime?: string | null
  dealEndTime?: string | null
  tags?: string[]
  videoUrl?: string
  productImages?: string[]
  shortDesc?: string
  desc?: string
  additionalInformation?: string
  shippingReturnPolicy?: string
  status?: string
  variants?: VariantApi[]
  specifications?: SpecificationApi[]
}

type ProductFormData = {
  productName: string
  category: string
  subCategory: string
  material: string
  section: SectionValue
  brand: string
  coupon: string
  dealOfTheDay: boolean
  dealStartTime: string
  dealEndTime: string
  tags: string[]
  videoUrl: string
  shortDescription: string
  productDescription: string
  additionalInformation: string
  shippingReturnPolicy: string
  status: 'active' | 'inactive'
}

type ProductVariant = {
  id: number
  _id?: string
  size: string
  color: string
  stock: string
  price: string
  delPrice: string
  discount: string

  // images already saved on the server (can be removed)
  existingImages: string[]

  // newly selected files + their blob previews
  images: File[]
  imagePreviews: string[]
}

type VariantField = 'size' | 'color' | 'stock' | 'price' | 'delPrice' | 'discount'

type ProductSpecification = {
  id: number
  specificationName: string
  value: string
}

type SpecificationField = 'specificationName' | 'value'

type SimpleSelectField = 'category' | 'subCategory' | 'material' | 'section' | 'brand' | 'coupon'

// =====================================================
// STATIC OPTIONS
// =====================================================

const sections: SelectOption[] = [
  { value: 'New Offers', label: 'New Offers' },
  { value: 'Popular Products', label: 'Popular Products' },
  { value: 'New Arrivals', label: 'New Arrivals' },
]

// ISO date from the API -> value for <input type="datetime-local"> (browser local time)
const toDateTimeLocal = (value?: string | null): string => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const dealOptions: SelectOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

const defaultTagOptions: TagOption[] = [
  { value: 'new-arrival', label: 'New Arrival' },
  { value: 'best-seller', label: 'Best Seller' },
  { value: 'trending', label: 'Trending' },
  { value: 'premium', label: 'Premium' },
  { value: 'summer', label: 'Summer' },
  { value: 'winter', label: 'Winter' },
]

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#86b7fe' : '#dee2e6',
    boxShadow: state.isFocused ? '0 0 0 0.15rem rgba(13, 110, 253, 0.15)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#86b7fe' : '#dee2e6',
    },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  menu: (base) => ({ ...base, zIndex: 99999 }),
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    [{ align: [] }],
    ['clean'],
  ],
}

const quillFormats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'blockquote', 'link', 'align']

// =====================================================
// HELPERS
// =====================================================

const createEmptyVariant = (): ProductVariant => ({
  id: Date.now() + Math.random(),
  size: '',
  color: '',
  stock: '',
  price: '',
  delPrice: '',
  discount: '',
  existingImages: [],
  images: [],
  imagePreviews: [],
})

const createEmptySpecification = (): ProductSpecification => ({
  id: Date.now() + Math.random(),
  specificationName: '',
  value: '',
})

const hasRichTextContent = (value: string): boolean => {
  return (
    value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim().length > 0
  )
}

const getRefId = (value: RefLike): string => {
  if (!value) return ''

  if (typeof value === 'string') return value

  return value._id ? String(value._id) : ''
}

const isBlobUrl = (value: string): boolean => value.startsWith('blob:')

// supports new `images[]` and old single `image`
const getVariantImages = (variant: VariantApi): string[] => {
  if (Array.isArray(variant.images) && variant.images.length > 0) {
    return variant.images.filter(Boolean)
  }

  return variant.image ? [variant.image] : []
}

const unwrapProduct = (response: unknown): ProductApi | null => {
  const res = response as (ProductApi & { data?: ProductApi }) | null | undefined

  return res?.data ?? res ?? null
}

// Accepts `[...]` or `{ data: [...] }`
const toList = (data: unknown): ApiItem[] => {
  if (Array.isArray(data)) return data as ApiItem[]

  const nested = (data as { data?: unknown } | null | undefined)?.data

  return Array.isArray(nested) ? (nested as ApiItem[]) : []
}

// Edit page lists inactive items too, marked "(Inactive)"
const toOptions = (list: ApiItem[], getLabel: (item: ApiItem) => string | undefined): SelectOption[] =>
  list
    .filter((item) => !item.isDeleted)
    .map((item) => {
      const label = getLabel(item) ?? ''

      return {
        value: item._id,
        label: item.status === 'inactive' ? `${label} (Inactive)` : label,
      }
    })

const getErrorMessage = (err: unknown, fallback: string): string => {
  const e = err as ApiError | null | undefined

  return e?.data?.message || e?.error || e?.message || fallback
}

const getSelectedOption = (options: SelectOption[], value: string): SelectOption | null => {
  return options.find((option) => option.value === value) ?? null
}

const ProductsEdit = () => {
  const router = useRouter()

  const params = useParams<{ id: string }>()

  const productId = params?.id || ''

  // =====================================================
  // API
  // =====================================================

  const {
    data: productResponse,
    isLoading: productLoading,
    isFetching: productFetching,
  } = useGetProductsByIdQuery(productId, {
    skip: !productId,
  })

  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductsMutation()

  const { data: categoryData, isLoading: categoryLoading } = useGetcategoryQuery()
  const { data: subCategoryData, isLoading: subCategoryLoading } = useGetSubCategoryQuery()
  const { data: materialData, isLoading: materialLoading } = useGetMaterialQuery()
  const { data: brandData, isLoading: brandLoading } = useGetBrandQuery()
  const { data: couponData, isLoading: couponLoading } = useGetCouponQuery()
  const { data: sizeData, isLoading: sizeLoading } = useGetSizeQuery()
  const { data: colorData, isLoading: colorLoading } = useGetColorsQuery()

  // =====================================================
  // STATE
  // =====================================================

  const [error, setError] = useState<string>('')

  const [existingProductImages, setExistingProductImages] = useState<string[]>([])

  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    category: '',
    subCategory: '',
    material: '',
    section: '',
    brand: '',
    coupon: '',
    dealOfTheDay: false,
    dealStartTime: '',
    dealEndTime: '',
    tags: [],
    videoUrl: '',
    shortDescription: '',
    productDescription: '',
    additionalInformation: '',
    shippingReturnPolicy: '',
    status: 'active',
  })

  const [variants, setVariants] = useState<ProductVariant[]>(() => [createEmptyVariant()])

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(() => [createEmptySpecification()])

  // =====================================================
  // DYNAMIC OPTIONS
  // =====================================================

  const categories = useMemo(() => toOptions(toList(categoryData), (item) => item.categoryName), [categoryData])

  const subCategories = useMemo<SelectOption[]>(() => {
    const filtered = toList(subCategoryData).filter((item) => {
      if (!formData.category) {
        return true
      }

      const categoryId = typeof item.category === 'object' ? item.category?._id : item.category

      return categoryId === formData.category
    })

    return toOptions(filtered, (item) => item.subCategoryName)
  }, [subCategoryData, formData.category])

  const materials = useMemo(() => toOptions(toList(materialData), (item) => item.materialName || item.name), [materialData])

  const brands = useMemo(() => toOptions(toList(brandData), (item) => item.brandName || item.name), [brandData])

  const coupons = useMemo(() => toOptions(toList(couponData), (item) => item.couponCode || item.code || item.couponName), [couponData])

  const sizeOptions = useMemo(() => toOptions(toList(sizeData), (item) => item.size || item.sizeName || item.name), [sizeData])

  const colorOptions = useMemo(() => toOptions(toList(colorData), (item) => item.colorName || item.name), [colorData])

  const selectedTags = useMemo<TagOption[]>(() => {
    return formData.tags.map((tag) => {
      const found = defaultTagOptions.find((option) => option.value === tag)

      return found || { value: tag, label: tag }
    })
  }, [formData.tags])

  const portalTarget = typeof document !== 'undefined' ? document.body : undefined

  // =====================================================
  // LOAD PRODUCT DATA
  // =====================================================

  useEffect(() => {
    const product = unwrapProduct(productResponse)

    if (!product?._id) {
      return
    }

    setError('')

    setFormData({
      productName: product.productName || '',
      category: getRefId(product.category),
      subCategory: getRefId(product.subCategory),
      material: getRefId(product.material),
      section: (product.section as SectionValue | undefined) || '',
      brand: getRefId(product.brand),
      coupon: getRefId(product.coupon),
      dealOfTheDay: Boolean(product.dealOfTheDay),
      dealStartTime: toDateTimeLocal(product.dealStartTime),
      dealEndTime: toDateTimeLocal(product.dealEndTime),
      tags: Array.isArray(product.tags) ? product.tags : [],
      videoUrl: product.videoUrl || '',
      shortDescription: product.shortDesc || '',
      productDescription: product.desc || '',
      additionalInformation: product.additionalInformation || '',
      shippingReturnPolicy: product.shippingReturnPolicy || '',
      status: String(product.status).toLowerCase() === 'inactive' ? 'inactive' : 'active',
    })

    setExistingProductImages(Array.isArray(product.productImages) ? product.productImages.filter(Boolean) : [])

    const loadedVariants: ProductVariant[] =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants.map((variant, index) => ({
            id: Date.now() + index + Math.random(),
            _id: variant._id ? String(variant._id) : undefined,
            size: getRefId(variant.size),
            color: getRefId(variant.color),
            stock: String(variant.stock ?? ''),
            price: String(variant.price ?? ''),
            delPrice: String(variant.delPrice ?? ''),
            discount: String(variant.discount ?? ''),
            existingImages: getVariantImages(variant),
            images: [],
            imagePreviews: [],
          }))
        : [createEmptyVariant()]

    setVariants(loadedVariants)

    const loadedSpecifications: ProductSpecification[] =
      Array.isArray(product.specifications) && product.specifications.length > 0
        ? product.specifications.map((spec, index) => ({
            id: Date.now() + index + Math.random(),
            specificationName: spec.specificationName || '',
            value: spec.value || '',
          }))
        : [createEmptySpecification()]

    setSpecifications(loadedSpecifications)
  }, [productResponse])

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: SimpleSelectField, option: SingleValue<SelectOption>) => {
    setFormData((prev) => ({ ...prev, [field]: option?.value ?? '' }))
  }

  const handleCategoryChange = (option: SingleValue<SelectOption>) => {
    setFormData((prev) => ({ ...prev, category: option?.value ?? '', subCategory: '' }))
  }

  const handleDealChange = (option: SingleValue<SelectOption>) => {
    const isDeal = option?.value === 'true'

    setFormData((prev) => ({
      ...prev,
      dealOfTheDay: isDeal,
      dealStartTime: isDeal ? prev.dealStartTime : '',
      dealEndTime: isDeal ? prev.dealEndTime : '',
    }))
  }

  const handleTagChange = (options: readonly TagOption[]) => {
    setFormData((prev) => ({ ...prev, tags: options.map((option) => option.value) }))
  }

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  // =====================================================
  // VARIANT
  // =====================================================

  const handleVariantChange = (id: number, field: VariantField, value: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)))
  }

  // Append one or many selected files to a variant
  const handleVariantImagesChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('image/'))

    // allow selecting the same file again
    e.target.value = ''

    if (!files.length) {
      return
    }

    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              images: [...variant.images, ...files],
              imagePreviews: [...variant.imagePreviews, ...files.map((file) => URL.createObjectURL(file))],
            }
          : variant,
      ),
    )
  }

  // Remove a NEW (not yet uploaded) image
  const removeNewVariantImage = (id: number, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id !== id) {
          return variant
        }

        const preview = variant.imagePreviews[imageIndex]

        if (preview && isBlobUrl(preview)) {
          URL.revokeObjectURL(preview)
        }

        return {
          ...variant,
          images: variant.images.filter((_, i) => i !== imageIndex),
          imagePreviews: variant.imagePreviews.filter((_, i) => i !== imageIndex),
        }
      }),
    )
  }

  // Remove an EXISTING (already saved) image
  const removeExistingVariantImage = (id: number, imageIndex: number) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              existingImages: variant.existingImages.filter((_, i) => i !== imageIndex),
            }
          : variant,
      ),
    )
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()])
  }

  const removeVariant = (id: number) => {
    if (variants.length <= 1) {
      return
    }

    setVariants((prev) => {
      const target = prev.find((variant) => variant.id === id)

      target?.imagePreviews.forEach((url) => {
        if (isBlobUrl(url)) {
          URL.revokeObjectURL(url)
        }
      })

      return prev.filter((variant) => variant.id !== id)
    })
  }

  // =====================================================
  // SPECIFICATION
  // =====================================================

  const handleSpecificationChange = (id: number, field: SpecificationField, value: string) => {
    setSpecifications((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, createEmptySpecification()])
  }

  const removeSpecification = (id: number) => {
    if (specifications.length === 1) {
      setSpecifications([createEmptySpecification()])
      return
    }

    setSpecifications((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCancel = () => {
    if (updateLoading) return

    router.push('/products')
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = (): boolean => {
    if (!formData.productName.trim()) {
      setError('Product name is required.')
      return false
    }

    if (!formData.category) {
      setError('Category is required.')
      return false
    }

    if (formData.dealOfTheDay) {
      if (!formData.dealStartTime || !formData.dealEndTime) {
        setError('Deal start time and end time are required for Deal of the Day.')
        return false
      }

      if (new Date(formData.dealEndTime).getTime() <= new Date(formData.dealStartTime).getTime()) {
        setError('Deal end time must be after the start time.')
        return false
      }
    }

    if (!formData.section) {
      setError('Section is required.')
      return false
    }

    if (!hasRichTextContent(formData.shortDescription)) {
      setError('Short Description is required.')
      return false
    }

    if (!hasRichTextContent(formData.productDescription)) {
      setError('Product Description is required.')
      return false
    }

    if (!hasRichTextContent(formData.shippingReturnPolicy)) {
      setError('Shipping & Return Policy is required.')
      return false
    }

    const invalidVariant = variants.some((variant) => !variant.color || variant.price === '' || variant.stock === '')

    if (invalidVariant) {
      setError('Please complete Color, Price and Stock for all variants.')
      return false
    }

    const invalidNumber = variants.some((variant) => {
      const price = Number(variant.price)
      const delPrice = variant.delPrice ? Number(variant.delPrice) : 0
      const discount = variant.discount ? Number(variant.discount) : 0
      const stock = Number(variant.stock)

      return (
        Number.isNaN(price) ||
        price < 0 ||
        Number.isNaN(delPrice) ||
        delPrice < 0 ||
        Number.isNaN(discount) ||
        discount < 0 ||
        discount > 100 ||
        Number.isNaN(stock) ||
        stock < 0
      )
    })

    if (invalidNumber) {
      setError('Please enter valid price, discount and stock values.')
      return false
    }

    setError('')

    return true
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!productId) {
      setError('Product id is missing.')
      return
    }

    if (!validateForm()) {
      return
    }

    const apiFormData = new FormData()

    apiFormData.append('productName', formData.productName.trim())
    apiFormData.append('category', formData.category)

    // Empty optional relation fields are sent as empty strings so the backend can clear them
    apiFormData.append('subCategory', formData.subCategory)
    apiFormData.append('material', formData.material)
    apiFormData.append('section', formData.section)
    apiFormData.append('brand', formData.brand)
    apiFormData.append('dealOfTheDay', String(formData.dealOfTheDay))

    // datetime-local has no timezone: send a full ISO (UTC) value; empty clears the deal window
    apiFormData.append('dealStartTime', formData.dealOfTheDay && formData.dealStartTime ? new Date(formData.dealStartTime).toISOString() : '')
    apiFormData.append('dealEndTime', formData.dealOfTheDay && formData.dealEndTime ? new Date(formData.dealEndTime).toISOString() : '')
    apiFormData.append('coupon', formData.coupon)
    apiFormData.append('tags', JSON.stringify(formData.tags))
    apiFormData.append('videoUrl', formData.videoUrl.trim())

    apiFormData.append('shortDesc', formData.shortDescription)
    apiFormData.append('desc', formData.productDescription)
    apiFormData.append('additionalInformation', formData.additionalInformation)
    apiFormData.append('shippingReturnPolicy', formData.shippingReturnPolicy)
    apiFormData.append('status', formData.status)

    // `images` = saved images this variant should KEEP. Removed ones are left out.
    const cleanVariants = variants.map((variant) => ({
      ...(variant._id ? { _id: variant._id } : {}),
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      delPrice: variant.delPrice !== '' ? Number(variant.delPrice) : 0,
      discount: variant.discount !== '' ? Number(variant.discount) : 0,
      stock: Number(variant.stock),
      images: variant.existingImages,
    }))

    apiFormData.append('variants', JSON.stringify(cleanVariants))

    const cleanSpecifications = specifications
      .filter((spec) => spec.specificationName.trim() || spec.value.trim())
      .map((spec) => ({
        specificationName: spec.specificationName.trim(),
        value: spec.value.trim(),
      }))

    apiFormData.append('specifications', JSON.stringify(cleanSpecifications))

    // New files per variant: one index per file, same order as the files.
    const variantImageIndexes: number[] = []

    variants.forEach((variant, index) => {
      variant.images.forEach((file) => {
        variantImageIndexes.push(index)
        apiFormData.append('variantImages', file)
      })
    })

    apiFormData.append('variantImageIndexes', JSON.stringify(variantImageIndexes))

    try {
      await updateProduct({
        id: productId,
        data: apiFormData,
      }).unwrap()

      await Swal.fire({
        title: 'Success',
        text: 'Product updated successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })

      router.push('/products')
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Unable to update product.')

      setError(message)

      await Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
      })
    }
  }

  // =====================================================
  // UI
  // =====================================================

  if (!productId) {
    return <div className="alert alert-danger">Product id is missing.</div>
  }

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h5 className="mb-1 fw-bold">Edit Product</h5>

            <small className="text-muted">Update product information, variants and specifications</small>
          </div>

          <button type="button" className="btn btn-light d-flex align-items-center gap-2" onClick={handleCancel} disabled={updateLoading}>
            <IconifyIcon icon="solar:arrow-left-linear" width={18} />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {(productLoading || productFetching) && (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" />
                Loading product...
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <IconifyIcon icon="solar:danger-triangle-broken" />

                {error}
              </div>
            )}

            {/* PRODUCT INFO */}

            <div className="card border mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 fw-bold">Product Information</h6>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Product Name
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleTextChange}
                      className="form-control"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Category
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <Select<SelectOption>
                      options={categories}
                      value={getSelectedOption(categories, formData.category)}
                      onChange={handleCategoryChange}
                      placeholder={categoryLoading ? 'Loading Categories...' : 'Select Category'}
                      isLoading={categoryLoading}
                      isDisabled={categoryLoading}
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">Sub-Category</label>

                    <Select<SelectOption>
                      options={subCategories}
                      value={getSelectedOption(subCategories, formData.subCategory)}
                      onChange={(option) => handleSelectChange('subCategory', option)}
                      placeholder={
                        !formData.category ? 'Select Category First' : subCategoryLoading ? 'Loading Sub-Categories...' : 'Select Sub-Category'
                      }
                      isLoading={subCategoryLoading}
                      isDisabled={!formData.category || subCategoryLoading}
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">Material</label>

                    <Select<SelectOption>
                      options={materials}
                      value={getSelectedOption(materials, formData.material)}
                      onChange={(option) => handleSelectChange('material', option)}
                      placeholder={materialLoading ? 'Loading Materials...' : 'Select Material'}
                      isLoading={materialLoading}
                      isDisabled={materialLoading}
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">
                      Section
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <Select<SelectOption>
                      options={sections}
                      value={getSelectedOption(sections, formData.section)}
                      onChange={(option) => handleSelectChange('section', option)}
                      placeholder="Select Section"
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">Brand</label>

                    <Select<SelectOption>
                      options={brands}
                      value={getSelectedOption(brands, formData.brand)}
                      onChange={(option) => handleSelectChange('brand', option)}
                      placeholder={brandLoading ? 'Loading Brands...' : 'Select Brand'}
                      isLoading={brandLoading}
                      isDisabled={brandLoading}
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <label className="form-label fw-semibold">Deal of the Day</label>

                    <Select<SelectOption>
                      options={dealOptions}
                      value={getSelectedOption(dealOptions, String(formData.dealOfTheDay))}
                      onChange={handleDealChange}
                      placeholder="Select"
                      isSearchable={false}
                      isClearable={false}
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6">
                    <label className="form-label fw-semibold">Coupon</label>

                    <Select<SelectOption>
                      options={coupons}
                      value={getSelectedOption(coupons, formData.coupon)}
                      onChange={(option) => handleSelectChange('coupon', option)}
                      placeholder={couponLoading ? 'Loading Coupons...' : 'Select Coupon'}
                      isLoading={couponLoading}
                      isDisabled={couponLoading}
                      isSearchable
                      isClearable
                      styles={selectStyles}
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div>

                  {formData.dealOfTheDay && (
                    <>
                      <div className="col-xl-3 col-lg-4 col-md-6">
                        <label className="form-label fw-semibold">Deal Start Time</label>

                        <input
                          type="datetime-local"
                          name="dealStartTime"
                          className="form-control"
                          value={formData.dealStartTime}
                          onChange={handleTextChange}
                          max={formData.dealEndTime || undefined}
                          required
                        />
                      </div>

                      <div className="col-xl-3 col-lg-4 col-md-6">
                        <label className="form-label fw-semibold">Deal End Time</label>

                        <input
                          type="datetime-local"
                          name="dealEndTime"
                          className="form-control"
                          value={formData.dealEndTime}
                          onChange={handleTextChange}
                          min={formData.dealStartTime || undefined}
                          required
                        />
                      </div>

                      <div className="col-xl-6 col-lg-12 d-flex align-items-end">
                        <div className="alert alert-warning w-100 mb-0 py-2 px-3" role="alert">
                          <strong>Note:</strong> Only one product can be the Deal of the Day. Saving this product will turn off Deal of the Day for
                          any existing product that currently has it.
                        </div>
                      </div>
                    </>
                  )}

                  {/* <div className="col-xl-4 col-lg-4 col-md-12">
                    <label className="form-label fw-semibold">Tags</label>

                    <CreatableSelect<TagOption, true>
                      isMulti
                      isSearchable
                      isClearable
                      options={defaultTagOptions}
                      value={selectedTags}
                      onChange={handleTagChange}
                      placeholder="Select or create tags..."
                      menuPortalTarget={portalTarget}
                      menuPosition="fixed"
                    />
                  </div> */}

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Video URL</label>

                    <input
                      type="url"
                      name="videoUrl"
                      className="form-control"
                      value={formData.videoUrl}
                      onChange={handleTextChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  {existingProductImages.length > 0 && (
                    <div className="col-12">
                      <div className="small text-muted mb-2">Current product images</div>

                      <div className="d-flex gap-2 flex-wrap">
                        {existingProductImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="border rounded overflow-hidden" style={{ width: 90, height: 90 }}>
                            <Image
                              src={image}
                              alt={`Current product ${index + 1}`}
                              width={90}
                              height={90}
                              unoptimized
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VARIANTS */}

            <div className="card border mb-4">
              <div className="card-header bg-light d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div>
                  <h6 className="mb-1 fw-bold">Product Variants</h6>

                  <small className="text-muted">Add multiple size, color, price, stock and image combinations.</small>
                </div>

                <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={addVariant}>
                  <IconifyIcon icon="solar:add-circle-broken" />
                  Add More Variant
                </button>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0" style={{ minWidth: 1250 }}>
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">#</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Price</th>
                        <th>Del Price</th>
                        <th>Stock</th>
                        <th>Images</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {variants.map((variant, index) => {
                        const totalImages = variant.existingImages.length + variant.imagePreviews.length

                        return (
                          <tr key={variant.id}>
                            <td className="text-center fw-semibold">{index + 1}</td>

                            <td style={{ minWidth: 170 }}>
                              <Select<SelectOption>
                                options={sizeOptions}
                                value={getSelectedOption(sizeOptions, variant.size)}
                                onChange={(option) => handleVariantChange(variant.id, 'size', option?.value ?? '')}
                                placeholder={sizeLoading ? 'Loading...' : 'Select Size'}
                                isLoading={sizeLoading}
                                isDisabled={sizeLoading}
                                isSearchable
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={portalTarget}
                                menuPosition="fixed"
                              />
                            </td>

                            <td style={{ minWidth: 180 }}>
                              <Select<SelectOption>
                                options={colorOptions}
                                value={getSelectedOption(colorOptions, variant.color)}
                                onChange={(option) => handleVariantChange(variant.id, 'color', option?.value ?? '')}
                                placeholder={colorLoading ? 'Loading...' : 'Select Color'}
                                isLoading={colorLoading}
                                isDisabled={colorLoading}
                                isSearchable
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={portalTarget}
                                menuPosition="fixed"
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                required
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                step="0.01"
                                value={variant.delPrice}
                                onChange={(e) => handleVariantChange(variant.id, 'delPrice', e.target.value)}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                step="1"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                required
                              />
                            </td>

                            {/* MULTIPLE IMAGES */}

                            <td style={{ minWidth: 280 }}>
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                {variant.existingImages.map((image, imageIndex) => (
                                  <div
                                    key={`old-${image}-${imageIndex}`}
                                    className="position-relative border rounded overflow-hidden flex-shrink-0"
                                    style={{ width: 54, height: 54 }}>
                                    <Image
                                      src={image}
                                      alt={`Variant ${index + 1} saved image ${imageIndex + 1}`}
                                      width={54}
                                      height={54}
                                      unoptimized
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />

                                    <button
                                      type="button"
                                      disabled={updateLoading}
                                      className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                      style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
                                      onClick={() => removeExistingVariantImage(variant.id, imageIndex)}>
                                      ×
                                    </button>
                                  </div>
                                ))}

                                {variant.imagePreviews.map((preview, imageIndex) => (
                                  <div
                                    key={preview}
                                    className="position-relative border border-primary rounded overflow-hidden flex-shrink-0"
                                    style={{ width: 54, height: 54 }}>
                                    <Image
                                      src={preview}
                                      alt={`Variant ${index + 1} new image ${imageIndex + 1}`}
                                      width={54}
                                      height={54}
                                      unoptimized
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />

                                    <button
                                      type="button"
                                      disabled={updateLoading}
                                      className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                      style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
                                      onClick={() => removeNewVariantImage(variant.id, imageIndex)}>
                                      ×
                                    </button>
                                  </div>
                                ))}

                                <label
                                  className="btn btn-soft-dark btn-sm mb-0 d-flex align-items-center justify-content-center"
                                  style={{
                                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                                    minHeight: 54,
                                    minWidth: totalImages === 0 ? 120 : 54,
                                  }}>
                                  {totalImages === 0 ? '+ Add Images' : '+'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    disabled={updateLoading}
                                    onChange={(e) => handleVariantImagesChange(variant.id, e)}
                                  />
                                </label>
                              </div>
                            </td>

                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-soft-danger btn-sm"
                                disabled={variants.length === 1}
                                onClick={() => removeVariant(variant.id)}>
                                <IconifyIcon icon="solar:trash-bin-trash-broken" width={18} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DESCRIPTIONS */}

            <div className="card border mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0 fw-bold">Product Description</h6>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Short Description
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="product-quill-editor">
                      <ReactQuill
                        theme="snow"
                        value={formData.shortDescription}
                        onChange={(value) => setFormData((prev) => ({ ...prev, shortDescription: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Enter short product description..."
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Product Description
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <div className="product-quill-editor product-quill-large">
                      <ReactQuill
                        theme="snow"
                        value={formData.productDescription}
                        onChange={(value) => setFormData((prev) => ({ ...prev, productDescription: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Enter complete product description..."
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-12">
                    <label className="form-label fw-semibold">Additional Information</label>

                    <div className="product-quill-editor">
                      <ReactQuill
                        theme="snow"
                        value={formData.additionalInformation}
                        onChange={(value) => setFormData((prev) => ({ ...prev, additionalInformation: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-12">
                    <label className="form-label fw-semibold">Shipping &amp; Return Policy</label>

                    <div className="product-quill-editor">
                      <ReactQuill
                        theme="snow"
                        value={formData.shippingReturnPolicy}
                        onChange={(value) => setFormData((prev) => ({ ...prev, shippingReturnPolicy: value }))}
                        modules={quillModules}
                        formats={quillFormats}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIFICATIONS */}

            <div className="card border mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h6 className="mb-1 fw-bold">Product Specifications</h6>

                  <small className="text-muted">Add specification name and value.</small>
                </div>

                <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={addSpecification}>
                  <IconifyIcon icon="solar:add-circle-broken" />
                  Add Specification
                </button>
              </div>

              <div className="card-body">
                {specifications.map((specification, index) => (
                  <div key={specification.id} className="row g-3 align-items-end mb-3">
                    <div className="col-lg-1 col-md-2">
                      <label className="form-label fw-semibold">#</label>

                      <div className="form-control bg-light text-center">{index + 1}</div>
                    </div>

                    <div className="col-lg-5 col-md-5">
                      <label className="form-label fw-semibold">Specification Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={specification.specificationName}
                        placeholder="e.g. Fabric"
                        onChange={(e) => handleSpecificationChange(specification.id, 'specificationName', e.target.value)}
                      />
                    </div>

                    <div className="col-lg-5 col-md-4">
                      <label className="form-label fw-semibold">Value</label>

                      <input
                        type="text"
                        className="form-control"
                        value={specification.value}
                        placeholder="e.g. 100% Cotton"
                        onChange={(e) => handleSpecificationChange(specification.id, 'value', e.target.value)}
                      />
                    </div>

                    <div className="col-lg-1 col-md-1">
                      <button
                        type="button"
                        className="btn btn-soft-danger w-100 d-flex align-items-center justify-content-center"
                        style={{ minHeight: 38 }}
                        onClick={() => removeSpecification(specification.id)}>
                        <IconifyIcon icon="solar:trash-bin-trash-broken" width={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="p-3 border-top bg-white d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ zIndex: 40 }}>
            <div className="d-flex align-items-center gap-3">
              <div className="form-check form-switch mb-0">
                <input
                  id="productStatusToggle"
                  type="checkbox"
                  className="form-check-input"
                  role="switch"
                  checked={formData.status === 'active'}
                  disabled={updateLoading}
                  onChange={handleStatusToggle}
                  style={{
                    width: 42,
                    height: 22,
                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                  }}
                />

                <label
                  className="form-check-label ms-2 fw-semibold"
                  htmlFor="productStatusToggle"
                  style={{
                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                  }}>
                  Product Status
                </label>
              </div>

              <span className={`badge ${formData.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-3 py-2`}>
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-light px-4" disabled={updateLoading} onClick={handleCancel}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary px-4 d-flex align-items-center justify-content-center gap-2" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:diskette-broken" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .product-quill-editor .ql-toolbar.ql-snow {
          border-color: #dee2e6;
          border-radius: 8px 8px 0 0;
          background: #ffffff;
        }

        .product-quill-editor .ql-container.ql-snow {
          border-color: #dee2e6;
          border-radius: 0 0 8px 8px;
          background: #ffffff;
          font-size: 14px;
        }

        .product-quill-editor .ql-editor {
          min-height: 150px;
          font-size: 14px;
          line-height: 1.6;
        }

        .product-quill-large .ql-editor {
          min-height: 240px;
        }

        .product-quill-editor .ql-editor.ql-blank::before {
          color: #8c98a4;
          font-style: normal;
        }
      `}</style>
    </>
  )
}

export default ProductsEdit
