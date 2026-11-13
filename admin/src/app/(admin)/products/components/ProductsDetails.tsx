'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetProductsByIdQuery } from '@/store/productsApi'

type RefValue =
  | string
  | {
      _id?: string
      categoryName?: string
      subCategoryName?: string
      brandName?: string
      materialName?: string
      size?: string
      sizeName?: string
      colorName?: string
      couponCode?: string
      name?: string
      title?: string
      hexCode?: string
      discount?: number
      status?: string
    }
  | null
  | undefined

type ProductVariant = {
  _id?: string
  size?: RefValue
  color?: RefValue
  price?: number | string
  delPrice?: number | string
  discount?: number | string
  stock?: number | string
  images?: string[]
  image?: string // legacy
}

type ProductSpecification = {
  _id?: string
  specificationName?: string
  value?: string
}

type ProductDetailsData = {
  _id: string
  productName?: string
  category?: RefValue
  subCategory?: RefValue
  material?: RefValue
  section?: string
  brand?: RefValue
  dealOfTheDay?: boolean
  coupon?: RefValue
  tags?: string[]
  videoUrl?: string
  productImages?: string[]
  variants?: ProductVariant[]
  shortDesc?: string
  desc?: string
  additionalInformation?: string
  shippingReturnPolicy?: string
  specifications?: ProductSpecification[]
  status?: string
  createdAt?: string
  updatedAt?: string
}

type ApiError = {
  data?: { message?: string }
  error?: string
}

const getRefLabel = (value: RefValue, fallback = 'N/A'): string => {
  if (!value) return fallback

  if (typeof value === 'string') {
    return value
  }

  return (
    value.categoryName ||
    value.subCategoryName ||
    value.brandName ||
    value.materialName ||
    value.size ||
    value.sizeName ||
    value.colorName ||
    value.couponCode ||
    value.name ||
    value.title ||
    fallback
  )
}

const formatPrice = (value?: number | string): string => {
  const amount = Number(value || 0)

  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })
}

// supports new `images[]` and old single `image`
const getVariantImages = (variant: ProductVariant): string[] => {
  if (Array.isArray(variant.images) && variant.images.length > 0) {
    return variant.images.filter(Boolean)
  }

  return variant.image ? [variant.image] : []
}

const renderHtml = (html?: string) => {
  if (!html) {
    return <p className="text-muted mb-0">No information available.</p>
  }

  return (
    <div
      className="product-rich-content"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

const ProductsDetails = () => {
  const params = useParams<{
    id: string
  }>()

  const productId = typeof params?.id === 'string' ? params.id : ''

  const [selectedImage, setSelectedImage] = useState<string>('')

  const {
    data: productResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetProductsByIdQuery(productId, {
    skip: !productId,
  })

  const product = useMemo<ProductDetailsData | null>(() => {
    if (!productResponse) {
      return null
    }

    const res = productResponse as (ProductDetailsData & { data?: ProductDetailsData }) | undefined

    return res?.data ?? res ?? null
  }, [productResponse])

  // Gallery: product images first, then every variant image (no duplicates)
  const galleryImages = useMemo<string[]>(() => {
    if (!product) {
      return []
    }

    const productImages = Array.isArray(product.productImages) ? product.productImages.filter(Boolean) : []

    const variantImages = (product.variants || []).flatMap((variant) => getVariantImages(variant))

    return Array.from(new Set([...productImages, ...variantImages]))
  }, [product])

  const mainImage = selectedImage && galleryImages.includes(selectedImage) ? selectedImage : galleryImages[0] || ''

  const totalStock = useMemo(() => {
    return (product?.variants || []).reduce((total, variant) => total + Number(variant.stock || 0), 0)
  }, [product])

  const lowestPrice = useMemo(() => {
    const prices = (product?.variants || []).map((variant) => Number(variant.price || 0)).filter((price) => price > 0)

    return prices.length ? Math.min(...prices) : 0
  }, [product])

  if (!productId) {
    return <div className="alert alert-danger">Product id is missing.</div>
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />

        <div className="text-muted mt-2">Loading product details...</div>
      </div>
    )
  }

  if (isError) {
    const apiError = error as ApiError | undefined

    return <div className="alert alert-danger">{apiError?.data?.message || apiError?.error || 'Unable to load product details.'}</div>
  }

  if (!product) {
    return <div className="alert alert-warning">Product not found.</div>
  }

  const isActive = String(product.status).toLowerCase() === 'active'

  return (
    <>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Product Details</h4>

          <p className="text-muted mb-0">View complete product information, variants and specifications.</p>
        </div>

        <div className="d-flex gap-2">
          <Link href="/products" className="btn btn-light d-flex align-items-center gap-2">
            <IconifyIcon icon="solar:arrow-left-linear" width={18} />
            Back
          </Link>

          <Link href={`/products/edit/${product._id}`} className="btn btn-primary d-flex align-items-center gap-2">
            <IconifyIcon icon="solar:pen-2-bold-duotone" width={18} />
            Edit Product
          </Link>
        </div>
      </div>

      <Row className="g-4">
        <Col xl={4}>
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="product-details-main-image mb-3">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.productName || 'Product'}
                    width={700}
                    height={700}
                    unoptimized
                    className="w-100 h-100 object-fit-cover rounded"
                  />
                ) : (
                  <div className="product-details-placeholder">
                    <IconifyIcon icon="solar:gallery-bold-duotone" width={55} />

                    <span className="mt-2">No Image</span>
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="d-flex gap-2 flex-wrap">
                  {galleryImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`product-details-thumb p-0 bg-transparent ${image === mainImage ? 'product-details-thumb-active' : ''}`}
                      onClick={() => setSelectedImage(image)}>
                      <Image src={image} alt={`Product ${index + 1}`} width={80} height={80} unoptimized className="w-100 h-100 object-fit-cover" />
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                    <span className="badge bg-primary-subtle text-primary">{getRefLabel(product.category)}</span>

                    {product.subCategory && <span className="badge bg-light text-body">{getRefLabel(product.subCategory)}</span>}

                    <span className={`badge ${isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="mb-2">{product.productName || 'Unnamed Product'}</h3>

                  <div className="text-muted">Product ID: {product._id}</div>
                </div>

                {product.dealOfTheDay && <span className="badge bg-warning-subtle text-warning px-3 py-2">Deal of the Day</span>}
              </div>

              <Row className="g-3">
                <Col md={4}>
                  <div className="product-info-box">
                    <span>Starting Price</span>
                    <strong>₹{formatPrice(lowestPrice)}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Total Stock</span>
                    <strong>{totalStock} Units</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Variants</span>
                    <strong>{product.variants?.length || 0}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Brand</span>
                    <strong>{getRefLabel(product.brand)}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Material</span>
                    <strong>{getRefLabel(product.material)}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Section</span>
                    <strong>{product.section || 'N/A'}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Coupon</span>
                    <strong>{getRefLabel(product.coupon)}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Created</span>
                    <strong>{product.createdAt || 'N/A'}</strong>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="product-info-box">
                    <span>Updated</span>
                    <strong>{product.updatedAt || 'N/A'}</strong>
                  </div>
                </Col>
              </Row>

              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <div className="fw-semibold mb-2">Tags</div>

                  <div className="d-flex gap-2 flex-wrap">
                    {product.tags.map((tag) => (
                      <span key={tag} className="badge bg-light text-body border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.videoUrl && (
                <div className="mt-4">
                  <div className="fw-semibold mb-2">Video URL</div>

                  <a href={product.videoUrl} target="_blank" rel="noreferrer" className="text-break">
                    {product.videoUrl}
                  </a>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Product Variants</h5>
            </CardHeader>

            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Images</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Price</th>
                      <th>Del Price</th>
                      <th>Discount</th>
                      <th>Stock</th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.variants && product.variants.length > 0 ? (
                      product.variants.map((variant, index) => {
                        const variantImages = getVariantImages(variant)

                        return (
                          <tr key={variant._id || index}>
                            <td>{index + 1}</td>

                            <td style={{ minWidth: 200 }}>
                              {variantImages.length > 0 ? (
                                <div className="d-flex gap-2 flex-wrap">
                                  {variantImages.map((image, imageIndex) => (
                                    <button
                                      type="button"
                                      key={`${image}-${imageIndex}`}
                                      className="p-0 border-0 bg-transparent"
                                      title="Show in gallery"
                                      onClick={() => setSelectedImage(image)}>
                                      <Image
                                        src={image}
                                        alt={`Variant ${index + 1} image ${imageIndex + 1}`}
                                        width={55}
                                        height={55}
                                        unoptimized
                                        className="rounded border object-fit-cover"
                                        style={{ width: 55, height: 55 }}
                                      />
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>

                            <td>{getRefLabel(variant.size)}</td>

                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {typeof variant.color === 'object' && variant.color?.hexCode && (
                                  <span
                                    className="variant-color-dot"
                                    style={{
                                      background: variant.color.hexCode,
                                    }}
                                  />
                                )}

                                {getRefLabel(variant.color)}
                              </div>
                            </td>

                            <td>₹{formatPrice(variant.price)}</td>

                            <td>₹{formatPrice(variant.delPrice)}</td>

                            <td>{Number(variant.discount || 0)}%</td>

                            <td>
                              <span
                                className={`badge ${
                                  Number(variant.stock || 0) > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                }`}>
                                {Number(variant.stock || 0)}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">
                          No variants available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Specifications</h5>
            </CardHeader>

            <CardBody>
              {product.specifications && product.specifications.length > 0 ? (
                <Row className="g-3">
                  {product.specifications.map((spec, index) => (
                    <Col md={6} key={spec._id || index}>
                      <div className="product-spec-box">
                        <span>{spec.specificationName || 'Specification'}</span>

                        <strong>{spec.value || 'N/A'}</strong>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted mb-0">No specifications available.</p>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Short Description</h5>
            </CardHeader>

            <CardBody>{renderHtml(product.shortDesc)}</CardBody>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Product Description</h5>
            </CardHeader>

            <CardBody>{renderHtml(product.desc)}</CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card className="border-0 shadow-sm h-100">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Additional Information</h5>
            </CardHeader>

            <CardBody>{renderHtml(product.additionalInformation)}</CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card className="border-0 shadow-sm h-100">
            <CardHeader className="bg-white">
              <h5 className="mb-0">Shipping & Return Policy</h5>
            </CardHeader>

            <CardBody>{renderHtml(product.shippingReturnPolicy)}</CardBody>
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .product-details-main-image {
          width: 100%;
          height: 340px;
          overflow: hidden;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #edf0f4;
        }

        .product-details-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9aa4b2;
        }

        .product-details-thumb {
          width: 70px;
          height: 70px;
          overflow: hidden;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          cursor: pointer;
        }

        .product-details-thumb-active {
          border-color: var(--bs-primary);
        }

        .product-info-box {
          height: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid #edf0f4;
          background: #fafbfc;
        }

        .product-info-box span {
          display: block;
          color: #8b95a5;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .product-info-box strong {
          display: block;
          color: #334155;
          font-size: 14px;
          word-break: break-word;
        }

        .variant-color-dot {
          width: 18px;
          height: 18px;
          display: inline-block;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid #d8dee8;
        }

        .product-spec-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 14px;
          border: 1px solid #edf0f4;
          border-radius: 9px;
          background: #fafbfc;
        }

        .product-spec-box span {
          color: #64748b;
          font-size: 13px;
        }

        .product-spec-box strong {
          color: #334155;
          text-align: right;
        }

        .product-rich-content {
          color: #475569;
          line-height: 1.75;
        }

        .product-rich-content > :last-child {
          margin-bottom: 0;
        }

        .object-fit-cover {
          object-fit: cover;
        }

        @media (max-width: 767.98px) {
          .product-details-main-image {
            height: 260px;
          }
        }
      `}</style>
    </>
  )
}

export default ProductsDetails
