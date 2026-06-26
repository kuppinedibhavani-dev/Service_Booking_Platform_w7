import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/mybookings");
      setBookings(data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page container">
      <h2>My Dashboard</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="card"
            style={{ marginBottom: "20px" }}
          >
            <h3>
              {booking.serviceId?.serviceName}
            </h3>

            <p>
              Date:{" "}
              {new Date(
                booking.bookingDate
              ).toLocaleDateString()}
            </p>

            <p>Time Slot: {booking.timeSlot}</p>

            <p>Status: {booking.status}</p>

            <p>
              Payment Status: {booking.paymentStatus}
            </p>

            <p>
              Amount: ₹{booking.totalAmount}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;