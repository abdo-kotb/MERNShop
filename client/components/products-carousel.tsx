import { useSelector } from 'react-redux'
import { AppState } from '@/store/store'

import { Carousel } from 'react-bootstrap'

import Loader from './loader'
import Message from './message'
import Image from 'next/image'
import { useRouter } from 'next/router'

const ProductsCarousel = () => {
  const router = useRouter()

  const { products, loading, error } = useSelector(
    (state: AppState) => state.topProducts
  )

  if (loading) return <Loader />

  if (error) return <Message variant="danger">{error}</Message>

  return (
    <Carousel pause="hover" className="bg-dark mb-5 mt-4">
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
