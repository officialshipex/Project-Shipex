import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Whatsapp from "../assets/whatsapp.png"
import Google from "../assets/google.png"
import { validateEmail, validatePhoneNumber } from '../lib/validation';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    const [countryCode, setCountryCode] = useState("+91");

    const [montlyOrder, setMontlyOrder] = useState("less than 50");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [checked, setChecked] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");

    const [message, setMessage] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        console.log("Google Login");
        window.location.href = 'http://localhost:5000/v1/external/auth/google';
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSuccess(false);
        setMessage(null);
        setError(null);

        if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
            setError({ message: "Please fill in all required fields." });
            return;
        }

        if (password !== confirmPassword) {
            setError({ password: "Passwords do not match." });
            return;
        }

        if (checked === false) {
            setError({ checked: "Please agree to the privacy statement." });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/v1/external/register', {
                firstName,
                lastName,
                email,
                phoneNumber,
                company,
                monthlyOrders: montlyOrder,
                password,
                confirmedPassword: confirmPassword,
                checked
            })
            // console.log(response);
            if (response.data.success) {
                setSuccess(response.data.success);
                setMessage(response.data.message);
                setIsAuthenticated(true);
                handleNavigation();
            } else {
                setSuccess(response.data.success);
                setMessage(response.data.message);
            }

        } catch (err) {
            console.log(err.response.data);
            if (err?.response?.data) {
                setSuccess(err.response.data.success);
                setMessage(err.response.data.message);
            } else {
                setMessage("An error occurred. Please try again later.");
            }
        }
    }

    const handleNavigation = () => {
        navigate('/login');
    };

    function handleEmailChange(e) {
        setEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setError({ "email": "Please enter a valid email address." });
        } else {
            setError(null);
        }
    }

    function handlePhoneNumberChange(e) {
        setPhoneNumber(e.target.value);
        if (!validatePhoneNumber(e.target.value)) {
            setError({ "phone": "Please enter a valid phone number." });
        } else {
            setError(null);
        }
    }

    return (
        <>

            {/* Form Fields */}
            <form className="space-y-2">
                {/* Line 1: First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="firstName">First Name*</label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="First Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="lastName">Last Name*</label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Line 2: Email and Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {error?.email && <p className="text-red-400 text-sm">{error.email}</p>}
                    </div>

                    {/* Mobile Number Section */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="phoneNumber">Phone Number*</label>
                        <div>
                            <div className="flex">
                                {/* Country Code Dropdown */}
                                <select
                                    className="w-1/4 p-1 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    <option value="+91">IN</option> {/* India */}
                                    <option value="+1">USA</option> {/* USA */}
                                    <option value="+44">UK</option> {/* UK */}
                                    <option value="+61">AUS</option> {/* Australia */}
                                    {/* Add more country codes as needed */}
                                </select>
                                {/* Phone Number Input */}

                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    className="w-3/4 p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                                />
                            </div>
                            {error?.phone && <p className="text-red-400 text-sm">{error.phone}</p>}
                        </div>

                    </div>
                </div>

                {/* Line 3: Company and Number of Orders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            placeholder="Company"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="orders">Monthly Orders*</label>
                        <select
                            id="orders"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={montlyOrder}
                            onChange={(e) => setMontlyOrder(e.target.value)}
                        >
                            <option value="less than 50">Less than 50</option>
                            <option value="50-200">50-200</option>
                            <option value="200-500">200-500</option>
                            <option value="500-1000">500-1000</option>
                            <option value="more than 1000">More than 1000</option>
                        </select>
                    </div>
                </div>

                {/* Line 4: Password and Confirm Password */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="password">Password*</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700" htmlFor="confirmPassword">Confirm Password*</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error?.password && <p className="text-red-400 text-sm">{error.password}</p>}
                    </div>
                </div>

                {/* User Privacy Statement */}
                <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="privacy" className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 border-gray-300 rounded mt-1"
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                    />
                    <p className="text-[12px] text-gray-600">
                        By submitting this form, you agree to ShipEx&apos;s <span className="text-green-600">User Privacy Statement</span>.
                    </p>
                    {error?.checked && <p className="text-red-400 text-sm">{error.checked}</p>}
                </div>

                {message && <div><p className={`text-sm text-center ${success ? "text-green-500" : "text-red-400"}`}>{message}</p></div>}
                {error?.message && <p className="text-red-400 text-sm">{error.message}</p>}

                {/* Register Button */}
                <button
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
                    onClick={handleSubmit}
                >Register
                </button>


                <p className="text-sm text-center font-bold mt-4">Already a Seller? <a href="/login" className="text-green-600">Log in</a></p>

                <div className="text-center text-gray-600 text-sm mt-4">OR</div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-gray-200 text-black py-2 rounded-lg font-bold border-green-500 border-solid border-[2px] flex items-center justify-center gap-2">
                        <img src={Google} alt="" />
                        <span>Google</span>
                    </button>

                    {/* WhatsApp Button */}
                    <button
                        className="w-full bg-gray-200 text-black py-2 rounded-lg font-bold border-green-500 border-solid border-[2px] flex items-center justify-center gap-2"

                    >
                        <img src={Whatsapp} alt="" />
                        <span>WhatsApp</span>
                    </button>
                </div>
            </form>

        </>
    );
};

RegistrationForm.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default RegistrationForm;