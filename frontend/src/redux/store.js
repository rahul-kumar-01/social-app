import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducer/userReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'current_user',
    storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user : persistedReducer
  },
})

export const persistor = persistStore(store)


