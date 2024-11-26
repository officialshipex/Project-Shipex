import React from "react";

const Settings = () => {
  const sections = [
    {
      title: "Company Set Up",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 27.5V6.5H6.5V0.5H21.5V12.5H27.5V27.5H15.5V21.5H12.5V27.5H0.5ZM3.5 24.5H6.5V21.5H3.5V24.5ZM3.5 18.5H6.5V15.5H3.5V18.5ZM3.5 12.5H6.5V9.5H3.5V12.5ZM9.5 18.5H12.5V15.5H9.5V18.5ZM9.5 12.5H12.5V9.5H9.5V12.5ZM9.5 6.5H12.5V3.5H9.5V6.5ZM15.5 18.5H18.5V15.5H15.5V18.5ZM15.5 12.5H18.5V9.5H15.5V12.5ZM15.5 6.5H18.5V3.5H15.5V6.5ZM21.5 24.5H24.5V21.5H21.5V24.5ZM21.5 18.5H24.5V15.5H21.5V18.5Z"
            fill="#00C4A4"
          />
        </svg>
      ),
      items: [
        {
          name: "Billing, Invoice, & GSTIN",
          description:
            "Add your billing address, invoice preferences, or set up GSTIN invoicing.",
        },
        {
          name: "Company Details",
          description:
            "View, edit, and update the company-related details like brand name, email, logo.",
        },
        {
          name: "Pickup Addresses",
          description: "Manage all your pickup addresses here.",
        },
        {
          name: "Domestic KYC",
          description:
            "Submit Know Your Customer (eKYC) information for uninterrupted shipping.",
        },
      ],
    },
    {
      title: "Courier Management",
      icon: (
        <svg
          width="30"
          height="26"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.5 25.5375C22.3 25.5375 22.1 25.5125 21.9 25.4625C21.7 25.4125 21.5125 25.325 21.3375 25.2L16.8375 22.575C16.4875 22.375 16.2188 22.1062 16.0312 21.7687C15.8438 21.4312 15.75 21.0625 15.75 20.6625V15.375C15.75 14.975 15.8438 14.6062 16.0312 14.2687C16.2188 13.9312 16.4875 13.6625 16.8375 13.4625L21.3375 10.8375C21.5125 10.7125 21.7 10.625 21.9 10.575C22.1 10.525 22.3 10.5 22.5 10.5C22.7 10.5 22.8937 10.5312 23.0812 10.5937C23.2687 10.6562 23.45 10.7375 23.625 10.8375L28.125 13.4625C28.475 13.6625 28.75 13.9312 28.95 14.2687C29.15 14.6062 29.25 14.975 29.25 15.375V20.6625C29.25 21.0625 29.15 21.4312 28.95 21.7687C28.75 22.1062 28.475 22.375 28.125 22.575L23.625 25.2C23.45 25.3 23.2687 25.3812 23.0812 25.4437C22.8937 25.5062 22.7 25.5375 22.5 25.5375ZM12 12C10.35 12 8.9375 11.4125 7.7625 10.2375C6.5875 9.0625 6 7.65 6 6C6 4.35 6.5875 2.9375 7.7625 1.7625C8.9375 0.5875 10.35 0 12 0C13.65 0 15.0625 0.5875 16.2375 1.7625C17.4125 2.9375 18 4.35 18 6C18 7.65 17.4125 9.0625 16.2375 10.2375C15.0625 11.4125 13.65 12 12 12ZM0 24V19.8C0 18.975 0.2125 18.2 0.6375 17.475C1.0625 16.75 1.65 16.2 2.4 15.825C3.675 15.175 5.1125 14.625 6.7125 14.175C8.3125 13.725 10.075 13.5 12 13.5H12.525C12.675 13.5 12.825 13.525 12.975 13.575C12.775 14.025 12.6063 14.4937 12.4688 14.9812C12.3312 15.4687 12.225 15.975 12.15 16.5H12C10.225 16.5 8.63125 16.725 7.21875 17.175C5.80625 17.625 4.65 18.075 3.75 18.525C3.525 18.65 3.34375 18.825 3.20625 19.05C3.06875 19.275 3 19.525 3 19.8V21H12.45C12.6 21.525 12.8 22.0437 13.05 22.5562C13.3 23.0687 13.575 23.55 13.875 24H0ZM12 9C12.825 9 13.5313 8.70625 14.1188 8.11875C14.7063 7.53125 15 6.825 15 6C15 5.175 14.7063 4.46875 14.1188 3.88125C13.5313 3.29375 12.825 3 12 3C11.175 3 10.4688 3.29375 9.88125 3.88125C9.29375 4.46875 9 5.175 9 6C9 6.825 9.29375 7.53125 9.88125 8.11875C10.4688 8.70625 11.175 9 12 9ZM18.975 14.775L22.5 16.8375L26.025 14.775L22.5 12.75L18.975 14.775ZM23.625 22.575L27 20.625V16.5L23.625 18.4875V22.575ZM18 20.625L21.375 22.6125V18.525L18 16.5375V20.625Z"
            fill="#00C4A4"
          />
        </svg>
      ),
      items: [
        {
          name: "Courier Priority",
          description:
            "Set your courier priority ranking on basis of which they will be assigned to orders during bulk courier assignment",
        },
        {
          name: "Courier Selection",
          description:
            "Activate or deactivate couriers, and block/unblock RTO or ODA pincodes for individual couriers",
        },
        {
          name: "Courier Rules",
          description:
            "Gain more shipping control by creating custom courier rules which will be auto-applied during bulk shipments",
        },

        {
          name: "Courier View Log",
          description: "Records of courier activation & deactivation actions",
        },
      ],
    },
    {
      title: "Seller Remittance",
      icon: (
        <svg
          width="28"
          height="30"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 30C3.75 30 2.6875 29.5625 1.8125 28.6875C0.9375 27.8125 0.5 26.75 0.5 25.5V21H5V0L7.25 2.25L9.5 0L11.75 2.25L14 0L16.25 2.25L18.5 0L20.75 2.25L23 0L25.25 2.25L27.5 0V25.5C27.5 26.75 27.0625 27.8125 26.1875 28.6875C25.3125 29.5625 24.25 30 23 30H5ZM23 27C23.425 27 23.7813 26.8562 24.0688 26.5687C24.3563 26.2812 24.5 25.925 24.5 25.5V4.5H8V21H21.5V25.5C21.5 25.925 21.6438 26.2812 21.9313 26.5687C22.2188 26.8562 22.575 27 23 27ZM9.5 10.5V7.5H18.5V10.5H9.5ZM9.5 15V12H18.5V15H9.5ZM21.5 10.5C21.075 10.5 20.7188 10.3563 20.4313 10.0688C20.1438 9.78125 20 9.425 20 9C20 8.575 20.1438 8.21875 20.4313 7.93125C20.7188 7.64375 21.075 7.5 21.5 7.5C21.925 7.5 22.2813 7.64375 22.5688 7.93125C22.8563 8.21875 23 8.575 23 9C23 9.425 22.8563 9.78125 22.5688 10.0688C22.2813 10.3563 21.925 10.5 21.5 10.5ZM21.5 15C21.075 15 20.7188 14.8563 20.4313 14.5688C20.1438 14.2813 20 13.925 20 13.5C20 13.075 20.1438 12.7188 20.4313 12.4313C20.7188 12.1438 21.075 12 21.5 12C21.925 12 22.2813 12.1438 22.5688 12.4313C22.8563 12.7188 23 13.075 23 13.5C23 13.925 22.8563 14.2813 22.5688 14.5688C22.2813 14.8563 21.925 15 21.5 15ZM5 27H18.5V24H3.5V25.5C3.5 25.925 3.64375 26.2812 3.93125 26.5687C4.21875 26.8562 4.575 27 5 27Z"
            fill="#00C4A4"
          />
        </svg>
      ),
      items: [
        {
          name: "Bank Details",
          description:
            "Add bank account details where you want your COD to be remitted.",
        },
        {
          name: "Postpaid Plan",
          description:
            "Convert your COD remittance into shipping credits for uninterrupted shipping experience.",
        },
        {
          name: "Early COD Remittance",
          description:
            "Receive guaranteed early COD remittance within 2-4 days from the shipment delivered date as per chosen plan.",
        },
      ],
    },
    {
      title: "Return and Refund",
      icon: (
        <svg
          width="31"
          height="31"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="36"
            height="36"
          >
            <rect width="36" height="36" fill="white" />
          </mask>
          <g mask="url(#mask0)">
            <path
              d="M8.1 9H27.9L26.625 7.5H9.375L8.1 9ZM15 19.125L18 17.625L21 19.125V12H15V19.125ZM7.5 31.5C6.675 31.5 5.96875 31.2063 5.38125 30.6188C4.79375 30.0312 4.5 29.325 4.5 28.5V9.7875C4.5 9.4375 4.55625 9.1 4.66875 8.775C4.78125 8.45 4.95 8.15 5.175 7.875L7.05 5.5875C7.325 5.2375 7.66875 4.96875 8.08125 4.78125C8.49375 4.59375 8.925 4.5 9.375 4.5H26.625C27.075 4.5 27.5063 4.59375 27.9188 4.78125C28.3313 4.96875 28.675 5.2375 28.95 5.5875L30.825 7.875C31.05 8.15 31.2188 8.45 31.3313 8.775C31.4438 9.1 31.5 9.4375 31.5 9.7875V15C30.975 15 30.4562 15.0375 29.9437 15.1125C29.4312 15.1875 28.95 15.3375 28.5 15.5625V12H24V19.6875L21.1125 22.575L18 21L12 24V12H7.5V28.5H18V31.5H7.5ZM21 31.5V26.8875L29.2875 18.6375C29.5125 18.4125 29.7625 18.25 30.0375 18.15C30.3125 18.05 30.5875 18 30.8625 18C31.1625 18 31.45 18.0563 31.725 18.1688C32 18.2812 32.25 18.45 32.475 18.675L33.8625 20.0625C34.0625 20.2875 34.2188 20.5375 34.3313 20.8125C34.4438 21.0875 34.5 21.3625 34.5 21.6375C34.5 21.9125 34.45 22.1938 34.35 22.4813C34.25 22.7688 34.0875 23.025 33.8625 23.25L25.6125 31.5H21ZM23.25 29.25H24.675L29.2125 24.675L28.5375 23.9625L27.825 23.2875L23.25 27.825V29.25ZM28.5375 23.9625L27.825 23.2875L29.2125 24.675L28.5375 23.9625Z"
              fill="#00C4A4"
            />
          </g>
        </svg>
      ),
      items: [
        {
          name: "Return Settings",
          description:
            "Set up and enable return settings as per your preference",
        },
        {
          name: "Refund Settings",
          description:
            "Set up and enable refund settings as per your preferences",
        },
      ],
    },
    {
      title: "Additional Settings",
      icon: (
        <svg
          width="31"
          height="31"
          viewBox="0 0 31 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="36"
            height="36"
          >
            <rect width="36" height="36" fill="white" />
          </mask>
          <g mask="url(#mask0)">
            <path
              d="M22.4988 31.5H31.4988V30.2625C30.8738 29.6875 30.1738 29.25 29.3988 28.95C28.6238 28.65 27.8238 28.5 26.9988 28.5C26.1738 28.5 25.3738 28.65 24.5988 28.95C23.8238 29.25 23.1238 29.6875 22.4988 30.2625V31.5ZM26.9988 27C27.6238 27 28.1551 26.7812 28.5926 26.3438C29.0301 25.9062 29.2488 25.375 29.2488 24.75C29.2488 24.125 29.0301 23.5938 28.5926 23.1562C28.1551 22.7188 27.6238 22.5 26.9988 22.5C26.3738 22.5 25.8426 22.7188 25.4051 23.1562C24.9676 23.5938 24.7488 24.125 24.7488 24.75C24.7488 25.375 24.9676 25.9062 25.4051 26.3438C25.8426 26.7812 26.3738 27 26.9988 27ZM18.0738 12.75C16.6238 12.75 15.3863 13.2625 14.3613 14.2875C13.3363 15.3125 12.8238 16.55 12.8238 18C12.8238 19.2 13.1613 20.25 13.8363 21.15C14.5113 22.05 15.3988 22.675 16.4988 23.025C16.4988 22.45 16.5051 21.9 16.5176 21.375C16.5301 20.85 16.6363 20.375 16.8363 19.95C16.4863 19.75 16.2301 19.475 16.0676 19.125C15.9051 18.775 15.8238 18.4 15.8238 18C15.8238 17.375 16.0426 16.8438 16.4801 16.4062C16.9176 15.9688 17.4488 15.75 18.0738 15.75C18.4488 15.75 18.8051 15.8438 19.1426 16.0312C19.4801 16.2188 19.7613 16.475 19.9863 16.8C20.2613 16.675 20.5488 16.5875 20.8488 16.5375C21.1488 16.4875 21.4488 16.4625 21.7488 16.4625H23.0988C22.7738 15.3875 22.1551 14.5 21.2426 13.8C20.3301 13.1 19.2738 12.75 18.0738 12.75ZM13.8738 33L13.2738 28.2C12.9488 28.075 12.6426 27.925 12.3551 27.75C12.0676 27.575 11.7863 27.3875 11.5113 27.1875L7.04883 29.0625L2.92383 21.9375L6.78633 19.0125C6.76133 18.8375 6.74883 18.6688 6.74883 18.5063V17.4938C6.74883 17.3313 6.76133 17.1625 6.78633 16.9875L2.92383 14.0625L7.04883 6.9375L11.5113 8.8125C11.7863 8.6125 12.0738 8.425 12.3738 8.25C12.6738 8.075 12.9738 7.925 13.2738 7.8L13.8738 3H22.1238L22.7238 7.8C23.0488 7.925 23.3551 8.075 23.6426 8.25C23.9301 8.425 24.2113 8.6125 24.4863 8.8125L28.9488 6.9375L33.0738 14.0625L29.8863 16.5H26.0988C26.0738 16.375 26.0488 16.2438 26.0238 16.1063C25.9988 15.9688 25.9613 15.8375 25.9113 15.7125L29.1363 13.275L27.6738 10.725L23.9613 12.3C23.4113 11.725 22.8051 11.2438 22.1426 10.8563C21.4801 10.4688 20.7613 10.175 19.9863 9.975L19.4988 6H16.5363L16.0113 9.975C15.2363 10.175 14.5176 10.4688 13.8551 10.8563C13.1926 11.2438 12.5863 11.7125 12.0363 12.2625L8.32383 10.725L6.86133 13.275L10.0863 15.675C9.96133 16.05 9.87383 16.425 9.82383 16.8C9.77383 17.175 9.74883 17.575 9.74883 18C9.74883 18.4 9.77383 18.7875 9.82383 19.1625C9.87383 19.5375 9.96133 19.9125 10.0863 20.2875L6.86133 22.725L8.32383 25.275L12.0363 23.7C12.6363 24.325 13.3113 24.85 14.0613 25.275C14.8113 25.7 15.6238 25.975 16.4988 26.1V33H13.8738ZM21.7488 34.5C21.1238 34.5 20.5926 34.2812 20.1551 33.8438C19.7176 33.4062 19.4988 32.875 19.4988 32.25V21.75C19.4988 21.125 19.7176 20.5938 20.1551 20.1562C20.5926 19.7188 21.1238 19.5 21.7488 19.5H32.2488C32.8738 19.5 33.4051 19.7188 33.8426 20.1562C34.2801 20.5938 34.4988 21.125 34.4988 21.75V32.25C34.4988 32.875 34.2801 33.4062 33.8426 33.8438C33.4051 34.2812 32.8738 34.5 32.2488 34.5H21.7488Z"
              fill="#00C4A4"
            />
          </g>
        </svg>
      ),
      items: [
        {
          name: "Shipment Features",
          description:
            "Manage orders and shipments with advanced controls like split shipment, order verification, etc.",
        },
        {
          name: "Reports",
          description:
            "Add email ids and contact numbers to receive business & operational related communications",
        },
        {
          name: "API Users",
          description:
            "Add or Update new API user, reset their password or make user active or Inactive.",
        },
        {
          name: "Manage User",
          description:
            "Create users & give them Shipex access for selected functions based on their roles",
        },

        {
          name: "Webhooks",
          description:
            "Set up & manage webhooks for real-time shipment updates",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-20 text-white p-4 hidden md:block">
        {/* <Sidebar /> */}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6">{/* <Navbar /> */}</div>

        <div className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Settings</h1>
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-6">
                  {/* SVG Icon */}
                  <div className="mr-4">{section.icon}</div>
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-700">
                    {section.title}
                  </h2>
                </div>

                {/* Adjusted Grid with Left and Right Padding */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 px-8 ">
                  {" "}
                  {/* Added px-4 to create gap on left and right */}
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Left Content */}
                      <div className="flex flex-col">
                        {item.icon}
                        <h3 className="text-base font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {item.description}
                        </p>
                      </div>
                      {/* Right Arrow Icon */}
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
