import { Notification } from "types/Notification";
import { fetchRSR } from "utils/fetchRSR";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { API_URL, NOTIFICATIONS_DEBOUNCE_TIME } from "constants/env";
const NotificationContext = createContext({});

/**
 * TODO: improve this by using sockets instead of polling
 *
 *
 */
function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: string) =>
    fetchRSR(
      `${API_URL}/user/${user.data.uid.toString()}/notifications?id=${id}`,
      user.session,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          // eslint-disable-next-line no-console
          console.error(res.error);
        } else {
          setNotifications(res.data.attributes);
        }
        return res.ok;
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err.message, id));

  const removeAllNotification = () =>
    Promise.all(
      notifications.map((notification) => removeNotification(notification._id))
    );

  useEffect(() => {
    if (user) {
      const poll = setInterval(() => {
        fetchRSR(
          `${API_URL}/user/${user.data.uid.toString()}/notifications`,
          user.session
        )
          .then((res) => res.json())
          .then((body) => {
            setNotifications(body.data.attributes);
          })
          .catch((err) => {
            if (err.name === "TokenExpiredError") signOut();
            // eslint-disable-next-line no-console
            console.error(err.name);
          });
      }, NOTIFICATIONS_DEBOUNCE_TIME);

      return () => clearInterval(poll);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        removeNotification,
        removeAllNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

interface NotificationContextType {
  notifications: Notification[];
  // eslint-disable-next-line no-unused-vars
  setNotifications: (notifications: Notification[]) => void;
  // eslint-disable-next-line no-unused-vars
  removeNotification: (id: string) => void;
  removeAllNotification: () => void;
}

const useNotifications = () =>
  useContext(NotificationContext) as NotificationContextType;

export { NotificationProvider, useNotifications };
