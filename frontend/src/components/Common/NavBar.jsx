import React, { useState } from 'react';
import WalletRecharge from '../../payment/WalletRecharge'; // Update the path as necessary

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (section) => {
        console.log(`${section} clicked!`);
    };

    const handleRecharge = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <nav className="h-16 w-[calc(100%-4rem)] ml-16 flex items-center justify-end fixed top-0 bg-white shadow-md z-50">
                {/* Wallet Section */}
                <div className="flex items-center space-x-4 p-4 cursor-pointer" onClick={() => handleClick('Wallet')}>
                    <svg width="22" height="21" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="..." fill="#484848" />
                    </svg>
                    <span className='font-bold'>₹5680</span>
                </div>

                <div className="border-l border-gray-300 h-8" />

                {/* Quick Access Section */}
                <div className="hidden lg:flex items-center space-x-4 p-4 cursor-pointer" onClick={() => handleClick('Quick Access')}>
                    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.25 21.75L17.6875 11.125H13.9375V4.25L8.3125 14.875H12.25V21.75ZM13 25.5C11.2708 25.5 9.64583 25.1719 8.125 24.5156C6.60417 23.8594 5.28125 22.9688 4.15625 21.8438C3.03125 20.7188 2.14063 19.3958 1.48438 17.875C0.828125 16.3542 0.5 14.7292 0.5 13C0.5 11.2708 0.828125 9.64583 1.48438 8.125C2.14063 6.60417 3.03125 5.28125 4.15625 4.15625C5.28125 3.03125 6.60417 2.14063 8.125 1.48438C9.64583 0.828125 11.2708 0.5 13 0.5C14.7292 0.5 16.3542 0.828125 17.875 1.48438C19.3958 2.14063 20.7188 3.03125 21.8438 4.15625C22.9688 5.28125 23.8594 6.60417 24.5156 8.125C25.1719 9.64583 25.5 11.2708 25.5 13C25.5 14.7292 25.1719 16.3542 24.5156 17.875C23.8594 19.3958 22.9688 20.7188 21.8438 21.8438C20.7188 22.9688 19.3958 23.8594 17.875 24.5156C16.3542 25.1719 14.7292 25.5 13 25.5Z" fill="#0CBB7D" />

                    </svg>
                    <span className='text-sm font-semibold text-green-500'>Quick Actions</span>
                </div>

                <div className="border-l border-gray-300 h-8" />

                {/* Recharge Wallet Section */}
                <div className="hidden lg:flex items-center space-x-4 p-4 cursor-pointer" onClick={handleRecharge}>
                    <svg width="26" height="21" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10H23V5H3V10ZM21.75 22.5V18.75H18V16.25H21.75V12.5H24.25V16.25H28V18.75H24.25V22.5H21.75ZM3 20C2.3125 20 1.72396 19.7552 1.23438 19.2656C0.744792 18.776 0.5 18.1875 0.5 17.5V2.5C0.5 1.8125 0.744792 1.22396 1.23438 0.734375C1.72396 0.244792 2.3125 0 3 0H23C23.6875 0 24.276 0.244792 24.7656 0.734375C25.2552 1.22396 25.5 1.8125 25.5 2.5V10H21.75C20.0208 10 18.5469 10.6094 17.3281 11.8281C16.1094 13.0469 15.5 14.5208 15.5 16.25V20H3Z" fill="#0CBB7D" />

                    </svg>
                    <span className='text-sm font-semibold text-green-500'>Recharge Wallet</span>
                </div>

                <div className="border-l border-gray-300 h-8" />

                {/* Notification Icon */}
                <div className="p-4 cursor-pointer lg:flex" onClick={() => handleClick('Notification')}>
                    <svg width="18" height="23" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 21.25V18.75H2.5V10C2.5 8.27083 3.02083 6.73438 4.0625 5.39062C5.10417 4.04688 6.45833 3.16667 8.125 2.75V1.875C8.125 1.35417 8.30729 0.911458 8.67188 0.546875C9.03646 0.182292 9.47917 0 10 0C10.5208 0 10.9635 0.182292 11.3281 0.546875C11.6927 0.911458 11.875 1.35417 11.875 1.875V2.75C13.5417 3.16667 14.8958 4.04688 15.9375 5.39062C16.9792 6.73438 17.5 8.27083 17.5 10V18.75H20V21.25H0ZM10 25C9.3125 25 8.72396 24.7552 8.23438 24.2656C7.74479 23.776 7.5 23.1875 7.5 22.5H12.5C12.5 23.1875 12.2552 23.776 11.7656 24.2656C11.276 24.7552 10.6875 25 10 25Z" fill="#1A1A1A" />

                    </svg>
                </div>

                {/* Profile Icon */}
                <div className="p-4 cursor-pointer lg:flex" onClick={() => handleClick('Profile')}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 10C8.625 10 7.44792 9.51042 6.46875 8.53125C5.48958 7.55208 5 6.375 5 5C5 3.625 5.48958 2.44792 6.46875 1.46875C7.44792 0.489583 8.625 0 10 0C11.375 0 12.5521 0.489583 13.5312 1.46875C14.5104 2.44792 15 3.625 15 5C15 6.375 14.5104 7.55208 13.5312 8.53125C12.5521 9.51042 11.375 10 10 10ZM0 20V16.5C0 15.7917 0.182292 15.1406 0.546875 14.5469C0.911458 13.9531 1.39583 13.5 2 13.1875C3.29167 12.5417 4.60417 12.0573 5.9375 11.7344C7.27083 11.4115 8.625 11.25 10 11.25C11.375 11.25 12.7292 11.4115 14.0625 11.7344C15.3958 12.0573 16.7083 12.5417 18 13.1875C18.6042 13.5 19.0885 13.9531 19.4531 14.5469C19.8177 15.1406 20 15.7917 20 16.5V20H0Z" fill="#1A1A1A" />

                    </svg>
                </div>
            </nav>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal} // Close modal when clicking on the overlay
                >
                    <div
                        className="bg-white p-6 rounded-md shadow-md w-full max-w-xl relative animate-slide-down"
                        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing the modal when interacting with modal content
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            &times;
                        </button>

                        <WalletRecharge /> {/* Rendering WalletRecharge component */}
                    </div>
                </div>
            )}

        </>
    );
};

export default Navbar;





