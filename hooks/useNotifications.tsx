import { Notification } from "types/Notification";
import { fetchRSR } from "utils/fetchRSR";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { API_URL } from "constants/env";
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
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: string) =>
    fetchRSR(
      `/api/user/${user.data.uid.toString()}/notifications?id=${id}`,
      user.session,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          setNotifications(res.data.attributes);
        }
        return res.ok;
      })
      .catch((err) => console.log(err));

  useEffect(() => {
    if (user) {
      const poll = setInterval(() => {
        fetchRSR(
          `${API_URL}/user/${user.data.uid.toString()}/notifications`,
          user.session
        )
          .then((res) => res.json())
          .then((body) => {
            // console.log(body.data.attributes.length, Date.now());
            if (body.error) {
              console.log(body.error);
            } else {
              setNotifications(body.data.attributes);
            }
          })
          .catch((err) => console.error(err));
      }, 5000);

      return () => clearInterval(poll);
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  removeNotification: (id: string) => void;
}

const useNotifications = () =>
  useContext(NotificationContext) as NotificationContextType;

export { NotificationProvider, useNotifications };
