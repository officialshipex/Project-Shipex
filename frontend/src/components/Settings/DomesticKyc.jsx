import React from "react";

const DomesticKYC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <main className="w-full lg:w-1/3 ml-0 lg:ml-24  lg:mt-16 px-4 lg:px-0">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 flex items-center space-x-2 sm:space-x-1 sm:flex-wrap ">
          <span className="text-green-500 font-medium">Settings</span>
          <span>&gt;</span>
          <span className="text-gray-700 font-medium">Company Setup</span>
          <span>&gt;</span>
          <span className="text-gray-700 font-medium">Company Details</span>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-3/5 bg-white shadow-md p-2 h-auto rounded-md mb-4">
          <nav className="flex flex-col">
            <ul className="space-y-1 text-gray-600">
              <li className="hover:text-green-500 cursor-pointer font-bold text-sm">
                COMPANY SETUP
              </li>
              <li className="bg-green-100 text-green-500 py-1.5 px-3 w-full text-left font-medium rounded-md text-sm">
                Company Details
              </li>

              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Domestic KYC
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Pick Up Address
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Labels
              </li>
              <li className="hover:text-green-500 py-1.5 px-3 cursor-pointer text-sm">
                Billing, Invoice, & GSTIN
              </li>
            </ul>
          </nav>
        </aside>
      </main>

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-[#F5FDFA] rounded-lg shadow-sm border border-gray-200 lg:mt-24 ml-0  p-4">
        {/* Title Section */}
        <div className="p-6  border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">Domestic KYC</h1>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-gray-200 rounded-lg p-4 mx-6 my-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full h-8 w-8 flex justify-center items-center text-white font-bold">
              ✓
            </div>
            <div className="ml-4">
              <p className="text-green-600 font-medium">Congratulations</p>
              <p className="text-sm text-gray-600">
                Your KYC details have been successfully verified.
              </p>
            </div>
          </div>
        </div>

        {/* KYC Details Section */}
        <div className="bg-gray-50 border rounded-lg flex items-center p-6 mb-4">
          {/* Left Brown Box */}
          <div className="w-24 h-24 bg-[#947171] rounded-lg mr-6"></div>

          {/* Main Content */}
          <div className="bg-gray-50 border rounded-lg flex-grow p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 font-medium">
                KYC Status:{" "}
                <span className="font-bold text-green-500">Verified</span>
              </p>
              <p className="text-sm text-gray-600">
                Verified on: <span className="font-bold">Oct 8, 2023</span>
              </p>
              <p className="text-sm text-gray-600">
                Current business type:{" "}
                <span className="font-bold">Sole Proprietor</span>
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Verification method used:{" "}
              <span className="font-bold">Express KYC</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-4 mt-4">
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  Aadhar Card:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="69368390r"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  GST Number:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="06LDKCX6107Z439"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">Pan Card:</p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="CF46AR45"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">CIN:</p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="U53220HR2024PTX112214"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  Account Number:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="567786879975"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Details Section */}

        <div className="bg-gray-50 border rounded-lg flex items-center p-4   mb-4">
          {/* Left Brown Box */}
          <div className="w-24 h-24 bg-[#947171] rounded-lg mr-6"></div>

          {/* Main Content */}
          <div className="bg-gray-50 border rounded-lg flex-grow p-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 font-medium">
                KYC Status:{" "}
                <span className="font-bold text-red-500">Pending</span>
              </p>
              <p className="text-sm text-gray-600">
                Verified on: <span className="font-bold">Oct 8, 2023</span>
              </p>
              <p className="text-sm text-gray-600">
                Current business type:{" "}
                <span className="font-bold">Sole Proprietor</span>
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Verification method used:{" "}
              <span className="font-bold">Express KYC</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mt-4">
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  Aadhar Card:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="69368390r"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  GST Number:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="06LDKCX6107Z439"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">Pan Card:</p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="CF46AR45"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">CIN:</p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="U53220HR2024PTX112214"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-1">
                <p className="text-sm text-gray-500 flex-shrink-0">
                  Account Number:
                </p>
                <input
                  type="text"
                  className="flex-grow text-green-600 outline-none"
                  defaultValue="567786879975"
                />
                {/* Info Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66667 10.0661H7V7.39941H6.33333M7 4.73275H7.00667M13 7.39941C13 8.18735 12.8448 8.96756 12.5433 9.69551C12.2417 10.4235 11.7998 11.0849 11.2426 11.6421C10.6855 12.1992 10.0241 12.6412 9.2961 12.9427C8.56815 13.2442 7.78793 13.3994 7 13.3994C6.21207 13.3994 5.43185 13.2442 4.7039 12.9427C3.97595 12.6412 3.31451 12.1992 2.75736 11.6421C2.20021 11.0849 1.75825 10.4235 1.45672 9.69551C1.15519 8.96756 1 8.18735 1 7.39941C1 5.80812 1.63214 4.28199 2.75736 3.15677C3.88258 2.03156 5.4087 1.39941 7 1.39941C8.5913 1.39941 10.1174 2.03156 11.2426 3.15677C12.3679 4.28199 13 5.80812 13 7.39941Z"
                    stroke="black"
                    stroke-opacity="0.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button className="bg-white text-gray-700 border-2 border-gray-200 px-6 py-2 rounded-md flex items-center space-x-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomesticKYC;
