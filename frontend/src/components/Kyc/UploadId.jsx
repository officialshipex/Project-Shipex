import { validateAadhaar, validateAccountNumber, validateIFSC, validateName, validatePAN, validatePhoneNumber } from "../../lib/validation";
import Logo from "../../assets/Vector logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getTokens } from "../../lib/session";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AadhaarModal, AccountVerificationModal, OTPModal, PANModal } from "./Modal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UploadId = (props) => {

  const { setDocumentVerified, aadharNumber, setAadharNumber, panNumber, setPanNumber, panName, setPanName, accountNumber, setAccountNumber, ifscCode, setIfscCode, accountHolderName, setAccountHolderName, phoneNumber, setPhoneNumber } = props;

  const navigate = useNavigate();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  const [session, setSession] = useState();

  const [refId, setRefId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModalIsOpen, setDataModalIsOpen] = useState({});
  const [modalData, setModalData] = useState();

  useEffect(() => {
    try {
      const token = getTokens();
      if (!token) {
        navigate("/login");
      } else {
        setSession(token);
      }
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);


  const verifyAadhar = async (e) => {
    e.preventDefault();

    if (!aadharNumber) {
      setError({ aadharNumber: "Aadhar number is required" });
      return;
    }


    try {
      const response = await axios.post(`${backendUrl}/merchant/verfication/generate-otp`, {
        aadhaarNo: aadharNumber,
      }, {
        headers: {
          authorization: `Bearer ${session}`
        }
      })
      if (!response.data.success) {
        setError({ aadharNumber: response.data.message })
        return
      }

      if (response.data.data.ref_id) {
        // console.log("resposne : ", response.data);
        setRefId(response.data.data.ref_id)
        setIsModalOpen(true)
      }else if (response.data.data) {
        setDocumentVerified(prevState => ({
          ...prevState,
          aadhar: true,
        }));
        setSuccess({ aadharNumber: response.data.success });
        setMessage({ aadharNumber: response.data.message });
        setDataModalIsOpen(prevState => ({ ...prevState, aadhaar: true }));
        setModalData(response.data.data);
      }

    } catch (error) {
      // console.log("Aadhaar verification error", error.message);
      if (error?.response?.data?.message) {
        setMessage({ aadharNumber: error.response.data.message });
      } else {
        setMessage({ aadharNumber: "Error verifying Aadhaar number" });
      }
      return;
    }

  }

  const verifyBankAccount = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");
    setError("");

    if (!accountNumber || !ifscCode || !accountHolderName || !phoneNumber) {
      setError({ accountNumber: "All fields are required" });
      return;
    }

    if (!validateAccountNumber(accountNumber)) {
      setError({ accountNumber: "Invalid Account Number" });
      return;
    }

    if (!validateIFSC(ifscCode)) {
      setError({ ifscCode: "Invalid IFSC Code" });
      return;
    }

    if (!validateName(accountHolderName)) {
      setError({ accountHolderName: "Invalid Account Holder Name" });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError({ phoneNumber: "Invalid Phone Number" });
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/merchant/verfication/bank-account`, {
        accountNo: accountNumber,
        ifsc: ifscCode,
        name: accountHolderName,
        phone: phoneNumber,
      }, {
        headers: {
          authorization: `Bearer ${session}`
        }
      })
      // console.log("Account verification response", response.data);
      if (response?.data?.success) {
        setDocumentVerified(prevState => ({
          ...prevState,
          bank: true,
        }));
        setSuccess({ account: response.data.success });
        setMessage({ account: response.data.message });
        setDataModalIsOpen(prevState => ({ ...prevState, account: true }));
        setModalData(response.data.data); 
      } else {
        setMessage({ account: response.data.message });
      }

    } catch (error) {
      // console.log("bank verification error", error.message);
      if (error?.response?.data?.message) {
        setMessage({ account: error.response.data.message });
      } else {
        setMessage({ account: "Error verifying account number" });
      }
    }

  }

  const verifyPan = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");
    setError("");

    // console.log("session : ", session);

    if (!panNumber || !panName) {
      setError({ panNumber: "PAN number and Name are required" });
      return;
    }

    if (!validatePAN(panNumber)) {
      setError({ panNumber: "Invalid PAN number" });
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/merchant/verfication/pan`, {
        pan: panNumber,
        name: panName
      }, {
        headers: {
          authorization: `Bearer ${session}`
        }
      })
      // console.log("pan verification response", response.data);
      if (response?.data?.success) {
        setDocumentVerified(prevState => ({
          ...prevState,
          pan: true,
        }));
        setSuccess({ panNumber: response.data.success });
        setMessage({ panNumber: response.data.message });
        setDataModalIsOpen(prevState => ({ ...prevState, pan: true }));
        setModalData(response.data.data);

      } else {
        setMessage({ panNumber: response.data.message });
      }

    } catch (error) {
      // console.log("pan verification error", error.message);
      if (error?.response?.data?.message) {
        setMessage({ panNumber: error.response.data.message });
      } else {
        setMessage({ panNumber: "Error verifying PAN number" });
      }
    }
  }

  const handlePhoneNumberChange = (e) => {
    setError({});
    setPhoneNumber(e.target.value);
    if (!validatePhoneNumber(e.target.value)) {
      setError({ phoneNumber: "Invalid Phone Number" });
    }
  }

  const handleAccountNameChange = (e) => {
    setError({});
    setDocumentVerified(prevState => ({
      ...prevState,
      bank: false,
    }));
    setAccountHolderName(e.target.value);
    if (!validateName(e.target.value)) {
      setError({ accountHolderName: "Invalid Account Holder Name" });
    }
  }

  const handleIfscChange = (e) => {
    setError({});
    setDocumentVerified(prevState => ({
      ...prevState,
      bank: false,
    }));
    setIfscCode(e.target.value);
    if (!validateIFSC(e.target.value)) {
      setError({ ifscCode: "Invalid IFSC Code" });
    }
  }

  const handleAccountChange = (e) => {
    setError({});
    setDocumentVerified(prevState => ({
      ...prevState,
      bank: false,
    }));
    setAccountNumber(e.target.value);
    if (!validateAccountNumber(e.target.value)) {
      setError({ accountNumber: "Invalid Account Number" });
    }
  }


  const handlePanChange = (e) => {
    setError({});
    setDocumentVerified(prevState => ({
      ...prevState,
      pan: false,
    }));
    setPanNumber(e.target.value);
    if (!validatePAN(e.target.value)) {
      setError({ panNumber: "Invalid PAN Number" });
    }
  }

  const handlePanNameChange = (e) => {
    setError({});
    setPanName(e.target.value);
    if (!validateName(e.target.value)) {
      setError({ panName: "Invalid Name" });
    }
  }

  const handleAadharChange = (e) => {
    setError({});
    setAadharNumber(e.target.value);
    if (!validateAadhaar(e.target.value)) {
      setError({ aadharNumber: "Invalid Aadhar Number" });
    }
  }

  const handleNextClick = () => {
    // if (!success?.panNumber || !success?.account) {
    //   setError({ panNumber: "Please verify PAN number", accountNumber: "Please verify Bank Account" });
    //   return;
    // }
    navigate("/kyc/agreement"); // Navigate to the Agreement page
  };

  if (dataModalIsOpen.pan) {
    return (<>
      <PANModal
        modalData={modalData}
        setDataModalIsOpen={setDataModalIsOpen}
      />
    </>)
  } else if (dataModalIsOpen.account) {
    return (<>
      <AccountVerificationModal
        modalData={modalData}
        setDataModalIsOpen={setDataModalIsOpen}
      />
    </>)
  } else if (dataModalIsOpen.aadhaar) {
    return (<>
      <AadhaarModal
        modalData={modalData}
        setDataModalIsOpen={setDataModalIsOpen}
      />
    </>)
  }

  if (isModalOpen) {
    return (<>
      <OTPModal
        refId={refId}
        session={session}
        setIsModalOpen={setIsModalOpen}
        setDocumentVerified={setDocumentVerified}
        aadharNumber={aadharNumber}

        setDataModalIsOpen={setDataModalIsOpen}
        setModalData={setModalData}
      />
    </>)
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white overflow-hidden -mt-10">
        <div className="w-full max-w-5xl p-6 space-y-4 lg:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col items-start space-y-2">
            <img src={Logo} alt="ShipEx Logo" className="h-10 mt-4" />
            <h2 className="text-base sm:text-[18px] lg:text-[16px] font-bold text-gray-800">
              Verify Your Account
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1 mt-2">
            <div className="flex items-center space-x-2 ">
              <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
              <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-6 lg:mt-12">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Aadhar Card Number</label>
                    <input
                      type="text"
                      placeholder="Enter your number"
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      value={aadharNumber}
                      onChange={handleAadharChange}
                    />
                    {error?.aadharNumber && (<p className="text-red-500 text-xs">{error.aadharNumber}</p>)}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="text-gray-800 px-3 py-1">Cancel</button>
                    <button
                      onClick={verifyAadhar}
                      className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-6 lg:px-10 py-2">
                      Verify
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">PAN</label>
                    <input
                      type="text"
                      placeholder="XXXXX XXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      value={panNumber}
                      onChange={handlePanChange}
                    />
                    {error?.panNumber && (<p className="text-red-500 text-xs">{error.panNumber}</p>)}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name (optional)</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      value={panName}
                      onChange={handlePanNameChange}
                    />
                    {error?.panName && (<p className="text-red-500 text-xs">{error.panName}</p>)}
                  </div>
                  <div className="flex justify-end space-x-2">
                    {message?.panNumber && <p className={success.panNumber ? "text-green-500" : "text-red-500"}>{message?.panNumber}</p>}
                    <button className="text-gray-800 px-3 py-1">Cancel</button>
                    <button
                      onClick={verifyPan}
                      className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-6 lg:px-10 py-2">
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Bank Account Verification */}
              <div className="flex-1">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Account Number</label>
                      <input
                        type="text"
                        placeholder="Enter your account number"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={accountNumber}
                        onChange={handleAccountChange}
                      />
                      {error?.accountNumber && (<p className="text-red-500 text-xs">{error.accountNumber}</p>)}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">IFSC Code</label>
                      <input
                        type="text"
                        placeholder="Enter your IFSC code"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={ifscCode}
                        onChange={handleIfscChange}
                      />
                      {error?.ifscCode && (<p className="text-red-500 text-xs">{error.ifscCode}</p>)}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          placeholder="Enter Your code"
                          className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          value={accountHolderName}
                          onChange={handleAccountNameChange}
                        />
                        {error?.accountHolderName && (<p className="text-red-500 text-xs">{error.accountHolderName}</p>)}
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="Enter your number"
                          className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                        />
                        {error?.phoneNumber && (<p className="text-red-500 text-xs">{error.phoneNumber}</p>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    {message?.account && (<p className={success.account ? "text-green-500" : "text-red-500"}>{message?.account}</p>)}
                    <button className="text-gray-800 px-3 py-1">Cancel</button>
                    <button
                      onClick={verifyBankAccount}
                      className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-6 lg:px-10 py-2">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center md:justify-end mt-6">
            <button onClick={handleNextClick} className="bg-green-600 text-white rounded-lg px-8 lg:px-16 py-2">Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

UploadId.propTypes = {
  setAccountHolderName: PropTypes.func,
  setDocumentVerified: PropTypes.func,
  accountHolderName: PropTypes.string,
  setAccountNumber: PropTypes.func,
  accountNumber: PropTypes.string,
  setAadharNumber: PropTypes.func,
  setPhoneNumber: PropTypes.func,
  aadharNumber: PropTypes.string,
  phoneNumber: PropTypes.string,
  setPanNumber: PropTypes.func,
  panNumber: PropTypes.string,
  setIfscCode: PropTypes.func,
  ifscCode: PropTypes.string,
  setPanName: PropTypes.func,
  panName: PropTypes.string,

}

export default UploadId;