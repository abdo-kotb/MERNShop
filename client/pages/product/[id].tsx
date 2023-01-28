import { useState } from 'react'
import { useSelector } from 'react-redux'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import { AnyAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppState, wrapper } from '@/store/store'
import { getProductDetails } from '@/store/reducers/product-reducers'

import IProduct from '@/interfaces/Product'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'

import Rating from '@/components/rating'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { useRouter } from 'next/router'

const Product = () => {
  const [qty, setQty] = useState(0)

  const router = useRouter()
  const { product, loading, error } = useSelector(
    (state: AppState) => state.product
  )

  const addToCartHandler = () => {
    router.push({
      pathname: `/cart/${router.query.id}`,
      query: { qty },
    })
    console.log(router.query.id)
  }

  return (
    <>
      <Link className="btn btn-light my-3" href="/">
        Go back
      </Link>
      {loading ? (
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

export const getStaticProps = wrapper.getStaticProps(store => async context => {
  const {
    params: { id },
  } = context as GetStaticPropsContext & { params: { id: string } }

  await store.dispatch(getProductDetails({ id }) as unknown as AnyAction)

  return {
    props: {},
  }
})

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { products },
  } = await axios.get(`${process.env.API_ROOT}/products`)

  const paths = products.map((product: IProduct) => ({
    params: { id: product._id },
  }))

  return {
    paths,
    fallback: true,
  }
}

export default Product
