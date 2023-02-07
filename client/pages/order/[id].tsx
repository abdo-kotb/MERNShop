import Loader from '@/components/loader'
import Message from '@/components/message'
import CartItem from '@/interfaces/cart-item'
import { getOrderDetails } from '@/store/actions/order-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useDispatch, useSelector } from 'react-redux'
import PayPalButton from '@/components/paypal-button'

const SingleOrder = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const orderId = router.query.id
  const { loading, order, error, success, processingPay } = useSelector(
    (state: AppState) => state.orderDetails
  )
  const [clientId, setClientId] = useState('')

  useEffect(() => {
    const setPayPalID = async () => {
      const { data: id } = await axios.get(
        `${process.env.API_ROOT}/config/paypal`
      )
      setClientId(id)
    }

    if (!order || success)
      dispatch(getOrderDetails(orderId as string) as unknown as AnyAction)
    else if (!order.isPaid) {
      if (!window.paypal) setPayPalID()
    }
  }, [dispatch, success, orderId, order])

  const addDecimals = (num: number) => (Math.round(num * 100) / 100).toFixed(2)

  const itemsPrice = addDecimals(
    order.orderItems.reduce(
      (acc: number, item: CartItem) => acc + item.price * +item.qty,
      0
    )
  )

  if (loading) return <Loader />

  if (error) return <Message variant="danger">{error}</Message>

  return (
    <>
      <h1>Order #{orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.paidAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {!order.orderItems.length ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item: CartItem) => (
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
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item className="mt-3">
                  {processingPay && <Loader />}
                  {!clientId ? (
                    <Loader />
                  ) : (
                    <PayPalScriptProvider options={{ 'client-id': clientId }}>
                      <PayPalButton totalPrice={order.totalPrice} />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SingleOrder

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, params }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))
      const { userInfo } = store.getState().userLogin

      if (!userInfo) {
        return {
          notFound: true,
        }
      }

      await store.dispatch(
        getOrderDetails(params!.id as string) as unknown as AnyAction
      )

      return { props: {} }
    }
)
