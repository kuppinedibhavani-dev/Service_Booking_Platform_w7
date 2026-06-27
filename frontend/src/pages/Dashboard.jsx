import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <h2>My Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="card"
            style={{ marginBottom: "20px" }}
          >
            <h3>
              {booking.service?.name || "Service"}
            </h3>

            <p>
              <strong>Date:</strong> {booking.date}
            </p>

            <p>
              <strong>Time:</strong> {booking.time}
            </p>

            <p>
              <strong>Booking Status:</strong>{" "}
              {booking.bookingStatus}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {booking.paymentStatus}
            </p>

            <p>
              <strong>Amount:</strong> ₹{booking.amount}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;