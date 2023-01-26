import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'

import Rating from '@/components/rating'

import products, { ProductsIF } from '@/products'

interface IProps {
  product: ProductsIF
}

const Product: NextPage<IProps> = ({ product }) => {
  return (
    <>
      <Link className="btn btn-light my-3" href="/">
        Go back
      </Link>
      <Row>
        <Col md={6}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={510}
          />
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
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
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
              <ListGroup.Item>
                <Button
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
    </>
  )
}

export const getStaticProps: GetStaticProps = context => {
  const {
    params: { id },
  } = context as GetStaticPropsContext & { params: { id: string } }

  const product = products.find(product => id === product._id)

  return {
    props: {
      product,
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = products.map(product => ({ params: { id: product._id } }))

  return {
    paths,
    fallback: true,
  }
}

export default Product
