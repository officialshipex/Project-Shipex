import React, { useState } from "react";
// import NavBar from "../Common/NavBar";
// import Sidebar from "../Common/Sidebar";

const BillingList = () => {
  const [selectedStatus, setSelectedStatus] = useState("Shipping Charges");

  // Sample data for Shipping Charges
  const shippingChargesData = [
    {
      orderId: "75847594",
      awbNumber: "ABS473982",
      courier: "Ecom express",
      shipmentStatus: "Pickup generated",
      awbAssignedDate: "05 Aug, 2024",
      appliedWeightCharges: "399",
      excessWeightCharges: "0",
      holdOnAmount: "0.0",
      totalFreightCharge: "399",
      endDate: "15 Aug, 2024",
      invoiceDueDate: "10 Sep, 2024",
    },
    {
      orderId: "75847594",
      awbNumber: "ABS473982",
      courier: "Ecom express",
      shipmentStatus: "Pickup generated",
      awbAssignedDate: "05 Aug, 2024",
      appliedWeightCharges: "399",
      excessWeightCharges: "0",
      holdOnAmount: "0.0",
      totalFreightCharge: "399",
      endDate: "15 Aug, 2024",
      invoiceDueDate: "10 Sep, 2024",
    },
  ];

  // Sample data for COD Remittance
  const codRemittanceData = [
    {
      date: "Wed, Aug 14 2024",
      crfId: "6644854",
      utr: "CMS6546743156",
      codAvailable: "₹ 5680",
      freightCharges: "₹ 5680",
      earlyCodCharges: "₹ 5680",
      rtoReversalAmount: "₹ 5680",
      adjustedAmount: "N/A",
      remittanceAccount: "₹ 5680",
      remittanceMethod: "Prepaid",
    },
    {
      date: "Wed, Aug 14 2024",
      crfId: "6644854",
      utr: "CMS6546743156",
      codAvailable: "₹ 5680",
      freightCharges: "₹ 5680",
      earlyCodCharges: "₹ 5680",
      rtoReversalAmount: "₹ 5680",
      adjustedAmount: "N/A",
      remittanceAccount: "₹ 5680",
      remittanceMethod: "Prepaid",
    },
  ];

  // Sample data for Invoices
  const invoicesData = [
    {
      invoiceId: "SIS47583974",
      invoiceDate: "2024-07-30 22:24",
      dueDate: "2024-08-06",
      total: "1755.90",
      status: "Unpaid",
    },
    {
      invoiceId: "SIS47583974",
      invoiceDate: "2024-07-30 22:24",
      dueDate: "2024-08-06",
      total: "1755.90",
      status: "Unpaid",
    },
  ];

  // Sample data for Passbook
  const passbookData = [
    {
      date: "05-Aug-2024 11:04",
      channelOrderId: "456644",
      awbCode: "ABG638743",
      amount: "1755.90",
      availableBalance: "1755.90",
      description: "Forward charges Applied",
    },
    {
      date: "05-Aug-2024 11:04",
      channelOrderId: "456644",
      awbCode: "ABG638743",
      amount: "1755.90",
      availableBalance: "1755.90",
      description: "Forward charges Applied",
    },
  ];

  // Sample data for Credit Receipt
  const creditReceiptData = [
    {
      noteNumber: "DASDA5DAS46D5",
      noteDate: "2024-05-03 15:03:08",
      total: "₹1050.00",
    },
    {
      noteNumber: "DASDA5DAS46D5",
      noteDate: "2024-05-03 15:03:08",
      total: "₹1050.00",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <NavBar /> */}
        <div className="container mx-auto mt-4 bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Billing</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center mb-4 border-b">
            {["Shipping Charges", "COD Remittance", "Invoices", "Passbook", "Credit Receipt"].map((status, index) => (
              <button
                key={index}
                className={`py-2 px-4 text-sm font-medium ${
                  selectedStatus === status
                    ? "text-gray-600 border-b-2 border-gray-600"
                    : "text-gray-500"
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Shipping Charges Table */}
          {selectedStatus === "Shipping Charges" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {[
                      "Order ID",
                      "AWB Number",
                      "Courier",
                      "Shipment Status",
                      "AWB Assigned Date",
                      "Applied Weight Charges ₹",
                      "Excess Weight Charges ₹",
                      "Hold On Amount ₹",
                      "Total Freight Charge ₹",
                      "End Date",
                      "Invoice Due Date",
                    ].map((header, index) => (
                      <th key={index} className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shippingChargesData.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{order.orderId}</td>
                      <td className="py-3 px-4">{order.awbNumber}</td>
                      <td className="py-3 px-4">{order.courier}</td>
                      <td className="py-3 px-4">{order.shipmentStatus}</td>
                      <td className="py-3 px-4">{order.awbAssignedDate}</td>
                      <td className="py-3 px-4">{order.appliedWeightCharges}</td>
                      <td className="py-3 px-4">{order.excessWeightCharges}</td>
                      <td className="py-3 px-4">{order.holdOnAmount}</td>
                      <td className="py-3 px-4">{order.totalFreightCharge}</td>
                      <td className="py-3 px-4">{order.endDate}</td>
                      <td className="py-3 px-4">{order.invoiceDueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* COD Remittance Table */}
          {selectedStatus === "COD Remittance" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {[
                      "Date",
                      "CRF ID",
                      "UTR",
                      "COD available",
                      "Freight Charges From COD",
                      "Early COD Charges",
                      "RTO Reversal Amount",
                      "Adjusted Amount",
                      "Remittance Account",
                      "Remittance Method",
                    ].map((header, index) => (
                      <th key={index} className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {codRemittanceData.map((remittance, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{remittance.date}</td>
                      <td className="py-3 px-4 text-[#0BAA72]">{remittance.crfId}</td>
                      <td className="py-3 px-4">{remittance.utr}</td>
                      <td className="py-3 px-4 text-[#0BAA72]">{remittance.codAvailable}</td>
                      <td className="py-3 px-4">{remittance.freightCharges}</td>
                      <td className="py-3 px-4">{remittance.earlyCodCharges}</td>
                      <td className="py-3 px-4">{remittance.rtoReversalAmount}</td>
                      <td className="py-3 px-4">{remittance.adjustedAmount}</td>
                      <td className="py-3 px-4">{remittance.remittanceAccount}</td>
                      <td className="py-3 px-4">{remittance.remittanceMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Invoices Table */}
          {selectedStatus === "Invoices" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {["Invoice ID", "Invoice Date", "Due Date", "Total (₹)", "Status", "Action"].map((header, index) => (
                      <th key={index} className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoicesData.map((invoice, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{invoice.invoiceId}</td>
                      <td className="py-3 px-4">{invoice.invoiceDate}</td>
                      <td className="py-3 px-4">{invoice.dueDate}</td>
                      <td className="py-3 px-4">{invoice.total}</td>
                      <td className="py-3 px-4">
                        <span className="bg-red-500 text-white px-2 py-1 rounded">{invoice.status}</span>
                      </td>
                      <td className="py-3 px-4 text-[#0BAA72] cursor-pointer">View Invoice</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Passbook Table */}
          {selectedStatus === "Passbook" && (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {["Current Usable Balance ₹ 5680", "Balance On Hold ₹ 5680", "Total Balance ₹ 5680"].map((balance, index) => (
                  <div
                    key={index}
                    className="bg-green-100 p-4 rounded text-center font-semibold text-gray-700"
                  >
                    {balance}
                  </div>
                ))}
              </div>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {["Date", "Channel Order ID", "AWB Code", "Amount (₹)", "Available Balance(₹)", "Description"].map((header, index) => (
                      <th key={index} className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {passbookData.map((passbook, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{passbook.date}</td>
                      <td className="py-3 px-4">{passbook.channelOrderId}</td>
                      <td className="py-3 px-4">{passbook.awbCode}</td>
                      <td className="py-3 px-4">{passbook.amount}</td>
                      <td className="py-3 px-4">{passbook.availableBalance}</td>
                      <td className="py-3 px-4">{passbook.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Credit Receipt Table */}
          {selectedStatus === "Credit Receipt" && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {["Note Number", "Note Date", "Total (₹)", "Action"].map((header, index) => (
                      <th key={index} className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creditReceiptData.map((receipt, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{receipt.noteNumber}</td>
                      <td className="py-3 px-4">{receipt.noteDate}</td>
                      <td className="py-3 px-4">{receipt.total}</td>
                      <td className="py-3 px-4 text-[#0BAA72] cursor-pointer">View Receipt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingList;