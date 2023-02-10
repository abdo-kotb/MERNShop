import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { AppState, wrapper } from '@/store/store'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'

import Rating from '@/components/rating'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { useRouter } from 'next/router'
import { addToCart } from '@/store/actions/cart-actions'
import {
  createProductReview,
  getProductDetails,
} from '@/store/actions/product-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import Review from '@/interfaces/Review'
import Head from 'next/head'

const Product = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const router = useRouter()
  const productId = router.query.id as string
  const { product, loading, error } = useSelector(
    (state: AppState) => state.product
  )
  const {
    success,
    loading: reviewLoading,
    error: reviewError,
  } = useSelector((state: AppState) => state.createReview)
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  useMemo(() => {
    if (success) {
      setRating(0)
      setComment('')
    }
  }, [success])

  useEffect(() => {
    dispatch(getProductDetails({ id: productId }) as unknown as AnyAction)
  }, [productId, dispatch, success])

  const addToCartHandler = () => {
    dispatch(addToCart({ id: productId, qty }) as unknown as AnyAction)
    router.push('/cart')
  }

  const reviewSubmitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(
      createProductReview({
        productId,
        review: {
          rating,
          comment,
        } as Review,
      }) as unknown as AnyAction
    )
  }

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Link className="btn btn-light my-3" href="/">
        Go back
      </Link>
      {loading || !product.name ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6} className="position-relative">
              <Image
                src={product.image.replace('\\', '/')}
                alt={product.name}
                fill
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating ?? 0}
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
                      className="w-100"
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
          <Row className="mt-4">
            <Col md={6}>
              <h2>Reviews</h2>
              {!product.reviews?.length && <Message>No reviews yet</Message>}
              <ListGroup variant="flush">
                {product.reviews?.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} text={''} />
                    <p>{new Date(review.createdAt).toLocaleString()}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {reviewError && (
                    <Message variant="danger">{reviewError}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={reviewSubmitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={e => setRating(+e.target.value)}
                          placeholder="Select..."
                        >
                          <option disabled={Boolean(rating)} value="">
                            Select...
                          </option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary" className="mt-3">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link href="/login">Sign in</Link> to write a
                      review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Product

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, query }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      store.dispatch(
        getProductDetails({ id: query.id as string }) as unknown as AnyAction
      )

      return { props: {} }
    }
)
