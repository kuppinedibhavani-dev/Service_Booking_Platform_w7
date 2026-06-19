import { useEffect, useState } from "react";
import API from "../services/api";

function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await API.get("/bookings/mybookings");
    setBookings(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}`, { status });
    fetchBookings();
  };

  return (
    <div>
      <h2>Provider Dashboard</h2>

      {bookings.map((booking) => (
        <div key={booking._id}>
          <h3>{booking.serviceId?.serviceName}</h3>
          <p>{booking.status}</p>

          <button onClick={() => updateStatus(booking._id, "Confirmed")}>
            Accept
          </button>

          <button onClick={() => updateStatus(booking._id, "Cancelled")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProviderDashboard;