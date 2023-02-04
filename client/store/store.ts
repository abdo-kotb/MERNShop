import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import { cartReducer } from './reducers/cart-reducers'
import {
  orderCreateReducer,
  orderDetailsReducer,
} from './reducers/order-reducers'
import {
  productsReducer,
  productDetailsReducer,
} from './reducers/product-reducers'
import {
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
} from './reducers/user-reducers'

const reducer = combineReducers({
  [productsReducer.name]: productsReducer.reducer,
  [productDetailsReducer.name]: productDetailsReducer.reducer,
  [cartReducer.name]: cartReducer.reducer,
  [userLoginReducer.name]: userLoginReducer.reducer,
  [userRegisterReducer.name]: userRegisterReducer.reducer,
  [userDetailsReducer.name]: userDetailsReducer.reducer,
  [orderCreateReducer.name]: orderCreateReducer.reducer,
  [orderDetailsReducer.name]: orderDetailsReducer.reducer,
})

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
})

const makeStore = () => store

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
})
