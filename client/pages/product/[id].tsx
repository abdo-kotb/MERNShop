import products from '@/products'
import { GetStaticPaths } from 'next'

const Product = () => {
  return <div>Product</div>
}

export function getStaticProps(context) {
  console.log(context)

  return {
    props: {},
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = products.map(product => ({ params: { id: product._id } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export default Product
