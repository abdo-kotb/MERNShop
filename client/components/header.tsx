import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/20/solid'

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} href="/">
            MERNShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                className="d-flex align-items-center"
                as={Link}
                href="/cart"
              >
                <ShoppingCartIcon className="me-1" width={20} />
                Cart
              </Nav.Link>
              <Nav.Link
                className="d-flex align-items-center"
                as={Link}
                href="/login"
              >
                <UserIcon className="me-1" width={20} />
                Sign In
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
