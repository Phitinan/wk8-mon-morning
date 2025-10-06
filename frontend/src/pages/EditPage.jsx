import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const EditPropertyPage = () => {
    const [title, setTitle] = useState("")
    const [type, setType] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [squareFeet, setSquareFeet] = useState("")
    const [yearBuilt, setYearBuilt] = useState("")
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {id} = useParams();

    const user = JSON.parse(localStorage.getItem("user"))
    const token = user ? user.token : null;
    console.log(token)

    const navigate = useNavigate();
    
    const editProperty = async (newProperty) => {
        
        try {
            console.log(newProperty)
            const res = await fetch(`/api/properties/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/JSON",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProperty),
            });
            if (!res.ok) {
                throw new Error("Failed to edit property")
            }
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const newProperty = {
            title,
            type,
            description,
            price,
            location: {
                address,
                city,
                state,
                zipCode,
            },
            squareFeet,
            yearBuilt
        };

        const success = await editProperty(newProperty);
        if (success) {
            console.log("Property edited successfully");
            navigate("/");
        } else {
            console.error("Failed to edit property");
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
                setTitle(data.title);
                setType(data.type);
                setDescription(data.description);
                setPrice(data.price);
                setAddress(data.location.address);
                setCity(data.location.city);
                setState(data.location.state);
                setZipCode(data.location.zipCode);
                setSquareFeet(data.squareFeet);
                setYearBuilt(data.yearBuilt);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    return (
        <div className="create">
            <h2>Edit Property</h2>
            <form onSubmit={submitForm}>
                <label>Property title:</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                <label>Property type:</label>
                <select value={type}
                    onChange={(e) => { setType(e.target.value) }}>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                </select>

                <label>Property Description:</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}

                ></textarea>
                <label>Price:</label>
                <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => { setPrice(e.target.value) }}
                />
                <label>Address:</label>
                <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => { setAddress(e.target.value) }}
                /><label>City:</label>
                <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => { setCity(e.target.value) }}
                /><label>State:</label>
                <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => { setState(e.target.value) }}
                /><label>Zipcode:</label>
                <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => {setZipCode(e.target.value)}}
                />
                <label>Square Feet:</label>
                <input
                    type="number"
                    required
                    value={squareFeet}
                    onChange={(e) => {setSquareFeet(e.target.value)}}
                />
                <label>Year Built</label>
                <input
                    type="number"
                    required
                    value={yearBuilt}
                    onChange={(e) => {setYearBuilt(e.target.value)}}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditPropertyPage;
