import { useState } from 'react';
import './B2CCalculator.css';

const B2CCalculator = () => {
    const [formData, setFormData] = useState({
        pickupPincode: '',
        deliveryPincode: '',
        weight: '',
        length: '',
        height: '',
        breadth: '',
        value: '',
        paymentMode: 'cod',
    });

    const [calculatedRates, setCalculatedRates] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/v1/calculateRate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log('Server response:', result);
            setCalculatedRates(result);
        }
        catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form.');
        }

    };

    return (
        <div className="calculator-container">
            <h1 className="heading">B2C Calculator</h1>
            <form className="calculator-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="pickupPincode">Pickup Pincode</label>
                    <input
                        type="text"
                        id="pickupPincode"
                        name="pickupPincode"
                        value={formData.pickupPincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryPincode">Delivery Pincode</label>
                    <input
                        type="text"
                        id="deliveryPincode"
                        name="deliveryPincode"
                        value={formData.deliveryPincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="length">Length (cm)</label>
                    <input
                        type="number"
                        id="length"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="breadth">Breadth (cm)</label>
                    <input
                        type="number"
                        id="breadth"
                        name="breadth"
                        value={formData.breadth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="value">Value (INR)</label>
                    <input
                        type="number"
                        id="value"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Payment Mode</label>
                    <div className="payment-options">
                        <label>
                            <input
                                type="radio"
                                name="paymentMode"
                                value="cod"
                                checked={formData.paymentMode === 'cod'}
                                onChange={handleChange}
                            />
                            COD
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMode"
                                value="prepaid"
                                checked={formData.paymentMode === 'prepaid'}
                                onChange={handleChange}
                            />
                            Prepaid
                        </label>
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Calculate
                </button>
            </form>

            {calculatedRates.length > 0 && (
                <div className="calculated-rates">
                    <h2>Calculated Rates</h2>
                    <table className="rates-table">
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Courier Charges (Forward)</th>
                                <th>COD Charges</th>
                                <th>GST (Forward)</th>
                                <th>Total Charges (Forward)</th>
                                <th>Courier Charges (RTO)</th>
                                <th>GST (RTO)</th>
                                <th>Total Charges (RTO)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculatedRates.map((rate, index) => (
                                <tr key={index}>
                                    <td>{rate.courierServiceName}</td>
                                    <td>{rate.forward.charges}</td>
                                    <td>{rate.cod}</td>
                                    <td>{rate.forward.gst}</td>
                                    <td>{rate.forward.finalCharges}</td>
                                    <td>{rate.rto.charges}</td>
                                    <td>{rate.rto.gst}</td>
                                    <td>{rate.rto.finalCharges}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default B2CCalculator;
