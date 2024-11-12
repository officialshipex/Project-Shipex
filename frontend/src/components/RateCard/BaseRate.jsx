import './BaseRate.css';
import { useState } from 'react';
import { useEffect } from 'react';
import BaseRateCardForm from './BaseRateCardForm';

const BaseRate = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [baseRates, setBaseRates] = useState([]);

    const handleAddClick = () => {
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            handleCloseForm();
        }
    };

    useEffect(() => {
        // Function to fetch base rates
        console.log('useEffect has been triggered');
        const fetchBaseRates = async () => {
            try {
                const response = await fetch('http://localhost:5000/v1/getBaseRate');
                if (!response.ok) {
                    throw new Error('Failed to fetch base rates');
                }
                const data = await response.json();
                console.log(data);
                setBaseRates(data);
            } catch (error) {
                console.error('Error fetching base rates:', error);
            }
        };

        // Call fetch function on component mount
        fetchBaseRates();
    }, []);

    return (
        <div className="base-rate-page">
            <h1>Costing Rates</h1>
            <button className="add-button" onClick={handleAddClick}>Add</button>
            <button className='add-button'>Upload</button>

            {isFormVisible && (
                <div className="modal" onClick={handleOutsideClick}>
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseForm}>&times;</span>
                        <BaseRateCardForm setBaseRates={setBaseRates} setIsFormVisible={setIsFormVisible} />
                    </div>
                </div>
            )}

            {baseRates.length > 0 && (
                <table className="base-rates-table">
                    <thead>
                        <tr>
                            <th rowSpan={2}>Provider</th>
                            <th rowSpan={2}>Service</th>
                            <th rowSpan={2}>Mode</th>
                            <th rowSpan={2}>Weight (kg)</th>
                            <th colSpan={2}>ZoneA</th>
                            <th colSpan={2}>ZoneB</th>
                            <th colSpan={2}>ZoneC</th>
                            <th colSpan={2}>ZoneD</th>
                            <th colSpan={2}>ZoneE</th>
                            <th rowSpan={2}>COD Charge</th>
                            <th rowSpan={2}>COD %</th>
                            <th rowSpan={2}>Edit</th>
                            <th rowSpan={2}>Delete</th>
                        </tr>
                        <tr>
                            <th>Forward</th>
                            <th>RTO</th>
                            <th>Forward</th>
                            <th>RTO</th>
                            <th>Forward</th>
                            <th>RTO</th>
                            <th>Forward</th>
                            <th>RTO</th>
                            <th>Forward</th>
                            <th>RTO</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {baseRates.map((rate, index) => (
                            <>
                            <tr key={index}>
                                <td rowSpan={2}>{rate.courierProviderName}</td>
                                <td rowSpan={2}>{rate.courierServiceName}</td>
                                <td rowSpan={2}>{rate.mode}</td>
                                <td>{rate.weightPriceBasic[0].weight}</td>
                                <td>{rate.weightPriceBasic[0].zoneA.forward}</td>
                                <td>{rate.weightPriceBasic[0].zoneA.rto}</td>
                                <td>{rate.weightPriceBasic[0].zoneB.forward}</td>
                                <td>{rate.weightPriceBasic[0].zoneB.rto}</td>
                                <td>{rate.weightPriceBasic[0].zoneC.forward}</td>
                                <td>{rate.weightPriceBasic[0].zoneC.rto}</td>
                                <td>{rate.weightPriceBasic[0].zoneD.forward}</td>
                                <td>{rate.weightPriceBasic[0].zoneD.rto}</td>
                                <td>{rate.weightPriceBasic[0].zoneE.rto}</td>
                                <td>{rate.weightPriceBasic[0].zoneE.rto}</td>
                                <td>{rate.codCharge}</td>
                                <td>{rate.codPercent}</td>
                                <td><button>Edit</button></td>
                                <td><button>Delete</button></td>
                            </tr>

                            <tr> <td>{rate.weightPriceAdditional[0].weight}</td>
                                <td>{rate.weightPriceAdditional[0].zoneA.forward}</td>
                                <td>{rate.weightPriceAdditional[0].zoneA.rto}</td>
                                <td>{rate.weightPriceAdditional[0].zoneB.forward}</td>
                                <td>{rate.weightPriceAdditional[0].zoneB.rto}</td>
                                <td>{rate.weightPriceAdditional[0].zoneC.forward}</td>
                                <td>{rate.weightPriceAdditional[0].zoneC.rto}</td>
                                <td>{rate.weightPriceAdditional[0].zoneD.forward}</td>
                                <td>{rate.weightPriceAdditional[0].zoneD.rto}</td>
                                <td>{rate.weightPriceAdditional[0].zoneE.rto}</td>
                                <td>{rate.weightPriceAdditional[0].zoneE.rto}</td>

                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BaseRate;



