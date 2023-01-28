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
  extraReducers: {
    [getAllProducts.pending as any]: state => {
      console.log('ACTION PENDING')
      return {
        ...state,
        loading: true,
      }
    },
    [getAllProducts.fulfilled as any]: (state, action) => {
      return {
        ...state,
        loading: false,
        products: action.payload,
      }
    },
    [getAllProducts.rejected as any]: (state, action) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    },
    [HYDRATE]: (_, action) => {
      return {
        ...action.payload.products,
      }
    },
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
  extraReducers: {
    [getProductDetails.pending as any]: state => {
      console.log('ACTION PENDING')
      return {
        ...state,
        loading: true,
      }
    },
    [getProductDetails.fulfilled as any]: (state, action) => {
      console.log('ACTION FULFILLED')
      return {
        ...state,
        loading: false,
        product: action.payload,
      }
    },
    [getProductDetails.rejected as any]: (state, action) => {
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    },
    [HYDRATE]: (_, action) => {
      console.log(action)
      return {
        ...action.payload.product,
      }
    },
  },
})
export { getAllProducts, getProductDetails }
