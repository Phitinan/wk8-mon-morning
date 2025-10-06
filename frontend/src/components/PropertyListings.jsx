import PropertyListing from "./PropertyListing";
import {Link} from "react-router-dom";

const PropertyListings = ({properties}) => {
  console.log(properties);

  return (
    <div className="property-list">
      {properties.map((property) => (
        <Link to={`properties/${property._id}`}>
          <PropertyListing key={property._id} property={property} />
        </Link>
      ))}
    </div>
  );
};

export default PropertyListings;
