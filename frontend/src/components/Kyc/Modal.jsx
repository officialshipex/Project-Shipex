// {
//   /* Gst Verification Modal */
// }
// {
//   isModalOpen && (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//       <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[75%] md:max-w-[45%] max-h-[95vh] flex flex-col">
//         <div className="flex flex-col items-center">
//           {/* Success Icon */}
//           <div className="bg-green-500 rounded-full p-4 mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 text-white"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           {/* Title */}
//           <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
//             GSTIN is Valid
//           </h3>
//         </div>
//         {/* Scrollable Content */}
//         <div className="overflow-y-auto flex-grow max-h-[80vh]">
//           {/* GSTIN Details */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-sm text-gray-700 w-full">
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium w-1/3 sm:w-1/4">GSTIN</span>
//               <span className="text-right flex-1">
//                 {gstNumber || "06HBDC748347953947"}
//               </span>
//             </div>
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium">GST Ref. ID</span>
//               <span className="text-right flex-1">65893</span>
//             </div>
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium w-1/3 sm:w-1/3">Tax payer type</span>
//               <span className="text-right flex-1">Regular</span>
//             </div>
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium w-1/3 sm:w-1/4">
//                 Date of Registration
//               </span>
//               <span className="text-right flex-1">2021-11-18</span>
//             </div>
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium w-1/3 sm:w-1/4">
//                 Name of Business
//               </span>
//               <span className="text-right flex-1">Shipex</span>
//             </div>
//             <div className="flex justify-between p-2 border-b border-gray-300">
//               <span className="font-medium w-1/3 sm:w-1/2">
//                 Legal Name of Business
//               </span>
//               <span className="text-right flex-1">Sandeep</span>
//             </div>
//             <div className="flex justify-between p-2">
//               <span className="font-medium w-1/3 sm:w-1/4">GSTIN Status</span>
//               <span className="text-right flex-1">Active</span>
//             </div>
//           </div>
//         </div>
//         {/* Close Button */}
//         <div className="flex justify-center w-full mt-4">
//           <button
//             className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ease-in-out text-center"
//             onClick={closeModal}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// /* OTP Modal */
// const OTPModal = ({ onClose, onConfirm }) => {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [resendTime, setResendTime] = useState(36); // initial countdown in seconds
//   useEffect(() => {
//     const timer =
//       resendTime > 0 && setInterval(() => setResendTime(resendTime - 1), 1000);
//     return () => clearInterval(timer);
//   }, [resendTime]);
//   const handleOtpChange = (element, index) => {
//     const value = element.value;
//     if (/^\d$/.test(value) || value === "") {
//       let newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       // Focus on the next input box if current is not empty
//       if (value && element.nextSibling) {
//         element.nextSibling.focus();
//       }
//     }
//   };
//   const handleConfirm = () => {
//     onConfirm(otp.join(""));
//   };

//   const handleToggleModal = () => {
//     setIsModalOpen(false)
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-6 shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Authenticate</h3>
//           <button onClick={handleToggleModal} className="text-gray-500">
//             &times;
//           </button>
//         </div>
//         <p className="text-gray-700 text-sm mb-2">
//           Enter the 6-digit OTP sent to your Aadhaar linked phone number by
//           UIDAI
//         </p>
//         <p className="text-gray-700 text-sm mb-2">Enter OTP</p>
//         <div className="flex space-x-2 justify-center mb-4">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => handleOtpChange(e.target, index)}
//               className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           ))}
//         </div>
//         <div className="flex items-center justify-between text-sm mb-4">
//           <p className="text-gray-500">
//             Resend OTP{" "}
//             {resendTime > 0 ? `(${String(resendTime).padStart(2, "0")})` : ""}
//           </p>
//           <a href="#" className="text-green-600 hover:underline">
//             Need help?
//           </a>
//         </div>
//         <p className="text-gray-500 text-xs mb-4">
//           This authentication will last only for this session.
//         </p>
//         <div className="flex justify-end space-x-2">
//           <button onClick={onClose} className="text-gray-600 px-3 py-1">
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="bg-green-500 text-white rounded-lg px-6 py-2 disabled:opacity-50"
//             disabled={otp.includes("")}
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* AadhaarModal*/
// // const AadhaarModal = ({ onClose }) => {
// //   OTPModal.propTypes = {
// //     session: PropTypes.string,
// //     refId: PropTypes.string, 
// //     setIsModalOpen: PropTypes.func,
// //     setDocumentVerified: PropTypes.func,
// //     aadharNumber: PropTypes.string,

// //     setDataModalIsOpen: PropTypes.func,
// //     setModalData: PropTypes.func,
// //   }

//   /* AadhaarModal*/
//   export const AadhaarModal = (props) => {

//     const { modalData, setDataModalIsOpen } = props;


//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div
//           className="bg-white rounded-lg w-full max-w-xs h-auto min-h-[70px] p-4 sm:p ```javascript
// :p-5 md:p-6 lg:p-8 xl:p-8 relative shadow-lg flex flex-col justify-between"
//         >
//           <div className="flex flex-col items-center space-y-4 flex-grow">
//             <div className="bg-green-500 p-2 rounded-full flex items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-10 w-10 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
//               Aadhaar is Valid
//             </h3>
//             <div className="text-left space-y-3 w-full text-xs md:text-sm">
//               {[
//                 { label: "Aadhaar Number", value: "xxxx xxxx 7583" },
//                 { label: "Name", value: "Sandeep" },
//                 { label: "Date of Birth", value: "14-10-1995" },
//                 { label: "Address", value: "Bangalore, Karnataka" },
//               ].map(({ label, value }, idx) => (
//                 <div className="flex justify-between border-b pb-2" key={idx}>
//                   <span className="font-semibold text-gray-600 w-16 sm:w-14 md:w-20">
//                     {label}
//                   </span>
//                   <span className="text-right w-28 md:w-36 truncate text-xs md:text-sm">
//                     {value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-5">
//             <button
//               onClick={onClose}
//               className="bg-green-600 text-white rounded-lg px-6 py-2"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   /* PAN Modal*/
//   const PANModal = ({ onClose }) => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-3 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col justify-between">
//           <div className="flex flex-col items-center space-y-4 flex-grow">
//             <div className="bg-green-500 p-1.5 sm:p-2 rounded-full mt-2 sm:mt-0">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 sm:h-10 sm:w-10 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 text-center">
//               PAN is Valid
//             </h3>
//             <div className="flex w-full flex-col md:flex-row justify-between text-xs md:text-sm space-y-4 md:space-y-0 md:space-x-12">
//               <div className="flex flex-col space-y-4 w-full md:w-1/2">
//                 {[
//                   { label: "Provided Name", value: "Sandeep" },
//                   { label: "Registered Name", value: "Sandeep" },
//                   { label: "PAN Ref ID", value: "REF12345678" },
//                 ].map(({ label, value }, idx) => (
//                   <div className="flex justify-between items-center" key={idx}>
//                     <span className="font-semibold text-gray-600 w-24">
//                       {label}
//                     </span>
//                     <span className="text-right truncate text-xs md:text-sm flex-grow">
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex flex-col space-y-4 w-full md:w-1/2">
//                 {[
//                   { label: "PAN", value: "ABCDE123 4F" },
//                   { label: "PAN Type", value: "Individual" },
//                 ].map(({ label, value }, idx) => (
//                   <div className="flex justify-between items-center" key={idx}>
//                     <span className="font-semibold text-gray-600 w-24">
//                       {label}
//                     </span>
//                     <span className="text-right truncate text-xs md:text-sm flex-grow">
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="border-b border-gray-300 w-full mt-4" />
//           </div>
//           <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-6">
//             <button
//               onClick={onClose}
//               className="bg-green-600 text-white rounded-lg px-4 py-1.5 sm:px-6 sm:py-2"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   /* AccountVerificationModal*/
//   const AccountVerificationModal = ({ onClose }) => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-4 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col">
//           <div className="flex flex-col items-center space-y-4 flex-grow">
//             <div className="bg-green-500 p-2 rounded-full mt-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 sm:h-10 sm:w-10 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
//               Account Verification
//             </h3>
//           </div>
//           <div className="flex-grow overflow-y-auto max-h-[60vh]">
//             <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm space-y-6 md:space-y-0 md:space-x-10 p-4">
//               {/* Left Column */}
//               <div className="flex flex-col space-y-6 w-full md:w-1/2">
//                 {[
//                   { label: "Name Provided", value: "Sandeep" },
//                   { label: "IFSC", value: "xxxx xxxx 1234" },
//                   { label: "Name at Bank", value: "Active" },
//                   { label: "Branch", value: "Chang" },
//                   { label: "Account Deposited", value: "10000" },
//                 ].map(({ label, value }, idx) => (
//                   <div className="flex justify-between items-center" key={idx}>
//                     <span className="font-semibold text-gray-600 w-24">
//                       {label}
//                     </span>
//                     <span className="text-right truncate text-xs md:text-sm flex-grow">
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               {/* Right Column */}
//               <div className="flex flex-col space-y-6 w-full md:w-1/2">
//                 {[
//                   { label: "Bank A/C No", value: "Shipex" },
//                   { label: "Account Status Code", value: "Account is valid" },
//                   { label: "Bank", value: "HDFC" },
//                   { label: "City", value: "Chang" },
//                   { label: "Name Match Result", value: "---" },
//                 ].map(({ label, value }, idx) => (
//                   <div className="flex justify-between items-center" key={idx}>
//                     <span className="font-semibold text-gray-600 w-24">
//                       {label}
//                     </span>
//                     <span className="text-right truncate text-xs md:text-sm flex-grow">
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="border-b border-gray-300 w-full mt-4" />
//           </div>
//           <div className="flex justify-center w-full space-x-2 mt-2 sm:mt-4">
//             <button
//               onClick={onClose}
//               className="bg-green-600 text-white rounded-lg px-6 py-2 mt-2 sm:mt-3 shadow-md hover:bg-green-700 transition duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   AccountVerificationModal.propTypes = {
//     modalData: PropTypes.object,
//     setDataModalIsOpen: PropTypes.func,
//   }

//   export const GSTModal = (props) => {

//     const { modalData, setDataModalIsOpen } = props;

//     return (<>
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//         <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[75%] md:max-w-[45%] max-h-[95vh] flex flex-col">
//           <div className="flex flex-col items-center">
//             {/* Success Icon */}
//             <div className="bg-green-500 rounded-full p-4 mb-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             {/* Title */}
//             <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
//               GSTIN is Valid
//             </h3>
//           </div>
//           {/* Scrollable Content */}
//           <div className="overflow-y-auto flex-grow max-h-[80vh]">
//             {/* GSTIN Details */}
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-sm text-gray-700 w-full">
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium w-1/3 sm:w-1/4">GSTIN</span>
//                 <span className="text-right flex-1">
//                   {modalData.gstin}
//                 </span>
//               </div>
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium">GST Ref. ID</span>
//                 <span className="text-right flex-1">{modalData.referenceId}</span>
//               </div>
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium w-1/3 sm:w-1/3">Tax payer type</span>
//                 <span className="text-right flex-1">{modalData.taxPayerType}</span>
//               </div>
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium w-1/3 sm:w-1/4">
//                   Date of Registration
//                 </span>
//                 <span className="text-right flex-1">{modalData.dateOfRegistration.split('T')[0]}</span>
//               </div>
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium w-1/3 sm:w-1/4">
//                   Name of Business
//                 </span>
//                 <span className="text-right flex-1">{modalData.nameOfBusiness}</span>
//               </div>
//               <div className="flex justify-between p-2 border-b border-gray-300">
//                 <span className="font-medium w-1/3 sm:w-1/2">
//                   Legal Name of Business
//                 </span>
//                 <span className="text-right flex-1">{modalData.legalNameOfBusiness}</span>
//               </div>
//               <div className="flex justify-between p-2">
//                 <span className="font-medium w-1/3 sm:w-1/4">GSTIN Status</span>
//                 <span className="text-right flex-1">{modalData.gstInStatus}</span>
//               </div>
//             </div>
//           </div>
//           {/* Close Button */}
//           <div className="flex justify-center w-full mt-4">
//             <button
//               className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ease-in-out text-center"
//               onClick={() => setDataModalIsOpen(prev => ({ ...prev, gst: false }))}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </>);
//   }

//   GSTModal.propTypes = {
//     modalData: PropTypes.object,
//     setDataModalIsOpen: PropTypes.func,
//   }




{
  /* Gst Verification Modal */
}
{
  isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[75%] md:max-w-[45%] max-h-[95vh] flex flex-col">
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="bg-green-500 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
            GSTIN is Valid
          </h3>
        </div>
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow max-h-[80vh]">
          {/* GSTIN Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 text-sm text-gray-700 w-full">
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium w-1/3 sm:w-1/4">GSTIN</span>
              <span className="text-right flex-1">
                {gstNumber || "06HBDC748347953947"}
              </span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium">GST Ref. ID</span>
              <span className="text-right flex-1">65893</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium w-1/3 sm:w-1/3">Tax payer type</span>
              <span className="text-right flex-1">Regular</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium w-1/3 sm:w-1/4">
                Date of Registration
              </span>
              <span className="text-right flex-1">2021-11-18</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium w-1/3 sm:w-1/4">
                Name of Business
              </span>
              <span className="text-right flex-1">Shipex</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-300">
              <span className="font-medium w-1/3 sm:w-1/2">
                Legal Name of Business
              </span>
              <span className="text-right flex-1">Sandeep</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="font-medium w-1/3 sm:w-1/4">GSTIN Status</span>
              <span className="text-right flex-1">Active</span>
            </div>
          </div>
        </div>
        {/* Close Button */}
        <div className="flex justify-center w-full mt-4">
          <button
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 ease-in-out text-center"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
/* OTP Modal */
const OTPModal = ({ onClose, onConfirm }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendTime, setResendTime] = useState(36); // initial countdown in seconds
  useEffect(() => {
    const timer =
      resendTime > 0 && setInterval(() => setResendTime(resendTime - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTime]);
  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^\d$/.test(value) || value === "") {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus on the next input box if current is not empty
      if (value && element.nextSibling) {
        element.nextSibling.focus();
      }
    }
  };
  const handleConfirm = () => {
    onConfirm(otp.join(""));
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Authenticate</h3>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        <p className="text-gray-700 text-sm mb-2">
          Enter the 6-digit OTP sent to your Aadhaar linked phone number by
          UIDAI
        </p>
        <p className="text-gray-700 text-sm mb-2">Enter OTP</p>
        <div className="flex space-x-2 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e.target, index)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <p className="text-gray-500">
            Resend OTP{" "}
            {resendTime > 0 ? `(${String(resendTime).padStart(2, "0")})` : ""}
          </p>
          <a href="#" className="text-green-600 hover:underline">
            Need help?
          </a>
        </div>
        <p className="text-gray-500 text-xs mb-4">
          This authentication will last only for this session.
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600 px-3 py-1">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white rounded-lg px-6 py-2 disabled:opacity-50"
            disabled={otp.includes("")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* AadhaarModal*/
const AadhaarModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg w-full max-w-xs h-auto min-h-[70px] p-4 sm:p ```javascript
:p-5 md:p-6 lg:p-8 xl:p-8 relative shadow-lg flex flex-col justify-between"
      >
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-2 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            Aadhaar is Valid
          </h3>
          <div className="text-left space-y-3 w-full text-xs md:text-sm">
            {[
              { label: "Aadhaar Number", value: "xxxx xxxx 7583" },
              { label: "Name", value: "Sandeep" },
              { label: "Date of Birth", value: "14-10-1995" },
              { label: "Address", value: "Bangalore, Karnataka" },
            ].map(({ label, value }, idx) => (
              <div className="flex justify-between border-b pb-2" key={idx}>
                <span className="font-semibold text-gray-600 w-16 sm:w-14 md:w-20">
                  {label}
                </span>
                <span className="text-right w-28 md:w-36 truncate text-xs md:text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-5">
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-lg px-6 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* PAN Modal*/
const PANModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-3 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-1.5 sm:p-2 rounded-full mt-2 sm:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            PAN is Valid
          </h3>
          <div className="flex w-full flex-col md:flex-row justify-between text-xs md:text-sm space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              {[
                { label: "Provided Name", value: "Sandeep" },
                { label: "Registered Name", value: "Sandeep" },
                { label: "PAN Ref ID", value: "REF12345678" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              {[
                { label: "PAN", value: "ABCDE123 4F" },
                { label: "PAN Type", value: "Individual" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-300 w-full mt-4" />
        </div>
        <div className="flex justify-center w-full space-x-2 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-lg px-4 py-1.5 sm:px-6 sm:py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* AccountVerificationModal*/
const AccountVerificationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl h-auto min-h-[70px] p-4 sm:p-6 md:p-8 lg:p-10 relative shadow-lg flex flex-col">
        <div className="flex flex-col items-center space-y-4 flex-grow">
          <div className="bg-green-500 p-2 rounded-full mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-md sm:text-lg md:text-xl font-bold text-gray-800 text-center">
            Account Verification
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm space-y-6 md:space-y-0 md:space-x-10 p-4">
            {/* Left Column */}
            <div className="flex flex-col space-y-6 w-full md:w-1/2">
              {[
                { label: "Name Provided", value: "Sandeep" },
                { label: "IFSC", value: "xxxx xxxx 1234" },
                { label: "Name at Bank", value: "Active" },
                { label: "Branch", value: "Chang" },
                { label: "Account Deposited", value: "10000" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {/* Right Column */}
            <div className="flex flex-col space-y-6 w-full md:w-1/2">
              {[
                { label: "Bank A/C No", value: "Shipex" },
                { label: "Account Status Code", value: "Account is valid" },
                { label: "Bank", value: "HDFC" },
                { label: "City", value: "Chang" },
                { label: "Name Match Result", value: "---" },
              ].map(({ label, value }, idx) => (
                <div className="flex justify-between items-center" key={idx}>
                  <span className="font-semibold text-gray-600 w-24">
                    {label}
                  </span>
                  <span className="text-right truncate text-xs md:text-sm flex-grow">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-300 w-full mt-4" />
        </div>
        <div className="flex justify-center w-full space-x-2 mt-2 sm:mt-4">
          <button
            onClick={onClose}
            className="bg-green-600 text-white rounded-lg px-6 py-2 mt-2 sm:mt-3 shadow-md hover:bg-green-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};