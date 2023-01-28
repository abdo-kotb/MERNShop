import { configureStore } from '@reduxjs/toolkit'
import { Context, createWrapper } from 'next-redux-wrapper'
import {
  productsReducer,
  productDetailsReducer,
} from './reducers/product-reducers'

const store = configureStore({
  reducer: {
    [productsReducer.name]: productsReducer.reducer,
    [productDetailsReducer.name]: productDetailsReducer.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})
export type AppStore = typeof store
export type AppState = ReturnType<AppStore['getState']>

const makeStore = (context: Context) => store

export const wrapper = createWrapper(makeStore, { debug: true })
