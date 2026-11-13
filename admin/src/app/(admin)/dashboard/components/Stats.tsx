'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { currency } from '@/context/constants'
import { useGetDashboardStatsQuery, DashboardStats } from '@/store/dashboardApi'

type CardConfig = {
  icon: string
  name: string
  bg: string
  getValue: (s: DashboardStats) => string
}

const num = (n: number) => n.toLocaleString('en-US')
const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const cards: CardConfig[] = [
  { icon: 'solar:box-bold-duotone', name: 'Total Products', bg: '#EAF2FF', getValue: (s) => num(s.totalProducts) },
  { icon: 'solar:cart-large-2-bold-duotone', name: 'Total Orders', bg: '#ECFDF3', getValue: (s) => num(s.totalOrders) },
  { icon: 'solar:bag-check-bold-duotone', name: "Today's Orders", bg: '#FFF8E6', getValue: (s) => num(s.todaysOrders) },
  { icon: 'solar:wallet-money-bold-duotone', name: 'Total Revenue', bg: '#EAFBFF', getValue: (s) => `${currency} ${compact(s.totalRevenue)}` },
  { icon: 'solar:shop-2-bold-duotone', name: 'Total Customers', bg: '#FFF0F3', getValue: (s) => num(s.totalCustomers) },
  { icon: 'solar:clock-circle-bold-duotone', name: 'Pending Orders', bg: '#F2F0F3', getValue: (s) => num(s.pendingOrders) },
  { icon: 'solar:case-round-bold-duotone', name: 'Total Job Enquiries', bg: '#F0FDF4', getValue: (s) => num(s.totalJobEnquiries) },
  { icon: 'solar:chat-round-dots-bold-duotone', name: 'Total Contact Enquiries', bg: '#FFF9E8', getValue: (s) => num(s.totalContactEnquiries) },
  { icon: 'solar:document-text-bold-duotone', name: 'Total Blogs', bg: '#FFF1F2', getValue: (s) => num(s.totalBlogs) },
]

const StatsCard = ({ icon, name, bg, value }: { icon: string; name: string; bg: string; value: string }) => {
  return (
    <Col md={4}>
      <Card className="overflow-hidden border-1" style={{ backgroundColor: bg }}>
        <CardBody>
          <Row className="align-items-center">
            <Col xs={5}>
              <div className="avatar-md bg-white bg-opacity-75 rounded flex-centered">
                <IconifyIcon icon={icon} className="fs-24" />
              </div>
            </Col>

            <Col xs={7} className="text-end">
              <p className="text-dark mb-1 text-truncate">{name}</p>
              <h4 className="text-dark mt-1 mb-0">{value}</h4>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const Stats = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  })
  const stats = data?.data

  return (
    <Col xs={12}>
      <Row>
        <Col xs={12}>
          <div className="alert alert-primary text-truncate mb-3" role="alert">
            👋 Welcome to the Dashboard
          </div>
        </Col>

        {isError && (
          <Col xs={12}>
            <div className="alert alert-danger mb-3" role="alert">
              Could not load dashboard stats. Please refresh.
            </div>
          </Col>
        )}

        {cards.map((item) => (
          <StatsCard key={item.name} icon={item.icon} name={item.name} bg={item.bg} value={isLoading || !stats ? '...' : item.getValue(stats)} />
        ))}
      </Row>
    </Col>
  )
}

export default Stats
