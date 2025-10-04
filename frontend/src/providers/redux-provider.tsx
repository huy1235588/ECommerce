'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import Loading from '@/components/Loading';

interface ReduxProviderProps {
    children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={<Loading size={'lg'} centered variant='quantum' />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
