import { Row } from 'react-bootstrap'
import Stats from './components/Stats'
import { Metadata } from 'next'
import Conversions from './components/Conversions'

export const metadata: Metadata = { title: 'Dashboard' }

const DashboardPage = () => {
  return (
    <>
      <Row>
        <Stats />
        <Conversions />
      </Row>
    </>
  )
}

export default DashboardPage
