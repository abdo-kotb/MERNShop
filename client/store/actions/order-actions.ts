import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const createOrder = createAsyncThunk(
  'createOrderThunk',
  async (
    order: any,
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

      const { data: createdOrder } = await axios.post(
        `${process.env.API_ROOT}/orders`,
        order,
        config
      )

      return createdOrder
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
