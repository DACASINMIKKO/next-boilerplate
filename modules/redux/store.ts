import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;


const rootReducer = combineReducers({
    // [requestSlice.name]: requestSlice.reducer,
    [authSlice.name]: authSlice.reducer,
});

const createNoopStorage = () => ({
    getItem(_key: string) {
        return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
        return Promise.resolve(value);
    },
    removeItem(_key: string) {
        return Promise.resolve();
    },
});

const persistConfig = {
    key: '_nextjs',
    storage: typeof window !== 'undefined' ? new CookieStorage(Cookies) : createNoopStorage()
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
});

const persistor = persistStore(store);

const { dispatch } = store;

export { store, persistor, dispatch, };
