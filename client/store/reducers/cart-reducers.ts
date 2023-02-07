import CartItem from '@/interfaces/cart-item'
import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { HYDRATE } from 'next-redux-wrapper'
import { addToCart } from '../actions/cart-actions'

interface ShippingAddress {
  address: string
  city: string
  country: string
  postalCode: string
}

const initialState: {
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
} = {
  cartItems: [],
  shippingAddress: {
    address: '',
    city: '',
    country: '',
    postalCode: '',
  },
  paymentMethod: '',
}

export const cartReducer = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getItemsFromCookies: (
      state,
      { payload }: { type: string; payload?: CartItem[] }
    ) => {
      if (typeof window === 'undefined') {
        state.cartItems = payload as CartItem[]
      } else {
        state.cartItems = Cookies.get('cartItems')
          ? JSON.parse(Cookies.get('cartItems')!)
          : []
      }
    },
    saveItemsToCookies: (_, { payload }) => {
      Cookies.set('cartItems', JSON.stringify(payload))
    },
    removeItemFromCart: (state, { payload }) => {
      const item = state.cartItems.findIndex(
        item => item.product === payload.id
      )
      state.cartItems.splice(item, 1)
      if (typeof window !== 'undefined')
        Cookies.set('cartItems', JSON.stringify(state.cartItems))
    },
    saveShippingAddress: (state, { payload }) => {
      Cookies.set('shippingAddress', JSON.stringify(payload))
      state.shippingAddress = payload
    },
    getShippingAddressFromCookies: (
      state,
      { payload }: { type: string; payload?: ShippingAddress }
    ) => {
      if (typeof window === 'undefined') {
        state.shippingAddress = payload as ShippingAddress
      } else {
        state.shippingAddress = Cookies.get('shippingAddress')
          ? JSON.parse(Cookies.get('shippingAddress')!)
          : null
      }
    },
    savePaymentMethod: (state, { payload }) => {
      Cookies.set('paymentMethod', JSON.stringify(payload))
      state.paymentMethod = payload
    },
    getPaymentMethodFromCookies: (
      state,
      { payload }: { type: string; payload?: string }
    ) => {
      if (typeof window === 'undefined') {
        state.paymentMethod = payload as string
      } else {
        state.paymentMethod = Cookies.get('paymentMethod')
          ? JSON.parse(Cookies.get('paymentMethod')!)
          : null
      }
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

export const {
  getItemsFromCookies,
  saveItemsToCookies,
  removeItemFromCart,
  saveShippingAddress,
  getShippingAddressFromCookies,
  savePaymentMethod,
  getPaymentMethodFromCookies,
} = cartReducer.actions
