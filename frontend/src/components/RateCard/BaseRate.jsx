import './BaseRate.css';
import { useState } from 'react';
import BaseRateCardForm from './BaseRateCardForm';

const BaseRate = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleAddClick = () => {
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
    };

    const handleOutsideClick = (e) => {
        // Check if the click is outside the modal content
        if (e.target.className === 'modal') {
            handleCloseForm();
        }
    };

    return (
        <div className="base-rate-page">
            <h1>Base Rates</h1>
            <button className="add-button" onClick={handleAddClick}>Add</button>
            
            {isFormVisible && (
                <div className="modal" onClick={handleOutsideClick}>
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseForm}>&times;</span>
                        <BaseRateCardForm />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseRate;


