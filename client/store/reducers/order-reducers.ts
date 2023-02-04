import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { createOrder } from '../actions/order-actions'

interface OrderState {
  loading: boolean
  success: boolean
  order: any
  error: null | string
}

const orderInirialState: OrderState = {
  loading: false,
  success: false,
  order: null,
  error: null,
}

export const orderCreateReducer = createSlice({
  name: 'createOrder',
  initialState: orderInirialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.createOrder,
        }
      })
      .addCase(createOrder.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(createOrder.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        success: true,
        order: payload,
        error: null,
      }))
      .addCase(createOrder.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})
