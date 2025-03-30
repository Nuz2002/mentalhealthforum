// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaEnvelope } from "react-icons/fa";
// import { forgotPassword } from "../api-calls/authApi";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!email.trim()) {
//       setErrorMessage("Пожалуйста, введите адрес электронной почты");
//       return;
//     }

//     try {
//       const response = await forgotPassword({ email });
//       setSuccessMessage(response.message || "Ссылка для сброса пароля отправлена на вашу почту.");
//       setEmail("");
//     } catch (error) {
//       console.error(error);
//       const message = error?.response?.data?.message || "Произошла ошибка. Пожалуйста, попробуйте снова.";
//       setErrorMessage(message);
//     }
//   };

//   return (
//     <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
//       <div className="grid md:grid-cols-2 items-center gap-8 h-full">
//         <div className="max-md:order-1 p-4 hidden sm:block">
//           <img
//             src="/images/password-reset-img.webp"
//             className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
//             alt="забыли-пароль"
//           />
//         </div>

//         <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
//           <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
//             <div className="mb-12 text-center">
//               <h3 className="text-3xl font-bold text-blue-900 mb-2">Забыли пароль?</h3>
//               <FaEnvelope className="text-blue-600 text-4xl mx-auto mt-4" />
//               <p className="text-gray-600 mt-4">Введите вашу почту для сброса пароля</p>
//             </div>

//             {errorMessage && (
//               <div className="text-red-500 mb-4 text-sm">
//                 {errorMessage}
//               </div>
//             )}

//             {successMessage && (
//               <div className="text-green-600 mb-4 text-sm">
//                 {successMessage}
//               </div>
//             )}

//             <div>
//               <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
//               <input
//                 type="email"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
//                 disabled={!email.trim()}
//               >
//                 Отправить ссылку для сброса
//               </button>
//               <p className="text-center text-blue-900 mt-8 text-sm">
//                 Вспомнили пароль?{" "}
//                 <Link 
//                   to="/login" 
//                   className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
//                 >
//                   Войти
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { forgotPassword } from "../api-calls/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!email.trim()) {
      setErrorMessage("Пожалуйста, введите адрес электронной почты");
      setIsLoading(false);
      return;
    }

    try {
      const response = await forgotPassword({ email });
      setSuccessMessage(response.message || "Ссылка для сброса пароля отправлена на вашу почту.");
      setEmail("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Произошла ошибка. Пожалуйста, попробуйте снова.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4 hidden sm:block">
          <img
            src="/images/password-reset-img.webp"
            className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
            alt="забыли-пароль"
          />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">Забыли пароль?</h3>
              <FaEnvelope className="text-blue-600 text-4xl mx-auto mt-4" />
              <p className="text-gray-600 mt-4">Введите вашу почту для сброса пароля</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 flex items-center gap-2">
                <FaExclamationCircle className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-300 flex items-center gap-2">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{successMessage}</span>
              </div>
            )}

            <div>
              <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
              <input
                type="email"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none transition-colors shadow-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white relative"
                disabled={!email.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Отправка...</span>
                  </div>
                ) : (
                  'Отправить ссылку для сброса'
                )}
              </button>
              <p className="text-center text-blue-900 mt-8 text-sm">
                Вспомнили пароль?{" "}
                <Link 
                  to="/login" 
                  className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                  Войти
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;