import React, { useState, useEffect } from "react";

const AllZones = ({zones,setZones,setFormData,formRef}) => {
  const [filteredZones, setFilteredZones] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("http://localhost:5000/v1/B2Bzone/getAllZones");
        const data = await response.json();
        setZones(data);
        setFilteredZones(data);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, [zones]);

  const handleSearch = () => {
    if (filterDate) {
      const filtered = zones.filter((zone) =>
        zone.createdAt.toLowerCase().includes(filterDate.toLowerCase())
      );
      setFilteredZones(filtered);
    } else {
      setFilteredZones(zones);
    }
  };

  const handleRefresh = () => {
    setFilteredZones(zones);
    setFilterDate("");
  };

  const handleEdit=(zone)=>{
        console.log("I am in handle edit");
        console.log(zone);
        setFormData({
          name:zone.name,
          fullname:zone.fullname
        })

        formRef.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>All Zones</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>SR.</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>NAME</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>FULLNAME</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>CREATED AT</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredZones.length > 0 ? (
            filteredZones.map((zone, index) => (
              <tr key={zone._id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{index + 1}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{zone.name}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{zone.fullname}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{new Date(zone.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                    }}

                    onClick={()=>handleEdit(zone)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                No zones found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllZones;
