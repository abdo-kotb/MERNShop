import CheckoutSteps from '@/components/checkout-steps'
import FormContainer from '@/components/form-container'
import {
  getShippingAddressFromCookies,
  savePaymentMethod,
} from '@/store/reducers/cart-reducers'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Payment = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { shippingAddress } = useSelector((state: AppState) => state.cart)

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    router.push('/order')
  }

  return (
    <>
      <Head>
        <title>Payment | MERNShop</title>
      </Head>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-4">
            <Form.Label as="legend">Select Method</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="paypal"
                checked
                onChange={e => setPaymentMethod(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default Payment

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
      const { shippingAddress } = store.getState().cart

      if (!shippingAddress) {
        return {
          redirect: { destination: '/shipping', permanent: false },
        }
      }

      return { props: {} }
    }
)
