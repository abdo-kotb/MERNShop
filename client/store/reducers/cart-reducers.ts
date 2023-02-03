import CartItem from '@/interfaces/cart-item'
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { addToCart } from '../actions/cart-actions'

const initialState: { cartItems: CartItem[] } = {
  cartItems: [],
}

export const cartReducer = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getItemsFromStorage: state => {
      if (typeof window !== 'undefined' && localStorage.getItem('cartItems'))
        state.cartItems = JSON.parse(localStorage.getItem('cartItems')!)
    },
    setItemsToStorage: (_, { payload }) => {
      if (typeof window !== 'undefined')
        localStorage.setItem('cartItems', JSON.stringify(payload))
    },
    removeItemFromCart: (state, { payload }) => {
      const item = state.cartItems.findIndex(
        item => item.product === payload.id
      )
      state.cartItems.splice(item, 1)
      if (typeof window !== 'undefined')
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
  },
  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.cart,
        }
      })
      .addCase(addToCart.fulfilled, (_, action) => action.payload)
  },
})

export const { getItemsFromStorage, setItemsToStorage, removeItemFromCart } =
  cartReducer.actions
