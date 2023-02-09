import FormContainer from '@/components/form-container'
import Loader from '@/components/loader'
import Message from '@/components/message'
import {
  getProductDetails,
  updateProduct,
} from '@/store/actions/product-actions'
import { getUserFromStorage } from '@/store/reducers/user-reducers'
import { AppState, wrapper } from '@/store/store'
import { AnyAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const EditProduct = () => {
  const [uploading, setUploading] = useState(false)
  const [price, setPrice] = useState(0)
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const productId = router.query.id as string
  const {
    loading,
    error: reqError,
    product,
    loadingUpdate,
    errorUpdate,
    updated,
  } = useSelector((state: AppState) => state.product)

  useEffect(() => {
    if (!product?.name || product?._id !== productId || updated) {
      dispatch(getProductDetails({ id: productId }) as unknown as AnyAction)
      if (updated) router.push('/admin/products-list')
    } else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [productId, product, dispatch, updated, router])

  useEffect(() => {
    if (reqError) setError(reqError)
    if (errorUpdate) setError(errorUpdate)
  }, [reqError, errorUpdate])

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }) as unknown as AnyAction
    )
  }

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post(
        `${process.env.API_ROOT}/upload`,
        formData,
        config
      )

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <>
      <Link href="/admin/products-list" className="btn btn-dark my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loading || loadingUpdate ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
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
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={e => {
                  setPrice(+e.target.value)
                  if (error) setError(null)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL or Upload Image"
                value={image}
                onChange={e => {
                  setImage(e.target.value)
                  if (error) setError(null)
                }}
              />
              <Form.Group controlId="formFile">
                <Form.Control onChange={uploadFileHandler} type="file" />
              </Form.Group>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group className="mb-4" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Brand"
                value={brand}
                onChange={e => {
                  setBrand(e.target.value)
                  if (error) setError(null)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product count in stock"
                value={countInStock}
                onChange={e => {
                  setCountInStock(+e.target.value)
                  if (error) setError(null)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={e => {
                  setCategory(e.target.value)
                  if (error) setError(null)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={e => {
                  setDescription(e.target.value)
                  if (error) setError(null)
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

export default EditProduct

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
