import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({});
  const [bookings, setBookings] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/mybookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    try {
      await API.put("/auth/profile", {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });

      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page container">
      {/* Profile Card */}
      <div className="card">
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            color: "white",
            fontSize: "40px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px"
          }}
        >
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        {editMode ? (
          <>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
            />

            <button onClick={saveProfile}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h2>{profile.name}</h2>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>

            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Booking History */}
      <h2 style={{ marginTop: "30px" }}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div className="card" key={booking._id}>
            <h3>{booking.serviceId?.serviceName}</h3>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.bookingDate).toDateString()}
            </p>

            <p><strong>Time:</strong> {booking.timeSlot}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Total:</strong> ₹{booking.totalAmount}</p>

            {booking.status !== "Cancelled" && (
              <button onClick={() => cancelBooking(booking._id)}>
                Cancel Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;