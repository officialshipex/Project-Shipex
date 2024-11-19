import React from "react";
// import Navbar from "../Common/NavBar";
// import Sidebar from "../Common/SideBar";

const Settings = () => {
  const sections = [
    {
      title: "Company Set Up",
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
      items: [
        {
          name: "Courier Priority",
          description:
            "Set your courier priority ranking for auto courier assignment.",
        },
        {
          name: "Courier Selection",
          description:
            "Activate or deactivate couriers and block/unblock RTO or COD as needed.",
        },
        {
          name: "Courier Rules",
          description:
            "Gain more control by creating custom courier rules for specific scenarios.",
        },
        {
          name: "Courier View Log",
          description:
            "Records of courier activation and deactivation actions.",
        },
      ],
    },
    {
      title: "Seller Remittance",
      items: [
        {
          name: "Bank Details",
          description:
            "Add bank account details where your COD is to be remitted.",
        },
        {
          name: "Early COD Remittance",
          description: "Guaranteed early COD remittance within 2-4 days.",
        },
        {
          name: "Postpaid Plan",
          description:
            "Convert COD remittance into credits for uninterrupted shipping.",
        },
      ],
    },
    {
      title: "Return and Refund",
      items: [
        {
          name: "Return Settings",
          description:
            "Set up and enable return settings as per your preferences.",
        },
        {
          name: "Refund Settings",
          description:
            "Set up and enable refund settings as per your preferences.",
        },
      ],
    },
    {
      title: "Additional Settings",
      items: [
        {
          name: "Shipment Features",
          description: "Manage orders and shipments with advanced controls.",
        },
        {
          name: "Manage User",
          description: "Create roles and give access to selected functions.",
        },
        {
          name: "Reports",
          description: "Add emails to receive business communications.",
        },
        {
          name: "Webhooks",
          description: "Set up webhooks for real-time shipment updates.",
        },
        {
          name: "API Users",
          description: "Add or update API users and manage roles.",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 text-white p-4 hidden md:block">
        {/* <Sidebar /> */}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="p-6">{/* <Navbar /> */}</div>

        {/* Main Content */}
        <div className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Settings</h1>
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {section.title}
                </h2>
                {/* Reduced the width by using narrower columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col bg-gray-50 p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                      <h3 className="text-base font-medium text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {item.description}
                      </p>
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
