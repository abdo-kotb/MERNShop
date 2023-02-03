import IProduct from '@/interfaces/Product'
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { getAllProducts, getProductDetails } from '../actions/product-actions'

interface CommonState {
  loading: boolean
  error: null | string
}

interface AllProductsType extends CommonState {
  products: IProduct[]
}

const allProductsState: AllProductsType = {
  loading: false,
  products: [],
  error: null,
}

export const productsReducer = createSlice({
  name: 'products',
  initialState: allProductsState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.products,
        }
      })
      .addCase(getAllProducts.pending, state => {
        return {
          ...state,
          loading: true,
        }
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          products: action.payload,
        }
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})

interface ProductStateType extends CommonState {
  product: IProduct
}

const productInitialState: ProductStateType = {
  loading: false,
  product: {} as IProduct,
  error: null,
}

export const productDetailsReducer = createSlice({
  name: 'product',
  initialState: productInitialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.product,
        }
      })
      .addCase(getProductDetails.pending, state => {
        return {
          ...state,
          loading: true,
        }
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          product: action.payload,
        }
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})
