import React, { useState, useEffect } from "react";


const DisplayZoneRates = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [zones, setZones] = useState([]);
  const [zoneSheet, setZoneSheet] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/v1/B2Bzone/getAllServices");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setServices(data);
      } catch (error) {
        console.error("An error has occurred while fetching services:", error.message);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedService(value);

    const selectedServiceObj = services.find(service => service.courierProviderServiceName === value);

    if (selectedServiceObj) {
      setZones(selectedServiceObj.zones);
      setZoneSheet(selectedServiceObj.zoneSheet);
    }
  };



  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.formGroup}>
          <label htmlFor="service" style={styles.label}>
            Mapped Zone Rates
          </label>
          <select
            id="service"
            name="service"
            style={styles.select}
            value={selectedService || ""}
            onChange={handleChange}
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service._id} value={service.courierProviderServiceName}>
                {service.courierProviderServiceName}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Zone Rates</h3>
          <table style={styles.table}>
            {selectedService && zones.length > 0 && zoneSheet.length > 0 ? (
              <>
                <thead>
                  <tr>
                    <th style={styles.th}>Zone</th>
                    {zones.map((zone, index) => (
                      <th key={index} style={styles.th}>{zone.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zoneSheet.map((zoneSh, index) => (
                    <tr key={index}>
                      <td style={styles.th}>{zoneSh.zone}</td>
                      {zones.map((zone, zoneIndex) => (
                        <td key={zoneIndex} style={styles.th}>
                          {zoneSh.distances[zone.name]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <thead>
                <tr>
                  <th colSpan="1" style={styles.noData}>
                    No records to display
                  </th>
                </tr>
              </thead>
            )}
          </table>





        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "20px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  formContainer: {
    width: "90%",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  tableContainer: {
    marginTop: "20px",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
  tableTitle: {
    margin: "10px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    textAlign: "left",
    padding: "8px",
    backgroundColor: "#f4f4f4",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
};

export default DisplayZoneRates;

