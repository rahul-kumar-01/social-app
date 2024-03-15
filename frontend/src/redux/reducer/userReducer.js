import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentUser : {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser : (state,action) => {
        console.log("asdfasdf",action.payload)
        state.currentUser = action.payload;
        console.log("user",state.currentUser)
    },
    removeCurrentuser : (state,action) => {
        state.currentUser = {};
    }
  }
})

export const { setCurrentUser , removeCurrentuser } = userSlice.actions
export default userSlice.reducer