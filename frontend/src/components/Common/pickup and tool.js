import React, { useState } from 'react';
import './App.css'; // Add your styles here

const App = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="container">
      {/* Pick Up Section */}
      <div className="pickup-section">
        <h3>Pick up</h3>
        <div className="pickup-status-box">
          <div className="status-item">
            <button className="status-button">Pick up scheduled</button>
            <p>For Jul 23 2024</p>
          </div>
          <div className="status-item">
            <button className="status-button">Pick up Completed</button>
            <p>On Jul 21 2024</p>
          </div>
          <div className="status-item">
            <button className="status-button">Delivered</button>
            <p>On Jul 23 2024</p>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="tools-section">
        <h3>Tools</h3>
        <div className="tools-subhead">
          <button className="tools-dropdown" onClick={toggleDropdown}>
            <span role="img" aria-label="wrench">🔧</span> Tools {isDropdownOpen ? '▲' : '▼'}
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-list">
              <li>Rate Card</li>
              <li>Product Catalog</li>
              <li>Pincode Serviceability</li>
              <li>Activity Log</li>
              <li>Rate Calculator</li>
              <li>Courier</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
