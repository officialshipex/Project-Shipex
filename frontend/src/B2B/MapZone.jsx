import * as XLSX from 'xlsx';
import { useEffect, useState } from "react";
import "./MapZone.css";

const MapZone = () => {
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [courierProvider, setCourierProvider] = useState([]);
    const [courierServices, setCourierServices] = useState([]);
    const [newCity, setNewCity] = useState("");
    const [newState, setNewState] = useState("");
    const [tableData, setTableData] = useState({});
    const [refresh, setRefresh] = useState(false);

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
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        };

        const fetchProviders = async () => {
            try {
                const response = await fetch("http://localhost:5000/v1/B2Bzone/getAllCourierProviders");
                const data = await response.json();
                setCourierProvider(data);
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };

        const fetchTableData = async () => {
            try {
                const response = await fetch("http://localhost:5000/v1/B2Bzone/getTableData");
                const data = await response.json();
                setTableData(data);
            }
            catch (error) {
                console.error("Error fetching tableData:", error);
            }
        }

        const fetchData = async () => {
            await Promise.all([fetchZones(), fetchProviders(), fetchTableData()]);
        };

        fetchData();
    }, [refresh]);

    const updateCourierService = async (provider) => {
        try {

            const response = await fetch(`http://localhost:5000/v1/B2Bzone?provider=${provider}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setCourierServices(data[0].services);
        }

        catch (error) {
            console.error('Error getting couriers:', error);
            alert('Error getting couriers');
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'courierProviderName') {
            updateCourierService(value);
        }
    };

    const handleAddCity = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (newCity.trim() !== "") {

                setCities((prevCities) => [...prevCities, newCity.trim()]);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    cities: [...prevFormData.cities, newCity.trim()],
                }));

                setNewCity("");
            }
        }
    };

    const handleAddState = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (newState.trim() !== "") {

                setStates((prevStates) => [...prevStates, newState.trim()]);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    states: [...prevFormData.states, newState.trim()],
                }));

                setNewState("");
            }
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/v1/B2Bzone/saveZoneMapping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            setRefresh((prev) => !prev);
            setFormData({
                courierProviderName: "",
                courierServiceName: "",
                zone: "",
                cities: [],
                states: [],
            })
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleUpload = async (provider, service) => {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls';
        fileInput.click();

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'array' });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                await uploadToBackend(provider, service, jsonData);
            };

            reader.readAsArrayBuffer(file);
        };
    };


    const uploadToBackend = async (provider, service,jsonData) => {
        try {
            const requestData = {
                provider,
                service,
                data: jsonData,
            };

          

            const response = await fetch('http://localhost:5000/v1/B2Bzone/uploadRates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to upload data to the backend');
            }
            const result = await response.json();
            alert('Data uploaded successfully!');
        } catch (error) {
            console.error('Error uploading data:', error);
            alert('Error uploading data. Please try again.');
        }
    };



    return (
        <>
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
                            {courierProvider.map((provider, index) => (
                                <option key={index} value={provider.provider}>
                                    {provider.provider}
                                </option>
                            ))

                            }
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
            <div className="mappedZones">
                <h2>Mapped Zones</h2>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '10px',
                        textAlign: 'left',
                        border: '1px solid black',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>Provider</th>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>Service</th>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>Zone</th>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>Cities</th>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>States</th>
                            <th style={{ padding: '8px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>Upload Rates</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(tableData).map(([provider, courier]) => {
                                return courier.services.map(service => {
                                    const numberOfZones = service.zones.length;
                                    return service.zones.map((zone, index) => {
                                        return (
                                            <tr key={`${provider}-${service.name}-${zone.name}`}>
                                                {index === 0 ? (
                                                    <td rowSpan={numberOfZones} style={{ padding: '8px', border: '1px solid black' }}>
                                                        {provider}
                                                    </td>
                                                ) : null}
                                                {index === 0 ? (
                                                    <td rowSpan={numberOfZones} style={{ padding: '8px', border: '1px solid black' }}>
                                                        {service.courierProviderServiceName}
                                                    </td>
                                                ) : null}
                                                <td style={{ padding: '8px', border: '1px solid black' }}>
                                                    {zone.name}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid black' }}>
                                                    {zone.cities ? zone.cities.join(', ') : 'N/A'}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid black' }}>
                                                    {zone.states ? zone.states.join(', ') : 'N/A'}
                                                </td>
                                               {index===0?(
                                                <td rowSpan={numberOfZones} style={{ padding: '8px', border: '1px solid black' }} >
                                                    <button
                                                        onClick={() => handleUpload(provider, service)}
                                                        style={{
                                                            backgroundColor: '#007bff',
                                                            color: 'white',
                                                            padding: '6px 12px',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        Upload
                                                    </button>
                                                </td>
                                               ):null}
                                            </tr>
                                        );
                                    });
                                });
                            })
                        }

                    </tbody>
                </table>
            </div>


        </>
    );
};

export default MapZone;

