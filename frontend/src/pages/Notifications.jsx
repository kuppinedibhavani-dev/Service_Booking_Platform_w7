import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page container">
      <h2>My Notifications</h2>

      {notifications.length === 0 ? (
        <div className="card">
          <p>No notifications found</p>
        </div>
      ) : (
        notifications.map((note) => (
          <div className="card" key={note._id}>
            <h3>{note.type}</h3>
            <p>{note.message}</p>
            <p>
              Status:{" "}
              <strong>
                {note.isRead ? "Read" : "Unread"}
              </strong>
            </p>

            {!note.isRead && (
              <button
                onClick={() => markRead(note._id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;