import Order from '@/interfaces/order'
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  createOrder,
  deliverOrder,
  getAllOrders,
  getOrderDetails,
  payOrder,
} from '../actions/order-actions'

interface CreateOrderState {
  loading: boolean
  success: boolean
  order: Order | null
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
  order: Order | null
  loading: boolean
  error: string | null
  success: boolean
  processingPay: boolean
  delivered: boolean
  loadingDelivered: boolean
  errorDelivered: null | string
}

const orderInitialState: OrderState = {
  order: null,
  loading: false,
  error: null,
  success: false,
  processingPay: false,
  delivered: false,
  loadingDelivered: false,
  errorDelivered: null,
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
        success: false,
        delivered: false,
      }))
      .addCase(getOrderDetails.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        order: payload,
        error: null,
        delivered: false,
      }))
      .addCase(getOrderDetails.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
        delivered: false,
      }))
      .addCase(payOrder.pending, state => ({
        ...state,
        processingPay: true,
        success: false,
        delivered: false,
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
      .addCase(deliverOrder.pending, state => ({
        ...state,
        delivered: false,
        loadingDelivered: true,
      }))
      .addCase(deliverOrder.fulfilled, state => ({
        ...state,
        loadingDelivered: false,
        errorDelivered: null,
        delivered: true,
      }))
      .addCase(deliverOrder.rejected, (state, { payload }) => ({
        ...state,
        loadingDelivered: false,
        errorDelivered: payload as string,
      }))
  },
})

interface AllOrders {
  orders: Order[]
  loading: boolean
  error: string | null
}

const allOrdersState: AllOrders = {
  orders: [],
  loading: false,
  error: null,
}

export const listAllOrders = createSlice({
  name: 'listAllOrders',
  initialState: allOrdersState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.listAllOrders,
        }
      })
      .addCase(getAllOrders.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(getAllOrders.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        orders: payload,
        error: null,
      }))
      .addCase(getAllOrders.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})
