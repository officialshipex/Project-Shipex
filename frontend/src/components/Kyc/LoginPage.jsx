// import React and necessary hooks
// import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Logo from "../../assets/Vector logo.png";

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Handlers to redirect to external URLs
  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/signin"; // Google login page or OAuth link
  };

  const handleWhatsAppLogin = () => {
    window.location.href = "https://web.whatsapp.com"; // WhatsApp Web or specific OAuth link if available
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic (authentication, validation, etc.)

    // On successful login, navigate to KycStep1 page
    navigate("/KycStep1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-[40%] p-6 sm:p-8 lg:p-9 space-y-6 rounded-lg">
        <div className="text-center">
          {/* Add logo here */}
          <img
            src={Logo}
            alt="ShipEx Logo"
            className="mx-auto h-9 w-auto mb-5"
          />
          <p className="mt-2 text-green-600 font-bold">
            Welcome Back to ShipEx!
          </p>

          <p className="mt-2 text-gray-600 text-[13px]">
            Log in to manage your shipments, track orders, and access your
            personalized dashboard. Ensure smooth operations and efficient
            logistics management.
          </p>
        </div>

        <div className="bg-green-50 shadow-lg p-5 sm:p-6 lg:p-7 rounded-lg border-2 space-y-6 border-green-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email Address"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                placeholder="Create a Password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-between">
              <a href="#" className="text-sm text-gray-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            A new User?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Sign in
            </a>
          </div>

          <div className="relative text-center">
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://img.icons8.com/color/20/000000/google-logo.png"
                  alt="Google"
                  className="mr-2"
                />
                Google
              </button>

              <button
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
                onClick={handleWhatsAppLogin}
              >
                <img
                  src="https://img.icons8.com/color/20/000000/whatsapp.png"
                  alt="WhatsApp"
                  className="mr-2"
                />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
