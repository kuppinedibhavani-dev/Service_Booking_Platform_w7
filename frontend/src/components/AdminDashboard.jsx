import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

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
      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
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

  const updateBookingStatus = async (
    id,
    status
  ) => {
    try {
      await API.put(`/bookings/${id}`, {
        status
      });

      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.paymentStatus === "Paid"
    )
    .reduce(
      (sum, booking) =>
        sum + booking.totalAmount,
      0
    );

  return (
    <div className="page container">
      <h2>Admin Dashboard</h2>

      <h3>Total Revenue: ₹{totalRevenue}</h3>

      <h3>Manage Services</h3>

      {services.map((service) => (
        <div
          key={service._id}
          className="card"
        >
          <h4>{service.serviceName}</h4>

          <button
            onClick={() =>
              deleteService(service._id)
            }
          >
            Delete Service
          </button>
        </div>
      ))}

      <h3 style={{ marginTop: "30px" }}>
        All Bookings
      </h3>

      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="card"
        >
          <h4>
            {booking.serviceId?.serviceName}
          </h4>

          <p>
            Customer: {booking.customerName}
          </p>

          <p>Status: {booking.status}</p>

          <p>
            Payment: {booking.paymentStatus}
          </p>

          <p>
            Amount: ₹{booking.totalAmount}
          </p>

          <button
            onClick={() =>
              updateBookingStatus(
                booking._id,
                "Confirmed"
              )
            }
          >
            Confirm
          </button>

          <button
            onClick={() =>
              updateBookingStatus(
                booking._id,
                "Completed"
              )
            }
          >
            Complete
          </button>

          <button
            onClick={() =>
              updateBookingStatus(
                booking._id,
                "Cancelled"
              )
            }
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;