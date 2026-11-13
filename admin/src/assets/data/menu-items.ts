import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-5-bold-duotone',
    url: '/dashboard',
  },

  // =========================
  // ECOMMERCE
  // =========================
  {
    key: 'ecommerce',
    label: 'Ecommerce',
    isTitle: true,
  },
  {
    key: 'add-products',
    label: 'All Products',
    icon: 'solar:box-bold-duotone',
    url: '/products',
  },
  {
    key: 'orders',
    label: 'Orders List',
    icon: 'solar:clipboard-list-bold-duotone',
    url: '/orders-list',
  },
  {
    key: 'pending-list',
    label: 'Pending Orders',
    icon: 'solar:hourglass-line-bold-duotone',
    url: '/pending-list',
  },
  {
    key: 'return-request',
    label: 'Return Request',
    icon: 'solar:undo-left-round-bold-duotone',
    url: '/return-request',
  },
  // =========================
  // MASTERS
  // =========================
  {
    key: 'master',
    label: 'Masters',
    isTitle: true,
  },
  {
    key: 'colors',
    label: 'Colors Management',
    icon: 'solar:pallete-2-bold-duotone',
    url: '/colors-management',
  },
  {
    key: 'size',
    label: 'Size Management',
    icon: 'solar:ruler-angular-bold-duotone',
    url: '/size-management',
  },
  {
    key: 'brands',
    label: 'Brands Master',
    icon: 'solar:tag-bold-duotone',
    url: '/brands-master',
  },
  {
    key: 'material',
    label: 'Material Master',
    icon: 'solar:layers-bold-duotone',
    url: '/material-master',
  },
  {
    key: 'coupons',
    label: 'Coupons Management',
    icon: 'solar:tag-price-bold-duotone',
    url: '/coupons-management',
  },

  // =========================
  // PAYMENTS
  // =========================
  {
    key: 'payments',
    label: 'Payments',
    isTitle: true,
  },
  {
    key: 'payment-list',
    label: 'Payment List',
    icon: 'solar:wallet-money-bold-duotone',
    url: '/payment-list',
  },

  // =========================
  // ENQUIRIES
  // =========================
  {
    key: 'enquires',
    label: 'Enquires',
    isTitle: true,
  },
  {
    key: 'contact-enquires',
    label: 'Contact Enquires',
    icon: 'solar:chat-round-dots-bold-duotone',
    url: '/contact-enquires',
  },
  {
    key: 'job-enquires',
    label: 'Job Enquires',
    icon: 'solar:case-round-bold-duotone',
    url: '/Job-enquires',
  },
  {
    key: 'store-enquires',
    label: 'Store Enquires',
    icon: 'solar:shop-2-bold-duotone',
    url: '/store-enquires',
  },
  // =========================
  // VENDOR MANAGEMENT
  // =========================
  // {
  //   key: 'vendors',
  //   label: 'Vendors Management',
  //   isTitle: true,
  // },
  // {
  //   key: 'all-vendors',
  //   label: 'All Vendors',
  //   icon: 'solar:users-group-rounded-bold-duotone',
  //   url: '/all-vendors',
  // },
  // {
  //   key: 'all-packages',
  //   label: 'All Packages',
  //   icon: 'solar:box-minimalistic-bold-duotone',
  //   url: '/all-packages',
  // },

  // =========================
  // APP MANAGEMENT
  // =========================
  {
    key: 'app-management',
    label: 'App Management',
    isTitle: true,
  },
  {
    key: 'app-banners',
    label: 'App Banners',
    icon: 'solar:gallery-wide-bold-duotone',
    url: '/app-banners',
  },
  {
    key: 'app-settings',
    label: 'App Settings',
    icon: 'solar:smartphone-2-bold-duotone',
    url: '/app-settings',
  },
  // =========================
  // BLOG PAGES
  // =========================
  {
    key: 'blog-pages',
    label: 'Blogs',
    isTitle: true,
  },
  {
    key: 'blog-category',
    label: 'Blog Category',
    icon: 'solar:folder-with-files-bold-duotone',
    url: '/blog-category',
  },
  {
    key: 'blog',
    label: 'Blogs',
    icon: 'solar:document-text-bold-duotone',
    url: '/blogs',
  },

  // =========================
  // WEB PAGES
  // =========================
  {
    key: 'web-pages',
    label: 'Web Pages',
    isTitle: true,
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: 'solar:widget-3-bold-duotone',
    url: '/categories',
  },
  {
    key: 'sub-categories',
    label: 'Sub Categories',
    icon: 'solar:layers-bold-duotone',
    url: '/sub-categories',
  },
  {
    key: 'homeBanner',
    label: 'Home Banner',
    icon: 'solar:gallery-bold-duotone',
    url: '/home-banner',
  },
  {
    key: 'offer-banner',
    label: 'Offer Banners',
    icon: 'solar:tag-price-bold-duotone',
    url: '/offer-banners',
  },
  {
    key: 'top-sale-banners',
    label: 'Top Sale Banners',
    icon: 'solar:fire-bold-duotone',
    url: '/top-sale-banners',
  },
  {
    key: 'aboutUs',
    label: 'About Us',
    icon: 'solar:info-circle-bold-duotone',
    url: '/about-us',
  },
  // {
  //   key: 'counter',
  //   label: 'Counter',
  //   icon: 'solar:graph-up-bold-duotone',
  //   url: '/counter',
  // },
  // {
  //   key: 'our-team',
  //   label: 'Our Team',
  //   icon: 'solar:users-group-two-rounded-bold-duotone',
  //   url: '/our-team',
  // },
  {
    key: 'faq',
    label: 'Faq',
    icon: 'solar:question-circle-bold-duotone',
    url: '/faq',
  },
  {
    key: 'store-locator',
    label: 'Store Locations',
    icon: 'solar:map-point-bold-duotone',
    url: '/store-locator',
  },
  {
    key: 'career-info',
    label: 'Career Info',
    icon: 'solar:case-minimalistic-bold-duotone',
    url: '/career-info',
  },
  {
    key: 'current-openings',
    label: 'Current Openings',
    icon: 'solar:user-check-rounded-bold-duotone',
    url: '/current-openings',
  },
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: 'solar:shield-check-bold-duotone',
    url: '/privacy-policy',
  },
  {
    key: 'return-refunds',
    label: 'Return Refunds',
    icon: 'solar:restart-circle-bold-duotone',
    url: '/return-refunds',
  },
  {
    key: 'vendor-policy',
    label: 'Vendor Policy',
    icon: 'solar:shop-bold-duotone',
    url: '/vendor-policy',
  },
  {
    key: 'terms-and-conditions',
    label: 'Terms and Conditions',
    icon: 'solar:document-text-bold-duotone',
    url: '/terms-and-conditions',
  },

  // =========================
  // GENERAL SETTINGS
  // =========================
  {
    key: 'general-settings',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'seo-pages',
    label: 'SEO Pages',
    icon: 'solar:magnifer-bold-duotone',
    url: '/seo-pages',
  },
  {
    key: 'settings',
    label: 'General Settings',
    icon: 'solar:settings-bold-duotone',
    url: '/settings',
  },
  {
    key: 'user-settings',
    label: 'User Settings',
    icon: 'solar:user-id-bold-duotone',
    url: '/user-settings',
  },
]
