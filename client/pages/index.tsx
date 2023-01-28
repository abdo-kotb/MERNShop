import { FC } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'

import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import IProduct from '@/interfaces/Product'
import { getAllProducts } from '@/store/reducers/product-reducers'

import { Row, Col } from 'react-bootstrap'

import Product from '@/components/product'
import Loader from '@/components/loader'
import Message from '@/components/message'

const Home = () => {
  const { products, loading, error } = useSelector(
    (state: AppState) => state.products
  )

  return (
    <>
      <Head>
        <title>MERNShop</title>
      </Head>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product: IProduct) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default Home

export const getStaticProps = wrapper.getStaticProps(store => async () => {
  await store.dispatch(getAllProducts() as unknown as AnyAction)

  return { props: {}, revalidate: true }
})
