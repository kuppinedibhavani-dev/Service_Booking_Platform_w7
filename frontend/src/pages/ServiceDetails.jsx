import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useParams, Link } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  const fetchService = useCallback(async () => {
    try {
      const res = await API.get(`/services/${id}`);
      setService(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  if (!service) {
    return (
      <div className="page container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="card">
        <h1>{service.serviceName}</h1>
        <p>{service.description}</p>

        <p>
          <strong>Category:</strong> {service.category}
        </p>

        <p>
          <strong>Price:</strong> ₹{service.price}
        </p>

        <p>
          <strong>Duration:</strong> {service.duration}
        </p>

        <Link to={`/booking/${service._id}`}>
          <button>Book Now</button>
        </Link>
      </div>
    </div>
  );
}

export default ServiceDetails;