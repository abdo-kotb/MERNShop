import Loader from '@/components/loader'
import Message from '@/components/message'
import User from '@/interfaces/user'
import { deleteUser, getUsers } from '@/store/actions/user-actions'
import { getUserFromStorage, logout } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import {
  faCheck,
  faEdit,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnyAction } from '@reduxjs/toolkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const UsersList = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector(
    (state: AppState) => state.usersList
  )
  const { userInfo } = useSelector((state: AppState) => state.userLogin)

  useEffect(() => {
    if (!userInfo) router.replace('/login')
  }, [router, userInfo])

  useEffect(() => {
    dispatch(getUsers() as unknown as AnyAction)
  }, [dispatch])

  const deleteHandler = async (id: User['_id']) => {
    await dispatch(deleteUser(id) as unknown as AnyAction)
    await dispatch(getUsers() as unknown as AnyAction)
  }

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{<a href={`mailto:${user.email}`}>{user.email}</a>}</td>
                <td>
                  {user.isAdmin ? (
                    <FontAwesomeIcon icon={faCheck} color="green" />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} color="red" />
                  )}
                </td>
                <td className="d-flex justify-content-around">
                  <Link
                    href={`/admin/user/${encodeURIComponent(user._id)}/edit`}
                  >
                    <Button variant="light" className="btn-sm">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UsersList

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
