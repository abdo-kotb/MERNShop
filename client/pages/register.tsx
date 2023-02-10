import FormContainer from '@/components/form-container'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { register } from '@/store/actions/user-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const {
    loading,
    error: reqError,
    userInfo,
  } = useSelector((state: AppState) => state.userRegister)

  const { redirect } = router.query

  useEffect(() => {
    if (userInfo) router.push(`/${redirect ?? ''}`)
  }, [userInfo, router, redirect])

  useEffect(() => {
    if (reqError) setError(reqError)
  }, [reqError])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) setError('Passwords do not match')
    else dispatch(register({ name, email, password }) as unknown as AnyAction)
  }

  return (
    <>
      <Head>
        <title>Register | MERNShop</title>
      </Head>
      <FormContainer>
        <h1>Sign Up</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
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
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an account?{' '}
            <Link href={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  )
}

export default Register

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req, query }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      const { userInfo } = store.getState().userLogin

      if (userInfo && query.redirect) {
        return {
          redirect: { destination: `/${query.redirect}`, permanent: false },
        }
      }

      return { props: {} }
    }
)
