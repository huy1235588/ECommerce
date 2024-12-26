'use client'
import { Provider } from 'react-redux';
import store from '@/store/store';
import GlobalProvider from '@/context/GlobalProvider';

export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            <GlobalProvider>
                {children}
            </GlobalProvider>
        </Provider>
    );
}
