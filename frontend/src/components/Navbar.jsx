import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar({ toggleTheme, darkMode }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      const unread = res.data.filter(
        (note) => note.isRead === false
      );

      setCount(unread.length);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "18px 30px",
        background: "var(--nav-bg)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>

    
        <Link
          to="/"
          style={{
            color: "white",
            marginRight: "20px",
            fontSize: "20px",
            fontWeight: "bold"
          }}
        >
          ServiceHub
        </Link>

            <Link
  to="/register"
  style={{ color: "white", marginRight: "20px" }}
>
  Register
</Link>

<Link
  to="/login"
  style={{ color: "white", marginRight: "20px" }}
>
  Login
</Link>

        <Link
          to="/profile"
          style={{
            color: "white",
            marginRight: "20px"
          }}
        >
          Profile
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}
      >
        {/* Notification Icon with Badge */}
        <Link
          to="/notifications"
          style={{
            color: "white",
            fontSize: "22px",
            position: "relative"
          }}
        >
          <FaBell />

          {count > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: "12px"
              }}
            >
              {count}
            </span>
          )}
        </Link>

        {/* Theme Button */}
        <button onClick={toggleTheme}>
          {darkMode ? "☀" : "🌙"}
        </button>

        {/* Logout */}
        <button onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;