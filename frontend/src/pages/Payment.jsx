import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const { data } = await API.post("/payments/create", {
        bookingId: id
      });

      const options = {
        key:"rzp_test_T3RQBljJboxBnc",
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
    navigate("/success");

  } catch (error) {
    alert("Payment Verification Failed");
  }
},
    theme: {
          color: "#4f46e5"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page container">
      <div className="card">
        <h2>Secure Payment</h2>

        <button onClick={handlePayment}>
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
}

export default Payment;