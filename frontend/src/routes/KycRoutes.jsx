
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Writemanually from '../components/Kyc/Writemanually';
import ThankyouPage from '../components/Kyc/ThankyouPage';
import Agreement from '../components/Kyc/Agreement';
import KycStep1 from '../components/Kyc/KycStep1';
import KycStep2 from '../components/Kyc/KycStep2';
import KycStep3 from '../components/Kyc/KycStep3';
import UploadId from '../components/Kyc/UploadId';
import { getTokens } from '../lib/session';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const KycRoutes = () => {
  

  const [businesstype, setBusinesstype] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    city: "",
    state: "",
    country: "",
  });

  const [kycType, setKycType] = useState("");

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [panName, setPanName] = useState("");

  const [checked, setChecked] = useState(false);

  const [documentVerified, setDocumentVerified] = useState({
    gstin: false,
    aadhar: false,
    pan: false,
    bank: false,
  });

  const [verificationError, setVerificationError] = useState();
  const [session, setSession] = useState();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  
  const [unSet, setUnSet] = useState(false);
  useEffect(() => {
    try {

      const token = getTokens();
      if (!token) {
        navigate("/login");
      } else {
        setSession(token);
      }

      const getUser = async () => {
        const response = await axios.get(`${backendUrl}/merchant/verfication/kyc`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data.data);

        const data = response.data.data;
        if (data) {
          setBusinesstype(data.businesstype);
          setCompanyName(data.companyName);
          setGstNumber(data.gstNumber);
          setAddress({
            addressLine1: data.address.addressLine1,
            addressLine2: data.address.addressLine2,
            pinCode: data.address.pinCode,
            city: data.address.city,
            state: data.address.state,
            country: data.address.country,
          });
          setKycType(data.kycType);
          setAadharNumber(data.aadharNumber);
          setPanNumber(data.panNumber);
          setPanName(data.panName);
          setAccountNumber(data.accountNumber);
          setIfscCode(data.ifscCode);
          setAccountHolderName(data.accountHolderName);
          setPhoneNumber(data.phoneNumber);
          setDocumentVerified({
            gstin: data.documentVerified.gstin,
            aadhar: data.documentVerified.aadhar,
            pan: data.documentVerified.pan,
            bank: data.documentVerified.bank,
          });
          setUnSet(true);
        }
      };

      if (!unSet) {
        getUser();
      }

    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  const kycVerify = async () => {
    setVerificationError("");

    if (!businesstype) {
      setVerificationError("Please select kyc type");
      navigate("/kyc/step1");
      Promise.reject(); // Exit early
      return;
    }

    if (!companyName || !address.addressLine1 || !address.addressLine2 || !address.pinCode || !address.city || !address.state || !address.country) {
      setVerificationError("Please fill all details");
      navigate("/kyc/step2");
      Promise.reject(); // Exit early
      return;
    }

    if (!kycType) {
      setVerificationError("Please select kyc type");
      navigate("/kyc/step3");
      Promise.reject(); // Exit early
      return;
    }

    if (!documentVerified.aadhar || !documentVerified.bank) {
      setVerificationError("Please verify all documents");
      navigate("/kyc/step3");
      Promise.reject(); // Exit early
      return;
    }

    if (!checked) {
      setVerificationError("Please agree terms & condition");
      navigate("/kyc/agreement");
      Promise.reject();
      return;
    }

    try {

      const response = await axios.post(`${backendUrl}/merchant/verfication/kyc`, {
        businesstype,
        companyName,
        gstNumber,
        address,
        kycType,
        aadharNumber,
        panNumber,
        panName,
        accountNumber,
        ifscCode,
        accountHolderName,
        phoneNumber,
        documentVerified,
      }, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })

      // console.log(response.data);
      if (response.data.success) {
        setDone(true);
        navigate("/kyc/thanku");
        Promise.resolve(); // Verification passed
      } else {
        setVerificationError("Error verifying KYC number");
        Promise.reject();
      }

    } catch (error) {
      // console.log("kyc verification error", error.message);
      if (error?.response?.data?.message) {
        setVerificationError(error.response.data.message);
      } else {
        setVerificationError("Error verifying KYC");
      }
    }
  };


  return (
    <Routes>

      <Route path="/step1" element={<KycStep1
        setBusinesstype={setBusinesstype}
        businesstype={businesstype}
      />} />

      <Route path="/step2" element={<KycStep2
        setDocumentVerified={setDocumentVerified}
        setCompanyName={setCompanyName}
        setGstNumber={setGstNumber}
        companyName={companyName}
        setAddress={setAddress}
        gstNumber={gstNumber}
        address={address}

        session={session}
      />} />

      <Route path="/step3" element={<KycStep3
        setKycType={setKycType}
        kycType={kycType}
      />} />


      <Route path='/digital' element={<UploadId
        setAccountHolderName={setAccountHolderName}
        setDocumentVerified={setDocumentVerified}
        accountHolderName={accountHolderName}
        setAccountNumber={setAccountNumber}
        setAadharNumber={setAadharNumber}
        setPhoneNumber={setPhoneNumber}
        accountNumber={accountNumber}
        aadharNumber={aadharNumber}
        setPanNumber={setPanNumber}
        phoneNumber={phoneNumber}
        setIfscCode={setIfscCode}
        setPanName={setPanName}
        panNumber={panNumber}
        ifscCode={ifscCode}
        panName={panName}
      />} />

      <Route path='/mannual' element={<Writemanually
        setAccountHolderName={setAccountHolderName}
        setDocumentVerified={setDocumentVerified}
        accountHolderName={accountHolderName}
        setAccountNumber={setAccountNumber}
        setAadharNumber={setAadharNumber}
        setPhoneNumber={setPhoneNumber}
        accountNumber={accountNumber}
        aadharNumber={aadharNumber}
        setIfscCode={setIfscCode}
        phoneNumber={phoneNumber}
        ifscCode={ifscCode}
      />} />

      <Route path='/agreement' element={<Agreement
        verificationError={verificationError}
        setChecked={setChecked}
        kycVerify={kycVerify}
        checked={checked}
      />} />

      <Route path='/thanku' element={<ThankyouPage
        done={done}
      />} />

    </Routes>
  );
};

export default KycRoutes;