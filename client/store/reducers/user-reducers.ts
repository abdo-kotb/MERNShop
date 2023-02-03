import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { login } from '../actions/user-actions'

interface LoginInitialState {
  loading: boolean
  userInfo: any
  error: string | null
}

const loginInitialState: LoginInitialState = {
  loading: false,
  userInfo: null,
  error: null,
}

export const userLoginReducer = createSlice({
  name: 'userLogin',
  initialState: loginInitialState,
  reducers: {
    getUserFromStorage: state => {
      if (typeof window !== 'undefined' && localStorage.getItem('userInfo'))
        state.userInfo = JSON.parse(localStorage.getItem('userInfo')!)
    },
    setUserToStorage: (_, { payload }) => {
      if (typeof window !== 'undefined')
        localStorage.setItem('userInfo', JSON.stringify(payload))
    },
  },
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.user,
        }
      })
      .addCase(login.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(login.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        userInfo: payload,
      }))
      .addCase(login.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})

export const { getUserFromStorage, setUserToStorage } = userLoginReducer.actions
