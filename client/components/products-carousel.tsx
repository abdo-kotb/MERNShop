import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { AppState } from '@/store/store'

import { Carousel } from 'react-bootstrap'

import { getTopProducts } from '@/store/actions/product-actions'
import Loader from './loader'
import Message from './message'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

const ProductsCarousel = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { products, loading, error } = useSelector(
    (state: AppState) => state.topProducts
  )

  useEffect(() => {
    dispatch(getTopProducts() as unknown as AnyAction)
  }, [dispatch])

  if (loading) return <Loader />

  if (error) return <Message variant="danger">{error}</Message>

  return (
    <Carousel pause="hover" className="bg-dark">
      {products.map(product => (
        <Carousel.Item
          className="pb-5"
          key={product._id}
          onClick={() => router.push(`/product/${product._id}`)}
        >
          <div
            className="position-relative p-4 my-5 mx-auto"
            style={{ height: 300, width: 300 }}
          >
            <Image
              className="rounded-circle mt-5"
              src={product.image}
              alt={product.name}
              fill
            />
          </div>
          <Carousel.Caption className="carousel-caption position-absolute top-0">
            <h2 className="text-white">
              {product.name} (${product.price})
            </h2>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductsCarousel
