import FormContainer from '@/components/form-container'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { login } from '@/store/actions/user-actions'
import { getUserFromStorage, logout } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const {
    loading,
    error: reqError,
    userInfo,
  } = useSelector((state: AppState) => state.userLogin)

  const { redirect } = router.query

  useEffect(() => {
    if (userInfo) router.replace(`/${redirect ?? ''}`)
  }, [userInfo, router, redirect])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(login({ email, password }) as unknown as AnyAction)
    if (!userInfo) setError(reqError)
  }

  return (
    <>
      <Head>
        <title>Login | MERNShop</title>
      </Head>
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler} className="mb-3">
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
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer?{' '}
            <Link
              href={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Register
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  )
}

export default Login

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, query }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))
      else store.dispatch(logout())

      const { userInfo } = store.getState().userLogin

      if (userInfo && query.redirect) {
        return {
          redirect: { destination: `/${query.redirect}`, permanent: false },
        }
      }

      return { props: {} }
    }
)
