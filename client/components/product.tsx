import { FC } from 'react'

import Link from 'next/link'
import Card from 'react-bootstrap/Card'

import IProduct from '@/interfaces/Product'

import Rating from './rating'

interface IProps {
  product: IProduct
}

const Product: FC<IProps> = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link href={`/product/${encodeURIComponent(product._id)}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link href={`/product/${encodeURIComponent(product._id)}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
