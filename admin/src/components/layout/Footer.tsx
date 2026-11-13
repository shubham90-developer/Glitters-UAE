import { Col, Container, Row } from 'react-bootstrap'
import IconifyIcon from '../wrappers/IconifyIcon'

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            © Copyrights {new Date().getFullYear()}. All rights reserved. Design & Development by&nbsp;
            <IconifyIcon icon="iconamoon:heart-duotone" className="fs-18 align-middle text-danger" />{' '}
            <a className="fw-bold footer-text" target="_blank">
              Glitters Admin
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
