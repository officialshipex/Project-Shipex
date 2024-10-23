import Logo from '../../assets/Vector logo.png';
import image from "../../assets/undraw1.png";

const ThankyouPage   = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-hidden ">
      {/* Container */}
      <div className="w-full max-w-screen-lg xl:max-w-screen-xl p-6 lg:p-0 flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:ml-[300px] lg:mt-[-250px] mt-0">
        
        {/* Left section: Title and Logo  */}
        <div className="w-full lg:w-1/2 space-y-4">
          <img src={Logo} alt="ShipEx Logo" className="mx-auto h-10 ml-1" />
          <h2 className="text-base sm:text-[18px] lg:text-[16px] font-bold text-gray-800">
            Your KYC is Updated now!
          </h2>

          {/* Progress Bar */}
          <div className="relative pt-1 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 sm:w-40 lg:w-80 h-1 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Main Section */}
          <div className="text-left pt-10  md:pt-20 "> {/* Add margin-top to move down */}
            <h1 className="text-xl md:text-2xl lg:text-[23px] font-bold mb-3 text-gray-800">
              Thank you
            </h1>
            <h2 className="text-base sm:text-[18px] lg:text-[21px] text-gray-500 mt-8">
              Your account has been activated
            </h2>
            <h2 className="text-base sm:text-[18px] lg:text-[21px] text-gray-500 mt-1">
              successfully
            </h2>
          </div>
        </div>

        {/* Right section: Illustration */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-72 lg:mr-0 flex flex-col items-center lg:items-start"> 
          <img
            src={image}
            alt="KYC Illustration"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-xs h-auto mx-auto lg:mx-0 mb-24" 
          />
        </div>
      </div>
    </div>
  );
};

export default ThankyouPage;
