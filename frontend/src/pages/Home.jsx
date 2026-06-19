import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.serviceName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Book Trusted Services Instantly</h1>
        <p>
          Home cleaning, repairs, salon, AC services and more.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="filter-box">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Cleaning</option>
          <option>Repair</option>
          <option>Salon</option>
          <option>Home Services</option>
        </select>
      </div>

      {/* Services */}
      <h2>Available Services</h2>

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div className="card service-card" key={service._id}>
            <img
              src={
                service.image ||
                "https://via.placeholder.com/300x180"
              }
              alt={service.serviceName}
              className="service-img"
            />

            <h3>{service.serviceName}</h3>
            <p>{service.description}</p>
            <p><strong>Price:</strong> ₹{service.price}</p>

            <Link to={`/service/${service._id}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;