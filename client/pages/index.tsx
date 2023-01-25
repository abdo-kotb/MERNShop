import { FC } from 'react'
import Head from 'next/head'
import Container from 'react-bootstrap/Container'

import products, { ProductsIF } from '@/products'
import { Row, Col } from 'react-bootstrap'
import Product from '@/components/product'

const Home: FC<{ products: ProductsIF[] }> = ({ products }) => {
  return (
    <>
      <Head>
        <title>MERNShop</title>
      </Head>
      <main className="py-3">
        <Container>
          <h1>Latest Products</h1>
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </>
  )
}

export default Home

export function getStaticProps() {
  return {
    props: {
      products,
    },
  }
}
