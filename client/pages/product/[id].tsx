import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { AppState } from '@/store/store'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'

import Rating from '@/components/rating'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { useRouter } from 'next/router'
import { addToCart } from '@/store/actions/cart-actions'
import { getProductDetails } from '@/store/actions/product-actions'

const Product = () => {
  const [qty, setQty] = useState(1)
  const dispatch = useDispatch()

  const router = useRouter()
  const productId = router.query.id as string
  const { product, loading, error } = useSelector(
    (state: AppState) => state.product
  )

  const dispatchProductData = useCallback(
    async (id: string) => {
      await dispatch(getProductDetails({ id }) as unknown as AnyAction)
    },
    [dispatch]
  )

  useEffect(() => {
    if (productId) dispatchProductData(productId)
  }, [productId, dispatchProductData])

  const addToCartHandler = async () => {
    await dispatch(addToCart({ id: productId, qty }) as unknown as AnyAction)
    router.push('/cart')
  }

  return (
    <>
      <Link className="btn btn-light my-3" href="/">
        Go back
      </Link>
      {loading || !product.name ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6} className="position-relative">
            <Image src={product.image} alt={product.name} fill />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{product.name}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col sm={5}>Qty</Col>
                      <Col>
                        <Form.Select
                          value={qty}
                          onChange={e => setQty(+e.target.value)}
                        >
                          {Array.from(
                            { length: product.countInStock },
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block w-100"
                    type="button"
                    disabled={!product.countInStock}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

// export const getStaticProps = wrapper.getStaticProps(store => async context => {
//   const {
//     params: { id },
//   } = context as GetStaticPropsContext & { params: { id: string } }

//   await store.dispatch(getProductDetails({ id }) as unknown as AnyAction)

//   return {
//     props: {},
//   }
// })

// export const getStaticPaths: GetStaticPaths = async () => {
//   await store.dispatch(getAllProducts())
//   const {
//     products: { products },
//   } = store.getState()

//   const paths = products.map((product: IProduct) => ({
//     params: { id: product._id },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

export default Product
