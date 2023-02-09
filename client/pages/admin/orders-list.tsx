import Loader from '@/components/loader'
import Message from '@/components/message'
import { getAllOrders } from '@/store/actions/order-actions'
import { getUserFromStorage, logout } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnyAction } from '@reduxjs/toolkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const OrdersList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector(
    (state: AppState) => state.listAllOrders
  )
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  useEffect(() => {
    if (!userInfo) router.replace('/login')
  }, [router, userInfo])

  useEffect(() => {
    dispatch(getAllOrders() as unknown as AnyAction)
  }, [dispatch])

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt && new Date(order.paidAt).toLocaleDateString()
                  ) : (
                    <FontAwesomeIcon icon={faTimes} color="red" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt &&
                    new Date(order.deliveredAt).toLocaleDateString()
                  ) : (
                    <FontAwesomeIcon icon={faTimes} color="red" />
                  )}
                </td>
                <td>
                  <Link href={`/order/${encodeURIComponent(order._id)}`}>
                    <Button
                      variant={index % 2 === 0 ? 'light' : 'dark'}
                      className="btn-sm"
                    >
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrdersList

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
