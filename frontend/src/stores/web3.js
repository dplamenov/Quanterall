import { createSlice } from '@reduxjs/toolkit'

export const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    contracts: {}
  },
  reducers: {
    connect: (state, action) => {
      state.provider = action.payload.provider;
      state.signer = action.payload.signer;
      state.account = action.payload.account;
    },
    loadContracts: (state, action) => {
      state.contracts = action.payload.contracts;
    }
  }
})

export const { connect, loadContracts } = web3Slice.actions
