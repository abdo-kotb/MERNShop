import Head from 'next/head'
import { useSelector } from 'react-redux'

import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import IProduct from '@/interfaces/Product'

import { Row, Col } from 'react-bootstrap'

import Product from '@/components/product'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { getAllProducts } from '@/store/actions/product-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import Paginate from '@/components/paginate'
import { useRouter } from 'next/router'
import ProductsCarousel from '@/components/products-carousel'

const Home = () => {
  const router = useRouter()
  const { keyword } = router.query
  const { products, loading, error } = useSelector(
    (state: AppState) => state.products
  )

  return (
    <>
      {!keyword && (
        <>
          <h2>Top Rated Products</h2>
          <ProductsCarousel />
        </>
      )}
      <Head>
        <title>MERNShop</title>
      </Head>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product: IProduct) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate />
        </>
      )}
    </>
  )
}

export default Home

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, query }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      await store.dispatch(
        getAllProducts({
          keyword: query.keyword as string,
          pageNum: +query.page! || 1,
        }) as unknown as AnyAction
      )
      return { props: {} }
    }
)
