import {configureStore, combineReducers} from '@reduxjs/toolkit'
import {web3Slice} from './web3'

export const store = configureStore({
  preloadedState: {},
  reducer: combineReducers({web3: web3Slice.reducer}),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})
