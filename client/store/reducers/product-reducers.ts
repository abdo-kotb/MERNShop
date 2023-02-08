import IProduct from '@/interfaces/Product'
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  deleteProduct,
  getAllProducts,
  getProductDetails,
} from '../actions/product-actions'

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

interface ProductDelete {
  loading: boolean
  error: string | null
  success: boolean
}

const deleteProductState: ProductDelete = {
  loading: false,
  error: null,
  success: false,
}

export const productDeleteReducer = createSlice({
  name: 'deleteProduct',
  initialState: deleteProductState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.deleteProduct,
        }
      })
      .addCase(deleteProduct.pending, state => {
        return {
          ...state,
          loading: true,
          success: false,
        }
      })
      .addCase(deleteProduct.fulfilled, state => {
        return {
          ...state,
          loading: false,
          error: null,
          success: true,
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})
