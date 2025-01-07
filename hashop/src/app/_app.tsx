'use client'

import { Provider } from 'react-redux';
import store from '@/store/store';
import GlobalProvider from '@/context/GlobalProvider';
import Notification from '@/components/common/notification ';
import { useNotification } from '@/context/NotificationContext';
import CheckAuth from '@/components/auth/checkAuth';
import '@/libs/i18n';

export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { notificationState, notificationDispatch } = useNotification();

    return (
        <Provider store={store}>
            <GlobalProvider>
                <CheckAuth>
                    {children}
                </CheckAuth>

                {notificationState.notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                        duration={notification.duration}
                        onClose={() => [
                            notificationDispatch({
                                type: 'REMOVE_NOTIFICATION',
                                payload: notification.id
                            })
                        ]} // Đóng thông báo
                    />
                ))}

            </GlobalProvider>
        </Provider>
    );
}
