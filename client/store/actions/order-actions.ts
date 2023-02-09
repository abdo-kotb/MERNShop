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

export const getOrderDetails = createAsyncThunk(
  'getOrderDetails',
  async (
    orderId: string,
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

      const { data: order } = await axios.get(
        `${process.env.API_ROOT}/orders/${orderId}`,
        config
      )

      return order
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const payOrder = createAsyncThunk(
  'payOrder',
  async (
    {
      orderId,
      paymentResult,
    }: {
      orderId: string
      paymentResult: any
    },
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

      await axios.put(
        `${process.env.API_ROOT}/orders/${orderId}/pay`,
        paymentResult,
        config
      )
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const deliverOrder = createAsyncThunk(
  'deliverOrder',
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

      await axios.put(
        `${process.env.API_ROOT}/orders/${id}/deliver`,
        {},
        config
      )
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const getAllOrders = createAsyncThunk(
  'getAllOrders',
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

      const { data: orders } = await axios.get(
        `${process.env.API_ROOT}/orders`,
        config
      )

      return orders
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
