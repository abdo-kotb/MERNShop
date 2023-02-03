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
