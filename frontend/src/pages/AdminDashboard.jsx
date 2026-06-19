import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await API.get("/services");
    setServices(res.data);
  };

  const deleteService = async (id) => {
    await API.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {services.map((service) => (
        <div key={service._id}>
          <h3>{service.serviceName}</h3>
          <button onClick={() => deleteService(service._id)}>
            Delete Service
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;