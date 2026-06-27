import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/admin/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      await API.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      console.log(error);
    }
  };

  const updateBookingStatus = async (id, bookingStatus) => {
    try {
      await API.put(`/admin/bookings/${id}`, {
        bookingStatus
      });

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <div className="page container">
      <h2>Admin Dashboard</h2>

      <h3>Total Revenue: ₹{totalRevenue}</h3>

      {/* Manage Services */}
      <h3 style={{ marginTop: "20px" }}>Manage Services</h3>

      {services.length === 0 ? (
        <p>No services found</p>
      ) : (
        services.map((service) => (
          <div
            key={service._id}
            className="card"
            style={{ marginBottom: "20px" }}
          >
            <h4>{service.name}</h4>

            <button
              onClick={() => deleteService(service._id)}
            >
              Delete Service
            </button>
          </div>
        ))
      )}

      {/* Manage Bookings */}
      <h3 style={{ marginTop: "30px" }}>All Bookings</h3>

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
            <h4>
              {booking.service?.name || "Service"}
            </h4>

            <p>
              <strong>Customer:</strong>{" "}
              {booking.user?.name || "User"}
            </p>

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

            <button
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "confirmed"
                )
              }
            >
              Confirm
            </button>

            <button
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "completed"
                )
              }
            >
              Complete
            </button>

            <button
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "cancelled"
                )
              }
            >
              Cancel
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;