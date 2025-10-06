import { Link } from "react-router-dom";

const PropertyListing = ({property})=> {
  return (
    <div className="property-preview">
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
      
    </div>
  );
};

export default PropertyListing;
