import React, { useState } from "react";


const AddZoneForm = ({setZones}) => {
  const [formData, setFormData] = useState({
    name: "",
    fullname: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      fullname: "",
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();


    try {
      const response = await fetch('http://localhost:5000/v1/B2Bzone/createZone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result=await response.json();

      if (!result.success) {  
        alert(result.message || 'Something went wrong'); 
        setZones(result.data);
        setFormData({
          name: "",
          fullname: "",
        });
        return; 
      }
    
      if(result.success){
        alert(result.message); 
        setZones(result.data);
        setFormData({
          name: "",
          fullname: "",
        });
      }
        
    }
    catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
    // Add logic for saving data
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add Zone</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
              Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="fullname" style={{ display: "block", marginBottom: "5px" }}>
              Fullname<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Fullname"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddZoneForm;
