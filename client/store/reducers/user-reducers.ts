import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import {
  deleteUser,
  getUserOrders,
  getUser,
  getUsers,
  login,
  register,
  updateUserProfile,
  updateUser,
} from '../actions/user-actions'
import Cookies from 'js-cookie'
import User from '@/interfaces/user'

interface LoginInitialState {
  loading: boolean
  userInfo: User | null
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
      { payload }: { type: string; payload?: User }
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

interface UserDetails {
  userInfo: User | null
  loadingInfo: boolean
  errorInfo: string | null
  updated: boolean
  orders: any[]
  loadingOrders: boolean
  errorOrders: string | null
  loadingUpdate: boolean
  errorUpdate: string | null
}

const userDetailsState: UserDetails = {
  userInfo: null,
  loadingInfo: false,
  errorInfo: null,
  updated: false,
  orders: [],
  loadingOrders: false,
  errorOrders: null,
  loadingUpdate: false,
  errorUpdate: null,
}

export const userDetailsReducer = createSlice({
  name: 'userDetails',
  initialState: userDetailsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.userDetails,
        }
      })
      .addCase(getUser.pending, state => ({
        ...state,
        loadingInfo: true,
      }))
      .addCase(getUser.fulfilled, (state, { payload }) => ({
        ...state,
        loadingInfo: false,
        userInfo: payload,
        errorInfo: null,
      }))
      .addCase(getUser.rejected, (state, { payload }) => ({
        ...state,
        loadingInfo: false,
        errorInfo: payload as string,
      }))
      .addCase(getUserOrders.pending, state => ({
        ...state,
        loadingOrders: true,
      }))
      .addCase(getUserOrders.fulfilled, (state, { payload }) => ({
        ...state,
        loadingOrders: false,
        orders: payload,
        errorOrders: null,
      }))
      .addCase(getUserOrders.rejected, (state, { payload }) => ({
        ...state,
        loadingOrders: false,
        errorOrders: payload as string,
      }))
      .addCase(updateUserProfile.pending, state => ({
        ...state,
        loadingInfo: true,
        updated: false,
      }))
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => ({
        ...state,
        loadingInfo: false,
        updated: true,
        userInfo: payload,
        errorInfo: null,
      }))
      .addCase(updateUserProfile.rejected, (state, { payload }) => ({
        ...state,
        loadingInfo: false,
        errorInfo: payload as string,
      }))
      .addCase(updateUser.pending, state => ({
        ...state,
        loadingUpdate: true,
        updated: false,
      }))
      .addCase(updateUser.fulfilled, (state, { payload }) => ({
        ...state,
        loadingUpdate: false,
        updated: true,
        userInfo: payload,
        errorUpdate: null,
      }))
      .addCase(updateUser.rejected, (state, { payload }) => ({
        ...state,
        loadingUpdate: false,
        errorUpdate: payload as string,
      }))
  },
})

interface UsersList {
  loading: boolean
  users: User[]
  error: null | string
}

const usersListState: UsersList = {
  loading: false,
  users: [],
  error: null,
}

export const usersListReducer = createSlice({
  name: 'usersList',
  initialState: usersListState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.usersList,
        }
      })
      .addCase(getUsers.pending, state => ({
        ...state,
        loading: true,
      }))
      .addCase(getUsers.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        users: payload,
        error: null,
      }))
      .addCase(getUsers.rejected, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload as string,
      }))
  },
})

export const userDeleteReducer = createSlice({
  name: 'deleteUser',
  initialState: { success: false },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        return {
          ...state,
          ...action.payload.usersList,
        }
      })
      .addCase(deleteUser.pending, state => ({
        ...state,
        success: false,
      }))
      .addCase(deleteUser.fulfilled, state => ({
        ...state,
        success: true,
        error: null,
      }))
      .addCase(deleteUser.rejected, (state, { payload }) => ({
        ...state,
        success: false,
        error: payload as string,
      }))
  },
})

export const { logout, setUserToStorage, getUserFromStorage } =
  userLoginReducer.actions
