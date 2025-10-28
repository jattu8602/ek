import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.loading = false
      console.log('Redux: User set', {
        email: action.payload?.email,
        role: action.payload?.role,
        id: action.payload?.id,
      })
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      console.log('Redux: User cleared')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    syncSession: (state, action) => {
      // Sync with server session data
      if (action.payload?.user) {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.loading = false
        console.log('Redux: Session synced from server', {
          email: action.payload.user?.email,
          role: action.payload.user?.role,
        })
      } else {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        console.log('Redux: No session found on server')
      }
    },
  },
})

export const { setUser, clearUser, setLoading, syncSession } = authSlice.actions
export default authSlice.reducer
