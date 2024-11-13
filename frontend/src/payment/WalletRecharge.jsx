








// import React from 'react'

// const Paytm = () => {

//   function isDate(val) {
//     return Object.prototype.toString.call(val) === '[object Date]'
//   }

//   function isObj(val) {
//     return typeof val === 'object'
//   }

//   function stringifyValue(val) {
//     if (isObj(val) && !isDate(val)) {
//       return JSON.stringify(val)
//     } else {
//       return val
//     }
//   }

//   function buildForm({ action, params }) {
//     const form = document.createElement('form')
//     form.setAttribute('method', 'post')
//     form.setAttribute('action', action)

//     Object.keys(params).forEach(key => {
//       const input = document.createElement('input')
//       input.setAttribute('type', 'hidden')
//       input.setAttribute('name', key)
//       input.setAttribute('value', stringifyValue(params[key]))
//       form.appendChild(input)
//     })

//     return form
//   }

//   function post(details) {
//     const form = buildForm(details);

//     // Append form to body and submit in the same window
//     document.body.appendChild(form);
//     form.submit();
//     form.remove();
//   }

//   const getData = (data) => {
//     return fetch(`http://localhost:5000/v1/paytm/paynow`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     }).then(response => response.json()).catch(err => console.log(err))
//   }

//   const makePayment = () => {
//     getData({ amount: 500, email: 'abc@gmail.com' }).then(response => {
//       console.log(response)
//       var information = {
//         action: "https://securegw.paytm.in/order/process",
//         params: response
//       }
//       post(information)
//     })
//   }

//   return (
//     <div>
//       <button onClick={makePayment}>PAY USING PAYTM</button>
//     </div>
//   )
// }

// export default Paytm




import React, { useState } from 'react';

const WalletRecharge = () => {
  const [amount, setAmount] = useState(1000);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(0);
  const [showCoupons, setShowCoupons] = useState(false);

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
  console.log(data)
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
  getData({ amount ,email:"abc@gmail.com"}).then(response => {
    // console.log(response)
    var information = {
      action: "https://securegw.paytm.in/order/process",
      params: response
    }
    post(information)
  })
}

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleCouponApply = () => {
    // Logic to apply coupon
    // For now, let's assume no coupon applied
    setAppliedCoupon(0);
  };

  // const handleContinuePayment = () => {
  //   // Logic to proceed to payment
  //   alert(`Proceeding to payment with ₹${amount - appliedCoupon}`);
  // };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recharge Your Wallet</h2>
      <p className="text-gray-500 mb-6">
        Current wallet amount <span className="text-green-600 font-semibold">₹ 46584</span>
      </p>

      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <label className="block text-gray-700 font-medium mb-2">Enter Amount in multiples of 100 below</label>
        <input
          type="number"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
          min={500}
          max={5000000}
          step={100}
          value={amount}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
        />
        <p className="text-gray-500 text-sm">min value: ₹ 500 & max value: ₹ 5000000</p>

        <div className="flex justify-between mt-4">
          {[500, 1000, 2500, 5000].map((val) => (
            <button
              key={val}
              className={`px-4 py-2 rounded-full border ${amount === val ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'} focus:outline-none`}
              onClick={() => handleAmountChange(val)}
            >
              ₹ {val}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Have a coupon</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter coupon code here"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleCouponApply}
            className="bg-green-500 text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            Apply
          </button>
        </div>
        <button
          className="text-green-600 mt-2 text-sm focus:outline-none"
          onClick={() => setShowCoupons(!showCoupons)}
        >
          View Available coupons {showCoupons ? '▲' : '▼'}
        </button>
        {showCoupons && (
          <div className="mt-2 p-2 bg-gray-100 rounded-lg text-sm">
            <p>No coupons available</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between text-gray-700 mb-1">
          <span>Recharge Amount</span>
          <span>₹ {amount}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-1">
          <span>Coupon code amount</span>
          <span>₹ {appliedCoupon}</span>
        </div>
        <div className="flex justify-between font-medium text-gray-800">
          <span>Total amount to be credited</span>
          <span>₹ {amount - appliedCoupon}</span>
        </div>
      </div>

      <div className="text-center font-semibold text-gray-700 mb-4">
        Recharge Amount <span className="text-gray-900">₹ {amount - appliedCoupon}</span>
      </div>

      <button
        onClick={makePayment}
        className="w-full bg-green-500 text-white p-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default WalletRecharge;
