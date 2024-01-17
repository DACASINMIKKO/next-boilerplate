'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import ProgressSpinner from '../../components/progress-spinner';

const AuthReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<ProgressSpinner />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default AuthReduxProvider