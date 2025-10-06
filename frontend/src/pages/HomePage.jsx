import PropertyListings from "../components/PropertyListings";
import { useState, useEffect } from "react";


const Home = () => {
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {},[]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {

        const res = await fetch("/api/properties");
        if (!res.ok) {
          throw new Error("Failed to get property")
        }
        const data = await res.json();
        setIsLoading(false);
        setProperties(data)
        setError(null)
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
      }
    }
    fetchProperties()
  }, []);


  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {properties && <PropertyListings properties={properties} />}
    </div>
  );
};

export default Home;
