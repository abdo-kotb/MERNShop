import IProduct from '@/interfaces/Product'
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getTopProducts,
  updateProduct,
} from '../actions/product-actions'

interface CommonState {
  loading: boolean
  error: null | string
}

interface AllProductsType extends CommonState {
  products: IProduct[]
  pagesCount: number
  page: number
}

const allProductsState: AllProductsType = {
  loading: false,
  products: [],
  error: null,
  pagesCount: 0,
  page: 1,
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
          products: action.payload.products,
          pagesCount: action.payload.pages,
          page: action.payload.page,
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
  updated: boolean
  loadingUpdate: boolean
  errorUpdate: null | string
}

const productInitialState: ProductStateType = {
  loading: false,
  product: {} as IProduct,
  error: null,
  updated: false,
  loadingUpdate: false,
  errorUpdate: null,
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
      .addCase(updateProduct.pending, state => {
        return {
          ...state,
          loadingUpdate: true,
          updated: false,
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        return {
          ...state,
          loadingUpdate: false,
          product: action.payload,
          updated: true,
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        return {
          ...state,
          errorUpdate: action.payload as string,
          loadingUpdate: false,
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

export const productCreateReducer = createSlice({
  name: 'createProduct',
  initialState: productInitialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.createProduct,
        }
      })
      .addCase(createProduct.pending, state => {
        return {
          ...state,
          loading: true,
        }
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          product: action.payload,
          error: null,
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})

export const productReviewCreateReducer = createSlice({
  name: 'createReview',
  initialState: { loading: false, success: false, error: '' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.createReview,
        }
      })
      .addCase(createProductReview.pending, state => {
        return {
          ...state,
          loading: true,
          success: false,
        }
      })
      .addCase(createProductReview.fulfilled, state => {
        return {
          ...state,
          loading: false,
          success: true,
          error: '',
        }
      })
      .addCase(createProductReview.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})

interface TopProducts extends CommonState {
  products: IProduct[]
}

const topProductsState: TopProducts = {
  loading: false,
  error: null,
  products: [],
}

export const topProductsReducer = createSlice({
  name: 'topProducts',
  initialState: topProductsState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.topProducts,
        }
      })
      .addCase(getTopProducts.pending, state => {
        return {
          ...state,
          loading: true,
        }
      })
      .addCase(getTopProducts.fulfilled, (state, { payload }) => {
        return {
          ...state,
          loading: false,
          products: payload,
          error: '',
        }
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
          loading: false,
        }
      })
  },
})
