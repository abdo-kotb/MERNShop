import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  createOrder,
  getOrderDetails,
  payOrder,
} from '../actions/order-actions'

interface CreateOrderState {
  loading: boolean
  success: boolean
  order: any
  error: null | string
}

const createOrderInitialState: CreateOrderState = {
  loading: false,
  success: false,
  order: null,
  error: null,
}

export const orderCreateReducer = createSlice({
  name: 'createOrder',
  initialState: createOrderInitialState,
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

interface OrderState {
  order: any
  loading: boolean
  error: string | null
  success: boolean
  processingPay: boolean
}

const orderInitialState: OrderState = {
  order: null,
  loading: false,
  error: null,
  success: false,
  processingPay: false,
}

export const orderDetailsReducer = createSlice({
  name: 'orderDetails',
  initialState: orderInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.orderDetails,
        }
      })
      .addCase(getOrderDetails.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(getOrderDetails.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        order: payload,
        error: null,
        success: false,
      }))
      .addCase(getOrderDetails.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
      .addCase(payOrder.pending, state => ({
        ...state,
        processingPay: true,
      }))
      .addCase(payOrder.fulfilled, state => ({
        ...state,
        processingPay: false,
        error: null,
        success: true,
      }))
      .addCase(payOrder.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})
