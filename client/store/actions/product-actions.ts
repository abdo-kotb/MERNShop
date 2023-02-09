import IProduct from '@/interfaces/Product'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getAllProducts = createAsyncThunk(
  'getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { products },
      } = await axios.get(`${process.env.API_ROOT}/products`)

      return products
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const getProductDetails = createAsyncThunk(
  'getProduct',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const {
        data: { product },
      } = await axios.get(`${process.env.API_ROOT}/products/${id}`)

      return product
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'deleteProduct',
  async (
    id: string,
    {
      rejectWithValue,
      getState,
    }: {
      rejectWithValue: any
      getState: () => any
    }
  ) => {
    try {
      const { userInfo } = getState().userLogin

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`${process.env.API_ROOT}/products/${id}`, config)
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'createProduct',
  async (
    _,
    {
      rejectWithValue,
      getState,
    }: {
      rejectWithValue: any
      getState: () => any
    }
  ) => {
    try {
      const { userInfo } = getState().userLogin

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data: product } = await axios.post(
        `${process.env.API_ROOT}/products`,
        {},
        config
      )

      return product
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'updateProduct',
  async (
    product: IProduct,
    {
      rejectWithValue,
      getState,
    }: {
      rejectWithValue: any
      getState: () => any
    }
  ) => {
    try {
      const { userInfo } = getState().userLogin

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data: updatedProduct } = await axios.put(
        `${process.env.API_ROOT}/products/${product._id}`,
        product,
        config
      )

      return updatedProduct
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
