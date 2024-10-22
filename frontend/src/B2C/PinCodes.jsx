import React, { useState } from 'react'

const PinCodes = () => {
    // State to manage Pincodes toggle switch
    const [isShipexEnabled, setIsShipexEnabled] = useState(false);

    // Function to toggle Pincodes switch
    const toggleShipex = () => {
        setIsShipexEnabled(!isShipexEnabled);
    };
    return (
        <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Pincodes</h2>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm">Use Shipex pincodes</label>

                {/* Switch Implementation */}
                <div
                    className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in"
                    onClick={toggleShipex}
                >
                    <input
                        type="checkbox"
                        name="toggle"
                        id="toggle"
                        className="sr-only"
                        checked={isShipexEnabled}
                        onChange={toggleShipex}
                    />
                    <div
                        className={`block w-14 h-8 rounded-full ${isShipexEnabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                    ></div>
                    <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isShipexEnabled ? 'translate-x-6' : ''
                            }`}
                    ></div>
                </div>
            </div>
            <p className="text-sm">
                To use Shipex India serviceability, please enable the Shipex pincodes or upload your sheets.
            </p>
        </div>
    )
}

export default PinCodes