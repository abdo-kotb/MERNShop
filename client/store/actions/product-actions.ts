import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ProductTypes } from '@/types/action-types'

export const getAllProducts = createAsyncThunk(
  ProductTypes.GET_ALL_PRODUCTS,
  async (payload, { rejectWithValue }) => {
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
  ProductTypes.GET_PRODUCT,
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
