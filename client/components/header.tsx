import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '@/store/store'
import { NavDropdown } from 'react-bootstrap'
import { logout } from '@/store/reducers/user-reducers'
import SearchBox from './search-box'

const Header = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  const logoutHandler = () => dispatch(logout())

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} href="/">
            MERNShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">
              <Nav.Link as={Link} href="/cart">
                <FontAwesomeIcon className="me-1" icon={faShoppingCart} />
                Cart
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} href="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} href="/login">
                  <FontAwesomeIcon className="me-1" icon={faUser} />
                  Sign In
                </Nav.Link>
              )}
              {userInfo?.isAdmin && (
                <NavDropdown title="Admin" id="admin-menu">
                  <NavDropdown.Item as={Link} href="/admin/users-list">
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/admin/products-list">
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/admin/orders-list">
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
