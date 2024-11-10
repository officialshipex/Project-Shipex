// import React, { useState } from "react";
// import axios from "axios";

// function Paytm() {
//   const [paymentData, setPaymentData] = useState({
//     amount: "",
//     custId: "",
//     email: "",
//     mobile_no: "",
//   });

//   const handleChange = (e) => {
//     setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
//   };

//   const initiatePayment = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/v1/paytm/paynow", paymentData);
//       const { paytmURL, params } = response.data;
//       console.log(params)

//       const form = document.createElement("form");
//       form.action = paytmURL;
//       form.method = "POST"; 

//       Object.keys(params).forEach((key) => {
//         const input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = params[key];
//         form.appendChild(input);
//       });

//       document.body.appendChild(form);
//       form.submit();
//     } catch (error) {
//       console.error("Payment initiation failed", error);
//       alert("Payment initiation failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Paytm Payment</h2>
//         <form onSubmit={initiatePayment} className="space-y-4">
//           <input
//             type="text"
//             name="amount"
//             placeholder="Amount"
//             value={paymentData.amount}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="text"
//             name="customerId"
//             placeholder="Customer ID"
//             value={paymentData.customerId}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="email"
//             name="customerEmail"
//             placeholder="Email"
//             value={paymentData.customerEmail}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="text"
//             name="customerPhone"
//             placeholder="Phone Number"
//             value={paymentData.customerPhone}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//           >
//             Pay Now
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Paytm;








import React from 'react'

const Paytm = () => {

  function isDate(val) {
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  function isObj(val) {
    return typeof val === 'object'
  }

  function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }

  function buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', stringifyValue(params[key]))
      form.appendChild(input)
    })

    return form
  }

  function post(details) {
    const form = buildForm(details);

    // Append form to body and submit in the same window
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  const getData = (data) => {
    return fetch(`http://localhost:5000/v1/paytm/paynow`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).catch(err => console.log(err))
  }

  const makePayment = () => {
    getData({ amount: 500, email: 'abc@gmail.com' }).then(response => {
      console.log(response)
      var information = {
        action: "https://securegw.paytm.in/order/process",
        params: response
      }
      post(information)
    })
  }

  return (
    <div>
      <button onClick={makePayment}>PAY USING PAYTM</button>
    </div>
  )
}

export default Paytm

