import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { setUserToStorage } from '../reducers/user-reducers'

export const login = createAsyncThunk(
  'login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data: user } = await axios.post(
        '/users/login',
        { email, password },
        config
      )

      setUserToStorage(user)

      return user
    } catch (err: any) {
      return rejectWithValue(err.response?.data.message ?? err.message)
    }
  }
)
