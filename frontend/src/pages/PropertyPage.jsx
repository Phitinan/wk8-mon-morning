import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"))
  const token = user ? user.token : null;

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };



  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log("id: ", id);
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const onDeleteClick = (propertyId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + propertyId
    );
    if (!confirm) return;

    deleteProperty(propertyId);
    navigate("/");
  };
  const onEditClick = (propertyId) => {
    navigate(`/edit/${id}`);


  };

  return (
    <div className="property-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>

          <h2>{property.title}</h2>
          <p>{property.type}</p>
          <p>Description: {property.description}</p>
          <h3>Location: </h3>
          <p> Address: {property.location.address}</p>
          <p> City: {property.location.city}</p>
          <p> State: {property.location.state}</p>
          <p> ZipCode: {property.location.zipCode}</p>
          <p>Sq feet{property.squareFeet}</p>
          <p>Year: {property.yearBuilt}</p>

          <button onClick={() => onDeleteClick(property._id)}>delete</button>
          <button onClick={() => onEditClick(property._id)}>edit</button>
        </>
      )}
    </div>
  );
};

export default PropertyPage;