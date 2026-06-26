import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/payments/create", {
        bookingId: id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "ServiceHub",
        description: "Booking Payment",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: id
            });

            alert("Payment Verified Successfully");
            navigate("/dashboard");

          } catch (error) {
            alert(
              error.response?.data?.message ||
              "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          }
        },

        theme: {
          color: "#4f46e5"
        }
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
        alert(
          "Payment Failed: " +
          response.error.description
        );
      });

      razor.open();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to initiate payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <div className="card">
        <h2>Secure Payment</h2>

        <button
          onClick={handlePayment}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
}

export default Payment;