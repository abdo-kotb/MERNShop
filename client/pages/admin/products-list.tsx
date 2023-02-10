import Loader from '@/components/loader'
import Message from '@/components/message'
import Paginate from '@/components/paginate'
import IProduct from '@/interfaces/Product'
import User from '@/interfaces/user'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from '@/store/actions/product-actions'
import { getUserFromStorage, logout } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnyAction } from '@reduxjs/toolkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const ProductsList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector(
    (state: AppState) => state.products
  )
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state: AppState) => state.deleteProduct)
  const {
    loading: loadingCreate,
    error: errorCreate,
    product,
  } = useSelector((state: AppState) => state.createProduct)
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  useEffect(() => {
    if (!userInfo) router.replace('/login')
  }, [router, userInfo])

  useEffect(() => {
    if (product?._id) router.push(`/admin/product/${product._id}/edit`)
    else
      dispatch(
        getAllProducts({
          keyword: router.query.keyword as string,
          pageNum: +router.query.page! || 1,
        }) as unknown as AnyAction
      )
  }, [dispatch, successDelete, product, router])

  const deleteHandler = (id: IProduct['_id']) => {
    dispatch(deleteProduct(id) as unknown as AnyAction)
  }

  const createProductHandler = () => {
    dispatch(createProduct() as unknown as AnyAction)
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            Create Product <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Col>
      </Row>
      {(loadingDelete || loadingCreate) && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td className="d-flex justify-content-around">
                    <Link
                      href={`/admin/product/${encodeURIComponent(
                        product._id
                      )}/edit`}
                    >
                      <Button variant="light" className="btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate />
        </>
      )}
    </>
  )
}

export default ProductsList

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))
      else store.dispatch(logout())

      const { userInfo } = store.getState().userLogin

      if (!userInfo?.isAdmin) {
        return {
          notFound: true,
        }
      }

      return { props: {} }
    }
)
