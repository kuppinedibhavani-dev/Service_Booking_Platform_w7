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
  const [loading, setLoading] = useState(false);

  const slots = [
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
    "6:00 PM"
  ];

  const amount = 500;

  const handleBooking = async () => {
    if (!timeSlot) {
      alert("Please select a time slot");
      return;
    }

    try {
      setLoading(true);

      // Create booking
      const bookingResponse = await API.post("/bookings", {
        service: id,
        date: date.toDateString(),
        time: timeSlot,
        amount
      });

      const booking = bookingResponse.data;

      // Create payment order
      const orderResponse = await API.post("/payments/create-order", {
        amount
      });

      const order = orderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Service Booking Platform",
        description: "Service Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            alert("Payment successful");
            navigate("/success");
          } catch (error) {
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#3399cc"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <div className="card">
        <h2>Book Your Service</h2>

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
                  timeSlot === slot ? "green" : ""
              }}
            >
              {slot}
            </button>
          ))}
        </div>

        <h3 style={{ marginTop: "20px" }}>
          Amount: ₹{amount}
        </h3>

        <button
          style={{ marginTop: "20px" }}
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "Processing..." : "Book & Pay"}
        </button>
      </div>
    </div>
  );
}

export default Booking;