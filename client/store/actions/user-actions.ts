import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { setUserToStorage } from '../reducers/user-reducers'
import { AppState } from '../store'

export const login = createAsyncThunk(
  'login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data: user } = await axios.post(
        `${process.env.API_ROOT}/users/login`,
        { email, password },
        config
      )

      dispatch(setUserToStorage(user))

      return user
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const register = createAsyncThunk(
  'signup',
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data: user } = await axios.post(
        `${process.env.API_ROOT}/users`,
        { name, email, password },
        config
      )

      dispatch(setUserToStorage(user))
      // @ts-ignore
      dispatch(login.fulfilled(user))

      return user
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)

export const getUserProfile = createAsyncThunk(
  'getUserProfile',
  async (
    { id }: { id: string },
    {
      rejectWithValue,
      getState,
    }: {
      rejectWithValue: any
      getState: () => any
    }
  ) => {
    try {
      const { userInfo } = getState().userLogin

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data: user } = await axios.put(
        `${process.env.API_ROOT}/users/${id}`,
        {},
        config
      )

      return user
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
