import Logo from "../../assets/Vector logo.png";
import PropsTypes from "prop-types";

const Agreement = (props) => {
  const { checked, setChecked, kycVerify, verificationError } = props; 
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  const handleChecked = (e) => {
    setChecked(e.target.checked);
  }

  const handleNext = async () => {
    await kycVerify();
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 overflow-x-hidden"
    >
      <div className="w-full max-w-5xl p-4 sm:p-6 mt-6 mx-auto">
        <img src={Logo} alt="ShipEx Logo" className="mx-auto h-6 sm:h-10 ml-1" />
        <h2 className="text-base sm:text-[18px] lg:text-xl font-bold text-gray-800 mt-2">
          Complete your KYC for a smoother delivery process!
        </h2>

        {/* Progress Bar */}
        <div className="relative pt-1 mb-6">
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-8 sm:w-10 lg:w-20 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-16 sm:w-20 lg:w-40 h-1 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-gray-50 border border-green-200 p-6 sm:p-4 rounded-lg shadow-inner space-y-4 mt-5 sm:mt-7 max-w-full mx-auto min-h-[300px] sm:min-h-[400px] lg:min-h-[300px]">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed ">
            Nemo autem repudiandae fuga. Ad tenetur mollitia. Itaque natus aut nobis accusantium sequi officia labore qui dolor.
            Odit quia officiis accusamus vitae non laboriosam quo velit. Suscipit sit fugiat et non. Iure adipisci animi et reiciendis perferendis ut illo rerum possimus. Sit quidem porro sunt porro dolorem tempora est perferendis amet. Labore aliquid adipisci rerum vel. Odio iure voluptatem illo.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Dicta molestias ut velit. Nulla fugit quod nisi facere at sed quae perspiciatis. Maiores quisquam ipsam fugit quam laborum vero maxime voluptatem. Aliquam nemo ullam corrupti tempor.
          </p>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Nemo autem repudiandae fuga. Ad tenetur mollitia. Itaque natus aut nobis accusantium sequi officia labore qui dolor.
            Odit quia officiis accusamus vitae non laboriosam quo velit. Suscipit sit fugiat et non. Iure adipisci animi et reiciendis perferendis ut illo rerum possimus. Sit quidem porro sunt porro dolorem tempora est perferendis amet. Labore aliquid adipisci rerum vel. Odio iure voluptatem illo.
          </p>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Dicta molestias ut velit. Nulla fugit quod nisi facere at sed quae perspiciatis. Maiores quisquam ipsam fugit quam laborum vero maxime voluptatem. Aliquam nemo ullam corrupti tempora minus officia dolor magnam eos. Inventore autem ipsum quia inventore sit repellendus quia velit animi. Aut sed illo non voluptatem.
          </p>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Nemo autem repudiandae fuga. Ad tenetur mollitia. Itaque natus aut nobis accusantium sequi officia labore qui dolor.
            Odit quia officiis accusamus vitae non laboriosam quo velit. Suscipit sit fugiat et non. Iure adipisci animi et reiciendis perferendis ut illo rerum possimus. Sit quidem porro sunt porro dolorem tempora est perferendis amet. Labore aliquid adipisci rerum vel. Odio iure voluptatem illo.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Dicta molestias ut velit. Nulla fugit quod nisi facere at sed quae perspiciatis. Maiores quisquam ipsam fugit quam laborum vero.
          </p>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agree"
              className="mt-1.5 h-4 w-4 text-green-500 border-green-500 rounded focus:ring-green-400"
              checked={checked}
              onChange={handleChecked}
            />
            <label
              htmlFor="agree"
              className="ml-2 text-xs sm:text-sm text-gray-600"
            >
              By submitting this form, you agree to ShipEx&apos;s User Privacy
              Statement.
            </label>
          </div>
          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
          {verificationError && <p className="text-red-500 text-sm">{verificationError}</p>}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
          onClick={handleNext}
            className="px-6 sm:px-16 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4 sm:mt-4"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

Agreement.propTypes = {
  checked: PropsTypes.bool.isRequired,
  setChecked: PropsTypes.func.isRequired,
  kycVerify: PropsTypes.func.isRequired,
  verificationError: PropsTypes.string,
}

export default Agreement;