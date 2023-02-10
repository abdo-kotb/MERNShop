import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import { cartReducer } from './reducers/cart-reducers'
import {
  listAllOrders,
  orderCreateReducer,
  orderDetailsReducer,
} from './reducers/order-reducers'
import {
  productsReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productReviewCreateReducer,
  topProductsReducer,
} from './reducers/product-reducers'
import {
  userDeleteReducer,
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
  usersListReducer,
} from './reducers/user-reducers'

const reducer = combineReducers({
  [productsReducer.name]: productsReducer.reducer,
  [productDetailsReducer.name]: productDetailsReducer.reducer,
  [productDeleteReducer.name]: productDeleteReducer.reducer,
  [productCreateReducer.name]: productCreateReducer.reducer,
  [productReviewCreateReducer.name]: productReviewCreateReducer.reducer,
  [topProductsReducer.name]: topProductsReducer.reducer,
  [cartReducer.name]: cartReducer.reducer,
  [userLoginReducer.name]: userLoginReducer.reducer,
  [userRegisterReducer.name]: userRegisterReducer.reducer,
  [userDetailsReducer.name]: userDetailsReducer.reducer,
  [usersListReducer.name]: usersListReducer.reducer,
  [userDeleteReducer.name]: userDeleteReducer.reducer,
  [orderCreateReducer.name]: orderCreateReducer.reducer,
  [orderDetailsReducer.name]: orderDetailsReducer.reducer,
  [listAllOrders.name]: listAllOrders.reducer,
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
