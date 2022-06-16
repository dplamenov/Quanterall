import { createSlice } from '@reduxjs/toolkit'

export const web3Slice = createSlice({
  name: 'web3',
  initialState: {},
  reducers: {
    connect: (state, action) => {
      state.provider = action.payload.provider;
      state.signer = action.payload.signer;
      state.account = action.payload.account;
    }
  }
})

export const { connect } = web3Slice.actions
