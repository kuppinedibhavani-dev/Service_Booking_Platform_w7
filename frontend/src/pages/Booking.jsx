import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const slots = [
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
    "6:00 PM"
  ];

  const handleBooking = async () => {
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !timeSlot
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await API.post("/bookings", {
        serviceId: id,
        bookingDate: date,
        timeSlot,
        customerName,
        customerEmail,
        customerPhone
      });

      alert("Booking created successfully");

      navigate(`/payment/${response.data.booking._id}`);
    } catch (error) {
      alert(
        error.response?.data?.message || "Booking failed"
      );
    }
  };

  return (
    <div className="page container">
      <div className="card">
        <h2>Book Your Service</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={customerEmail}
          onChange={(e) =>
            setCustomerEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={customerPhone}
          onChange={(e) =>
            setCustomerPhone(e.target.value)
          }
        />

        <h3>Select Date</h3>

        <Calendar
          onChange={setDate}
          value={date}
        />

        <h3 style={{ marginTop: "20px" }}>
          Select Time Slot
        </h3>

        <div>
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setTimeSlot(slot)}
              style={{
                margin: "10px",
                background:
                  timeSlot === slot
                    ? "green"
                    : ""
              }}
            >
              {slot}
            </button>
          ))}
        </div>

        <button
          style={{ marginTop: "20px" }}
          onClick={handleBooking}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Booking;