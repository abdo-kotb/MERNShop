import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Nav } from 'react-bootstrap'

interface IProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

const CheckoutSteps: FC<IProps> = ({ step1, step2, step3, step4 }) => {
  const router = useRouter()

  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        <Nav.Link
          as={Link}
          href="/login"
          disabled={!step1}
          style={router.asPath === '/login' ? { fontWeight: 'bold' } : {}}
        >
          Sign In
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          href="/shipping"
          disabled={!step2}
          style={router.asPath === '/shipping' ? { fontWeight: 'bold' } : {}}
        >
          Shipping
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          href="/payment"
          disabled={!step3}
          style={router.asPath === '/payment' ? { fontWeight: 'bold' } : {}}
        >
          Payment
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={Link}
          href="/order"
          disabled={!step4}
          style={router.asPath === '/order' ? { fontWeight: 'bold' } : {}}
        >
          Place Order
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
