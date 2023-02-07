import Loader from '@/components/loader'
import Message from '@/components/message'
import {
  getUserOrders,
  getUserProfile,
  updateUserProfile,
} from '@/store/actions/user-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnyAction } from '@reduxjs/toolkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Profile = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const {
    loadingInfo,
    errorInfo: reqError,
    userInfo: user,
    updated,
    orders,
    loadingOrders,
    errorOrders,
  } = useSelector((state: AppState) => state.userDetails)
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
      return
    }
    if (!user?.name) {
      dispatch(getUserProfile({ id: 'profile' }) as unknown as AnyAction)
      dispatch(getUserOrders() as unknown as AnyAction)
    } else {
      setName(user.name)
      setEmail(user.email)
    }
  }, [router, dispatch, user, userInfo])

  useEffect(() => {
    if (reqError) setError(reqError)
  }, [reqError])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) setError('Passwords do not match')
    else
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password,
        }) as unknown as AnyAction
      )
  }

  useEffect(() => {
    if (!updated) return
    setSuccess('Updated Successfully')
    const alertSuccess = setTimeout(() => setSuccess(''), 3000)
    return () => clearTimeout(alertSuccess)
  }, [updated])

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}
        {loadingInfo && <Loader />}
        <Form onSubmit={submitHandler} className="mb-3">
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                if (error) setError(null)
              }}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.careatedAt).toLocaleDateString()}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      new Date(order.paidAt).toLocaleDateString()
                    ) : (
                      <FontAwesomeIcon icon={faTimes} color="red" />
                    )}
                  </td>
                  <td>
                    {order.isDeliveredAt ? (
                      new Date(order.deliveredAt).toLocaleDateString()
                    ) : (
                      <FontAwesomeIcon icon={faTimes} color="red" />
                    )}
                  </td>
                  <td>
                    <Link href={`/order/${encodeURIComponent(order._id)}`}>
                      <Button
                        className="btn-sm"
                        variant={index % 2 === 0 ? 'light' : 'dark'}
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
      </Col>
    </Row>
  )
}

export default Profile

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo)))
      const { userInfo } = store.getState().userLogin

      if (!userInfo) {
        return {
          redirect: { destination: '/login', permanent: false },
        }
      }

      return {
        props: {},
      }
    }
)
