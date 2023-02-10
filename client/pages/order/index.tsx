import CheckoutSteps from '@/components/checkout-steps'
import Message from '@/components/message'
import { createOrder } from '@/store/actions/order-actions'
import {
  getItemsFromCookies,
  getPaymentMethodFromCookies,
  getShippingAddressFromCookies,
} from '@/store/reducers/cart-reducers'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Order = () => {
  const router = useRouter()
  const { order, success, error } = useSelector(
    (state: AppState) => state.createOrder
  )
  const { cartItems, shippingAddress, paymentMethod } = useSelector(
    (state: AppState) => state.cart
  )
  const dispatch = useDispatch()

  const addDecimals = (num: number) => (Math.round(num * 100) / 100).toFixed(2)

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * +item.qty, 0)
  )

  const shippingPrice = addDecimals(+itemsPrice > 100 ? 0 : 100)
  const taxPrice = addDecimals(Number((0.15 * +itemsPrice).toFixed(2)))

  const totalPrice = (+itemsPrice + +shippingPrice + +taxPrice).toFixed(2)

  useEffect(() => {
    if (success && order) router.push(`/order/${order._id}`)
  }, [success, order, router])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }) as unknown as AnyAction
    )
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2> {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {!cartItems.length ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map(item => (
                    <ListGroup.Item key={item.product}>
                      <Row>
                        <Col md={1} className="position-relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="rounded"
                          />
                        </Col>
                        <Col>
                          <Link href={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${+item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{error}</Message>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100"
                  disabled={!cartItems}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Order

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      if (req.cookies.cartItems)
        store.dispatch(getItemsFromCookies(JSON.parse(req.cookies.cartItems!)))
      if (req.cookies.shippingAddress)
        store.dispatch(
          getShippingAddressFromCookies(
            JSON.parse(req.cookies.shippingAddress!)
          )
        )
      if (req.cookies.paymentMethod)
        store.dispatch(
          getPaymentMethodFromCookies(JSON.parse(req.cookies.paymentMethod!))
        )
      return { props: {} }
    }
)
