import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addToCart } from '@/store/actions/cart-actions'
import { AppState, wrapper } from '@/store/store'
import {
  getItemsFromCookies,
  removeItemFromCart,
} from '@/store/reducers/cart-reducers'

import Image from 'next/image'
import Link from 'next/link'
import Message from '@/components/message'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { AnyAction } from '@reduxjs/toolkit'
import Loader from '@/components/loader'
import { useRouter } from 'next/router'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import Head from 'next/head'

const Cart = () => {
  const { cartItems } = useSelector((state: AppState) => state.cart)
  const dispatch = useDispatch()
  let itemsShowed = useRef(false)
  const router = useRouter()

  useEffect(() => {
    dispatch(getItemsFromCookies())
  }, [dispatch])

  useEffect(() => {
    if (cartItems?.length) itemsShowed.current = true
    console.log(cartItems)
  }, [cartItems])

  const removeFromCartHandler = (id: string) => {
    dispatch(removeItemFromCart({ id }))
  }

  const checkoutHandler = () => {
    router.push('/login?redirect=shipping')
  }

  return (
    <>
      <Head>
        <title>My Cart | MERNShop</title>
      </Head>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {!cartItems?.length ? (
            itemsShowed.current ? (
              <Loader />
            ) : (
              <Message>
                Your cart is empty <Link href="/">Go Back</Link>
              </Message>
            )
          ) : (
            <ListGroup variant="flush">
              {cartItems?.map(item => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2} className="position-relative">
                      <Image
                        className="rounded"
                        src={item.image}
                        alt={item.name}
                        fill
                      />
                    </Col>
                    <Col md={3}>
                      <Link href={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>{item.price}</Col>
                    <Col md={2}>
                      <Form.Select
                        value={item.qty}
                        onChange={e =>
                          dispatch(
                            addToCart({
                              id: item.product,
                              qty: +e.target.value,
                            }) as unknown as AnyAction
                          )
                        }
                      >
                        {Array.from({ length: +item.countInStock }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, cur) => acc + +cur.qty, 0)})
                  items
                </h2>
                $
                {cartItems
                  .reduce((acc, cur) => acc + +cur.qty * cur.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={!cartItems.length}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Cart

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))
      return { props: {} }
    }
)
