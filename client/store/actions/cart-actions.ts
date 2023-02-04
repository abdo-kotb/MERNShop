import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import CartItem from '@/interfaces/cart-item'
import {
  getItemsFromCookies,
  saveItemsToCookies,
} from '../reducers/cart-reducers'

export const addToCart = createAsyncThunk(
  'addItem',
  async (
    { id, qty }: { id: string; qty: number },
    {
      rejectWithValue,
      getState,
      dispatch,
    }: {
      rejectWithValue: any
      getState: () => any
      dispatch: (action: AnyAction) => any
    }
  ) => {
    try {
      const {
        data: { product },
      } = await axios.get(`${process.env.API_ROOT}/products/${id}`)

      dispatch(getItemsFromCookies())

      const cartItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      }
      const { cart } = getState()

      const existItem = cart.cartItems?.find(
        (item: CartItem) => item.product === cartItem.product
      )

      let newItems

      if (existItem)
        newItems = {
          ...cart,
          cartItems: cart.cartItems.map((item: CartItem) =>
            item.product === existItem.product ? { ...existItem, qty } : item
          ),
        }
      else
        newItems = {
          ...cart,
          cartItems: [...cart.cartItems, cartItem],
        }

      dispatch(saveItemsToCookies(newItems.cartItems))
      return newItems
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
