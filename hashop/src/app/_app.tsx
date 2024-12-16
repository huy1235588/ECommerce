'use client'
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
