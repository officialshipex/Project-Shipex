import React, { useState } from "react";
import axios from "axios";

function Paytm() {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    customerId: "",
    customerEmail: "",
    customerPhone: "",
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const initiatePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/v1/paytm/paynow", paymentData);
      const { paytmURL, params } = response.data;

      const form = document.createElement("form");
      form.action = paytmURL;
      form.method = "POST";

      Object.keys(params).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Paytm Payment</h2>
        <form onSubmit={initiatePayment} className="space-y-4">
          <input
            type="text"
            name="amount"
            placeholder="Amount"
            value={paymentData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="customerId"
            placeholder="Customer ID"
            value={paymentData.customerId}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Email"
            value={paymentData.customerEmail}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="customerPhone"
            placeholder="Phone Number"
            value={paymentData.customerPhone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default Paytm;
