
import { useEffect, useState } from "react";
import "./MapZone.css";

const MapZone = () => {
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [courierServices, setCourierServices] = useState([]);
    const [newCity, setNewCity] = useState("");
    const [newState, setNewState] = useState("");

    const [formData, setFormData] = useState({
        courierProviderName: "",
        courierServiceName: "",
        zone: "",
        cities: [],
        states: [],
    });

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await fetch("http://localhost:5000/v1/B2Bzone/getAllZones");
                const data = await response.json();
                setZones(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        };

        fetchZones();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleAddCity = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (newCity.trim() !== "") {
                // Add city to the cities array
                setCities((prevCities) => [...prevCities, newCity.trim()]);
                // Update formData.cities
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    cities: [...prevFormData.cities, newCity.trim()],
                }));
                // Clear the input field
                setNewCity("");
            }
        }
    };

    const handleAddState = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (newState.trim() !== "") {
                // Add state to the states array
                setStates((prevStates) => [...prevStates, newState.trim()]);
                // Update formData.states
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    states: [...prevFormData.states, newState.trim()],
                }));
                // Clear the input field
                setNewState("");
            }
        }
    };

    const handleSave = async () => {
        try {
            console.log("Form Data Submitted:", formData);
            const response = await fetch('http://localhost:5000/v1/B2Bzone/saveZoneMapping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result);
        }
        catch (error) {

        }
    };

    return (
        <div className="formContainer">
            <h2>Map Zone</h2>
            <form>
                <div className="form-group">
                    <label>Courier Provider</label>
                    <select
                        name="courierProviderName"
                        value={formData.courierProviderName}
                        onChange={handleInputChange}
                    >
                        <option value="">Select The Provider</option>
                        <option value="ShipRocketCargo">ShipRocketCargo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Courier Service</label>
                    <select
                        name="courierServiceName"
                        value={formData.courierServiceName}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Courier Service</option>
                        {courierServices.map((service, index) => (
                            <option key={index} value={service.courierProviderServiceName}>
                                {service.courierProviderServiceName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Zone*</label>
                    <select
                        name="zone"
                        value={formData.zone}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Zone</option>
                        {zones.map((zone, index) => (
                            <option key={index} value={zone.name}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Cities</label>
                    <div className="input-group">
                        {cities.map((city, index) => (
                            <span className="chip" key={index}>
                                {city}
                                <button
                                    className="chip-close"
                                    onClick={() => {
                                        const updatedCities = cities.filter((_, i) => i !== index);
                                        setCities(updatedCities);
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            cities: updatedCities,
                                        }));
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            name="newCity"
                            value={newCity}
                            placeholder="Type a city and press Enter"
                            onChange={(e) => setNewCity(e.target.value)}
                            onKeyDown={handleAddCity}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>States</label>
                    <div className="input-group">
                        {states.map((state, index) => (
                            <span className="chip" key={index}>
                                {state}
                                <button
                                    className="chip-close"
                                    onClick={() => {
                                        // Remove the clicked state from the states array
                                        const updatedStates = states.filter((_, i) => i !== index);
                                        setStates(updatedStates);

                                        // Update formData.states

                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            states: updatedStates,
                                        }));
                                    }}
                                >x</button>
                            </span>
                        ))}
                        <input
                            type="text"
                            name="newState"
                            value={newState}
                            placeholder="Type a state and press Enter"
                            onChange={(e) => setNewState(e.target.value)}
                            onKeyDown={handleAddState}
                        />
                    </div>
                </div>

                <button type="button" onClick={handleSave}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default MapZone;

