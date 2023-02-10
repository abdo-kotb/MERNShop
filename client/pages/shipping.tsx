import CheckoutSteps from '@/components/checkout-steps'
import FormContainer from '@/components/form-container'
import {
  getShippingAddressFromCookies,
  saveShippingAddress,
} from '@/store/reducers/cart-reducers'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Shipping = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { shippingAddress } = useSelector((state: AppState) => state.cart)

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)
  const [error, setError] = useState<string | null>('')

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    router.push('/payment')
  }

  return (
    <>
      <Head>
        <title>Shipping | MERNShop</title>
      </Head>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              value={address}
              required
              onChange={e => {
                setAddress(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter City"
              value={city}
              required
              onChange={e => {
                setCity(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Postal Code"
              value={postalCode}
              required
              onChange={e => {
                setPostalCode(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Country"
              value={country}
              onChange={e => {
                setCountry(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default Shipping

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      if (req.cookies.shippingAddress)
        store.dispatch(
          getShippingAddressFromCookies(
            JSON.parse(req.cookies.shippingAddress!)
          )
        )
      return { props: {} }
    }
)
