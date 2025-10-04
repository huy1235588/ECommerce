'use client'

import { Provider } from 'react-redux';
import store from '@/store/store';
import GlobalProvider from '@/context/GlobalProvider';
import Notification from '@/components/common/notification';
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

                <div className="notification-container">
                    {notificationState.notifications.map((notification, index) => (
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
                            ]}
                            style={{ top: `${index * 80}px` }} // Đảm bảo các thông báo không đè lên nhau
                        />
                    ))}
                </div>
            </GlobalProvider>
        </Provider>
    );
}
