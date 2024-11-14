import { useState } from "react";
import "./RateCardForm.css";

function RateCardForm() {
  const [formData, setFormData] = useState({
    courierProviderName: '',
    courierServiceName: '',
    mode: 'Surface',
    weightPriceBasic: [
      {
        weight: '',
        zoneA: { forward: '', rto: '' },
        zoneB: { forward: '', rto: '' },
        zoneC: { forward: '', rto: '' },
        zoneD: { forward: '', rto: '' },
        zoneE: { forward: '', rto: '' },
      }
    ],
    weightPriceAdditional: [
      {
        weight: '',
        zoneA: { forward: '', rto: '' },
        zoneB: { forward: '', rto: '' },
        zoneC: { forward: '', rto: '' },
        zoneD: { forward: '', rto: '' },
        zoneE: { forward: '', rto: '' },
      }
    ],
    codPercent: '',
    codCharge: '',
  });

  const [courierServices, setCourierServices] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'courierProviderName') {
      updateCourierService(value);
    }
  };

  const handleWeightPriceChange = (index, zone, field, value, isAdditional = false) => {
    const weightPrice = isAdditional ? [...formData.weightPriceAdditional] : [...formData.weightPriceBasic];
    
    if (zone === null) {  // Update weight directly when zone is null
      weightPrice[index].weight = value;
    } else {
      weightPrice[index][zone][field] = value;
    }

    setFormData({
      ...formData,
      [isAdditional ? 'weightPriceAdditional' : 'weightPriceBasic']: weightPrice
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/v1/saveRate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log('Server response:', result);
      if (response.ok) {
        alert('Form submitted successfully!');
        resetForm();
      } else {
        alert('There was an issue with the form submission.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  const updateCourierService = async (provider) => {
    try {
      const response = await fetch(`http://localhost:5000/v1/getServices?provider=${provider}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        setCourierServices(result.services[0].services);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error getting couriers:', error);
      alert('Error getting couriers');
    }
  };

  const resetForm = () => {
    setFormData({
      courierProviderName: '',
      courierServiceName: '',
      mode: 'Surface',
      weightPriceBasic: [
        {
          weight: '',
          zoneA: { forward: '', rto: '' },
          zoneB: { forward: '', rto: '' },
          zoneC: { forward: '', rto: '' },
          zoneD: { forward: '', rto: '' },
          zoneE: { forward: '', rto: '' },
        }
      ],
      weightPriceAdditional: [
        {
          weight: '',
          zoneA: { forward: '', rto: '' },
          zoneB: { forward: '', rto: '' },
          zoneC: { forward: '', rto: '' },
          zoneD: { forward: '', rto: '' },
          zoneE: { forward: '', rto: '' },
        }
      ],
      codPercent: '',
      codCharge: '',
    });
    setCourierServices([]);
  };

  return (
    <div className="container">
      <h2>Rate Card Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Courier Provider</label>
          <select name="courierProviderName" value={formData.courierProviderName} onChange={handleInputChange}>
            <option value="">Select The Provider</option>
            <option value="NimbusPost">NimbusPost</option>
          </select>

          <label>Courier Service</label>
          <select name="courierServiceName" value={formData.courierServiceName} onChange={handleInputChange}>
            <option value="">Select Courier Service</option>
            {courierServices.map((service, index) => (
              <option key={index} value={service.courierProviderServiceName}>
                {service.courierProviderServiceName}
              </option>
            ))}
          </select>

          <label>Mode</label>
          <input type="text" name="mode" value={formData.mode} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <h3>Weight Price Basic</h3>
          <label>Weight</label>
          <input
            type="number"
            value={formData.weightPriceBasic[0].weight}
            onChange={(e) => handleWeightPriceChange(0, null, 'weight', e.target.value)}
          />
          {['zoneA', 'zoneB', 'zoneC', 'zoneD', 'zoneE'].map((zone) => (
            <div key={zone}>
              <label>{zone.toUpperCase()}</label>
              <input
                type="number"
                placeholder="Forward"
                value={formData.weightPriceBasic[0][zone].forward}
                onChange={(e) => handleWeightPriceChange(0, zone, 'forward', e.target.value)}
              />
              <input
                type="number"
                placeholder="RTO"
                value={formData.weightPriceBasic[0][zone].rto}
                onChange={(e) => handleWeightPriceChange(0, zone, 'rto', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <h3>Weight Price Additional</h3>
          <label>Weight</label>
          <input
            type="number"
            value={formData.weightPriceAdditional[0].weight}
            onChange={(e) => handleWeightPriceChange(0, null, 'weight', e.target.value, true)}
          />
          {['zoneA', 'zoneB', 'zoneC', 'zoneD', 'zoneE'].map((zone) => (
            <div key={zone}>
              <label>{zone.toUpperCase()}</label>
              <input
                type="number"
                placeholder="Forward"
                value={formData.weightPriceAdditional[0][zone].forward}
                onChange={(e) => handleWeightPriceChange(0, zone, 'forward', e.target.value, true)}
              />
              <input
                type="number"
                placeholder="RTO"
                value={formData.weightPriceAdditional[0][zone].rto}
                onChange={(e) => handleWeightPriceChange(0, zone, 'rto', e.target.value, true)}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>COD Percent</label>
          <input type="number" name="codPercent" value={formData.codPercent} onChange={handleInputChange} />
          <label>COD Charge</label>
          <input type="number" name="codCharge" value={formData.codCharge} onChange={handleInputChange} />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default RateCardForm;


