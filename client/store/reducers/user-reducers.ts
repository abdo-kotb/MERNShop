import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  getUserProfile,
  login,
  register,
  updateUserProfile,
} from '../actions/user-actions'
import Cookies from 'js-cookie'

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
    getUserFromStorage: (
      state,
      { payload }: { type: string; payload?: string }
    ) => {
      if (typeof window === 'undefined') {
        state.userInfo = payload ?? null
      } else {
        state.userInfo = Cookies.get('userInfo')
          ? JSON.parse(Cookies.get('userInfo')!)
          : null
      }
    },
    setUserToStorage: (_, { payload }) => {
      Cookies.set('userInfo', JSON.stringify(payload))
    },
    logout: state => {
      if (typeof window !== 'undefined') Cookies.remove('userInfo')
      state.userInfo = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.userLogin,
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
        error: null,
      }))
      .addCase(login.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})

export const userRegisterReducer = createSlice({
  name: 'userRegister',
  initialState: loginInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.userRegister,
        }
      })
      .addCase(register.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(register.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        userInfo: payload,
        error: null,
      }))
      .addCase(register.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})

export const userDetailsReducer = createSlice({
  name: 'userDetails',
  initialState: { ...loginInitialState, updated: false },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.userDetails,
        }
      })
      .addCase(getUserProfile.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(getUserProfile.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        userInfo: payload,
      }))
      .addCase(getUserProfile.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
      .addCase(updateUserProfile.pending, state => ({
        ...state,
        loading: true,
        updated: false,
      }))
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        updated: true,
        userInfo: payload,
        error: null,
      }))
      .addCase(updateUserProfile.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})

export const { logout, setUserToStorage, getUserFromStorage } =
  userLoginReducer.actions
