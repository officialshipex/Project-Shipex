import React from 'react'

const DTDCsurface = (props) => {

  return (
    <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">{props.heading}</h2>
      <p className="text-sm mb-2 font-semibold">
        {`Use the following instructions to integrate your ${props.heading} Account Credentials:`}
      </p>
      <p className="text-sm mb-2 font-semibold">
        Enter your following Credentials
      </p>
      <ul className="text-sm list-disc ml-4 mb-2 border-b pb-6">
        <li>User name</li>
        <li>Password</li>
        <li>Token</li>
        <li>Api key</li>
        <li>Customer Code</li>
        <li>Service Type id</li>
        <li>Tracking Api key</li>
      </ul>

      <ul className="text-sm list-disc ml-4 mb-2">
        <li>For more information please contact your DTDC Surface domestic account number.</li>
        <li>To use Shipex Serviceability please click on the Shipex Serviceability field.</li>
        <li>To use your Pincode Serviceability download the attached sample file and upload the final sheet</li>

      </ul>
    </div>
  )
}

export default DTDCsurface