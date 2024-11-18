import React from "react";

const SupportArticle = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 lg:p-16">
        <div className="rounded-lg  p-6 md:p-8">
          {/* Header Section */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Support
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Get help by creating or reading help articles.
          </p>

          {/* Button Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="flex items-center justify-start px-4 py-3 w-full sm:w-60 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100">
              <svg
                width="30"
                height="22"
                viewBox="0 0 34 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M7.00065 20.6665H18.6673V15.6665H7.00065V20.6665ZM22.0007 20.6665H27.0007V7.33317H22.0007V20.6665ZM7.00065 12.3332H18.6673V7.33317H7.00065V12.3332ZM3.66732 27.3332C2.75065 27.3332 1.96593 27.0068 1.31315 26.354C0.660373 25.7012 0.333984 24.9165 0.333984 23.9998V3.99984C0.333984 3.08317 0.660373 2.29845 1.31315 1.64567C1.96593 0.992893 2.75065 0.666504 3.66732 0.666504H30.334C31.2507 0.666504 32.0354 0.992893 32.6882 1.64567C33.3409 2.29845 33.6673 3.08317 33.6673 3.99984V23.9998C33.6673 24.9165 33.3409 25.7012 32.6882 26.354C32.0354 27.0068 31.2507 27.3332 30.334 27.3332H3.66732Z"
                  fill="#395BD0"
                />
              </svg>
              Help Articles
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by article name"
              className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Articles List */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-4 text-left">Articles</h3>
            <div className="w-full sm:w-3/4 lg:w-4/5 text-left">
              <ul className="space-y-2">
                {[
                  "How can I track my shipment?",
                  "What should I do if my shipment is delayed?",
                  "How do I estimate shipping costs?",
                  "What documentation is required for international shipping?",
                  "What is the process for returning a shipment?",
                  "What are the weight and size restrictions for shipping packages?",
                  "How do I handle damaged or lost shipments?",
                  "How can I schedule a pickup for my shipment?",
                  "What are the best practices for packaging my shipment?",
                  "What payment methods are accepted for shipping services?",
                ].map((article, index) => (
                  <li
                    key={index}
                    className="flex items-center p-3 border-t border-b border-gray-300  hover:bg-gray-100"
                  >
                    <svg
                      width="22"
                      height="16"
                      viewBox="0 0 22 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                    >
                      <path
                        d="M3 10.225H4.125L4.7 8.575H7.3L7.9 10.225H9L6.575 3.775H5.425L3 10.225ZM5.025 7.65L5.975 4.975H6.025L6.975 7.65H5.025ZM13 5.9V4.2C13.55 3.96667 14.1125 3.79167 14.6875 3.675C15.2625 3.55833 15.8667 3.5 16.5 3.5C16.9333 3.5 17.3583 3.53333 17.775 3.6C18.1917 3.66667 18.6 3.75 19 3.85V5.45C18.6 5.3 18.1958 5.1875 17.7875 5.1125C17.3792 5.0375 16.95 5 16.5 5C15.8667 5 15.2583 5.07917 14.675 5.2375C14.0917 5.39583 13.5333 5.61667 13 5.9ZM13 11.4V9.7C13.55 9.46667 14.1125 9.29167 14.6875 9.175C15.2625 9.05833 15.8667 9 16.5 9C16.9333 9 17.3583 9.03333 17.775 9.1C18.1917 9.16667 18.6 9.25 19 9.35V10.95C18.6 10.8 18.1958 10.6875 17.7875 10.6125C17.3792 10.5375 16.95 10.5 16.5 10.5C15.8667 10.5 15.2583 10.575 14.675 10.725C14.0917 10.875 13.5333 11.1 13 11.4ZM13 8.65V6.95C13.55 6.71667 14.1125 6.54167 14.6875 6.425C15.2625 6.30833 15.8667 6.25 16.5 6.25C16.9333 6.25 17.3583 6.28333 17.775 6.35C18.1917 6.41667 18.6 6.5 19 6.6V8.2C18.6 8.05 18.1958 7.9375 17.7875 7.8625C17.3792 7.7875 16.95 7.75 16.5 7.75C15.8667 7.75 15.2583 7.82917 14.675 7.9875C14.0917 8.14583 13.5333 8.36667 13 8.65ZM12 13.05C12.7333 12.7 13.4708 12.4375 14.2125 12.2625C14.9542 12.0875 15.7167 12 16.5 12C17.1 12 17.6875 12.05 18.2625 12.15C18.8375 12.25 19.4167 12.4 20 12.6V2.7C19.45 2.46667 18.8792 2.29167 18.2875 2.175C17.6958 2.05833 17.1 2 16.5 2C15.7167 2 14.9417 2.1 14.175 2.3C13.4083 2.5 12.6833 2.8 12 3.2V13.05ZM11 16C10.2 15.3667 9.33333 14.875 8.4 14.525C7.46667 14.175 6.5 14 5.5 14C4.8 14 4.1125 14.0917 3.4375 14.275C2.7625 14.4583 2.11667 14.7167 1.5 15.05C1.15 15.2333 0.8125 15.225 0.4875 15.025C0.1625 14.825 0 14.5333 0 14.15V2.1C0 1.91667 0.0458333 1.74167 0.1375 1.575C0.229167 1.40833 0.366667 1.28333 0.55 1.2C1.31667 0.8 2.11667 0.5 2.95 0.3C3.78333 0.1 4.63333 0 5.5 0C6.46667 0 7.4125 0.125 8.3375 0.375C9.2625 0.625 10.15 1 11 1.5C11.85 1 12.7375 0.625 13.6625 0.375C14.5875 0.125 15.5333 0 16.5 0C17.3667 0 18.2167 0.1 19.05 0.3C19.8833 0.5 20.6833 0.8 21.45 1.2C21.6333 1.28333 21.7708 1.40833 21.8625 1.575C21.9542 1.74167 22 1.91667 22 2.1V14.15C22 14.5333 21.8375 14.825 21.5125 15.025C21.1875 15.225 20.85 15.2333 20.5 15.05C19.8833 14.7167 19.2375 14.4583 18.5625 14.275C17.8875 14.0917 17.2 14 16.5 14C15.5 14 14.5333 14.175 13.6 14.525C12.6667 14.875 11.8 15.3667 11 16Z"
                        fill="#0CBB7D"
                      />
                    </svg>

                    {article}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportArticle;
