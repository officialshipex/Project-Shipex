import "./BaseRateCardForm.css";
import { useState } from "react";

function BaseRateCardForm({setBaseRates,setIsFormVisible}) {
  const [formData, setFormData] = useState({
    courierProviderName: '',
    courierServiceName: '',
    mode:'Surface',
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

  const courierProviders = ['NimbusPost'];
  const [courierServices, setCourierServices] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if(name==='courierProviderName'){
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
      const response = await fetch('http://localhost:5000/v1/saveBaseRate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result=await response.json();
      if(response.ok){
        alert("form submitted succcessfully");
        console.log(result);
        setIsFormVisible(false);
        setBaseRates(result);

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
        console.log(result);
        setCourierServices(result.services[0].services);

      }
      else {
        console.error(result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error('Error getting couriers:', error);
      alert('Error getting couriers');
    }


  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Courier Provider Name:
        <select name="courierProviderName" value={formData.courierProviderName} onChange={handleInputChange} required>
          <option value="">Select Provider</option>
          {courierProviders.map((provider, index) => (
            <option key={index} value={provider}>{provider}</option>
          ))}
        </select>
      </label>

      <label>
        Courier Service Name:
        <select name="courierServiceName" value={formData.courierServiceName} onChange={handleInputChange} required>
          <option value="">Select Service</option>
          {
                courierServices.map((service, index) => (
                  <option key={index} value={service.courierProviderServiceName}>
                    {service.courierProviderServiceName}
                  </option>
                ))
              }
        </select>
      </label>

      <label>
        Mode:
        <select name="mode" value={formData.mode} onChange={handleInputChange} required>
            <option value='Surface'>Surface</option>
            <option value='Air'>Air</option>
        </select>
      </label>

      <div className="weight-section">
        <div className="section-container">
          <h3>Weight Price Basic</h3>
          {formData.weightPriceBasic.map((weightPrice, index) => (
            <div key={index}>
              <label>
                Weight:
                <input
                  type="number"
                  value={weightPrice.weight}
                  onChange={(e) => handleWeightPriceChange(index, null, 'weight', e.target.value)}
                />
              </label>
              {['zoneA', 'zoneB', 'zoneC', 'zoneD', 'zoneE'].map((zone) => (
                <div key={zone} style={{ marginTop: '10px' }}>
                  <h4>{zone}:</h4>
                  <label>
                    Forward:
                    <input
                      type="number"
                      value={weightPrice[zone].forward}
                      onChange={(e) => handleWeightPriceChange(index, zone, 'forward', e.target.value)}
                    />
                  </label>
                  <label>
                    RTO:
                    <input
                      type="number"
                      value={weightPrice[zone].rto}
                      onChange={(e) => handleWeightPriceChange(index, zone, 'rto', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="section-container">
          <h3>Weight Price Additional</h3>
          {formData.weightPriceAdditional.map((weightPrice, index) => (
            <div key={index}>
              <label>
                Weight:
                <input
                  type="number"
                  value={weightPrice.weight}
                  onChange={(e) => handleWeightPriceChange(index, null, 'weight', e.target.value, true)}
                />
              </label>
              {['zoneA', 'zoneB', 'zoneC', 'zoneD', 'zoneE'].map((zone) => (
                <div key={zone} style={{ marginTop: '10px' }}>
                  <h4>{zone}:</h4>
                  <label>
                    Forward:
                    <input
                      type="number"
                      value={weightPrice[zone].forward}
                      onChange={(e) => handleWeightPriceChange(index, zone, 'forward', e.target.value, true)}
                    />
                  </label>
                  <label>
                    RTO:
                    <input
                      type="number"
                      value={weightPrice[zone].rto}
                      onChange={(e) => handleWeightPriceChange(index, zone, 'rto', e.target.value, true)}
                    />
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <label>
        COD Percent:
        <input
          type="number"
          name="codPercent"
          value={formData.codPercent}
          onChange={handleInputChange}
        />
      </label>

      <label>
        COD Charge:
        <input
          type="number"
          name="codCharge"
          value={formData.codCharge}
          onChange={handleInputChange}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default BaseRateCardForm;

