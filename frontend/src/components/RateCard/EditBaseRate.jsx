import "./EditBaseRate.css";
import { useState, useEffect } from "react";

const EditBaseRate = ({ selectedBaseRate,setIsEditFormVisible}) => {
    const [formData, setFormData] = useState({
        id:selectedBaseRate._id,
        courierProviderName: '',
        courierServiceName: '',
        mode: '',
        weightPriceBasic: [],
        weightPriceAdditional: [],
        codPercent: '',
        codCharge: '',
    });

    // Update formData when selectedBaseRate changes
    useEffect(() => {
        if (selectedBaseRate) {
            setFormData({
                id:selectedBaseRate._id,
                courierProviderName: selectedBaseRate.courierProviderName,
                courierServiceName: selectedBaseRate.courierServiceName,
                mode: selectedBaseRate.mode,
                weightPriceBasic: selectedBaseRate.weightPriceBasic,
                weightPriceAdditional: selectedBaseRate.weightPriceAdditional,
                codPercent: selectedBaseRate.codPercent,
                codCharge: selectedBaseRate.codCharge,
            });
        }
    }, [selectedBaseRate]); // Re-run when selectedBaseRate changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "codCharge" || name === "codPercent" ? parseFloat(value) : value });
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
          const response = await fetch('http://localhost:5000/v1/editBaseRate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const result = await response.json();
          if(response.ok){
            alert("Form submitted successfully");
            console.log("Result returned after editing",result);
            setIsEditFormVisible(false);
            // Reset form after successful submission
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
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('There was an error submitting the form.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Courier Provider Name:
                <select name="courierProviderName" value={formData.courierProviderName} onChange={handleInputChange} required>
                    <option value={formData.courierProviderName}>{formData.courierProviderName}</option>
                </select>
            </label>

            <label>
                Courier Service Name:
                <select name="courierServiceName" value={formData.courierServiceName} onChange={handleInputChange} required>
                    <option value={formData.courierServiceName}>{formData.courierServiceName}</option>
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

            <button type="submit">Make Changes</button>
        </form>
    );
};

export default EditBaseRate;

