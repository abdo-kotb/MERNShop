import FormContainer from '@/components/form-container'
import Loader from '@/components/loader'
import Message from '@/components/message'
import { getUser, updateUser } from '@/store/actions/user-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const EditUser = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const userId = router.query.id as string
  const {
    userInfo,
    loadingInfo,
    errorInfo,
    updated,
    loadingUpdate,
    errorUpdate: reqError,
  } = useSelector((state: AppState) => state.userDetails)

  useEffect(() => {
    if (updated) {
      router.push('/admin/users-list')
      return
    }

    if (!userInfo?.name || userInfo?._id !== userId) {
      dispatch(getUser({ id: userId }) as unknown as AnyAction)
    } else {
      setName(userInfo.name)
      setEmail(userInfo.email)
      setIsAdmin(userInfo.isAdmin)
    }
  }, [userId, userInfo, dispatch, updated, router])

  useEffect(() => {
    if (reqError) setError(reqError)
  }, [reqError])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(
      updateUser({ _id: userId, name, email, isAdmin }) as unknown as AnyAction
    )
  }

  return (
    <>
      <Head>
        <title>Edit User | MERNShop</title>
      </Head>

      <Link href="/admin/users-list" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {updated && (
          <Message variant="successs">User updated succcessfully</Message>
        )}
        {loadingInfo ? (
          <Loader />
        ) : errorInfo ? (
          <Message variant="danger">{errorInfo}</Message>
        ) : (
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
            <Form.Group className="mb-4" controlId="is-admin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={e => {
                  setIsAdmin(e.target.checked)
                }}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default EditUser

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ req }) => {
      if (req.cookies.userInfo)
        store.dispatch(getUserFromStorage(JSON.parse(req.cookies.userInfo!)))

      const { userInfo } = store.getState().userLogin

      if (!userInfo?.isAdmin) {
        return {
          notFound: true,
        }
      }

      return { props: {} }
    }
)
