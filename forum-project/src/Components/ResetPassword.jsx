// import { useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { FaLock } from "react-icons/fa";
// import { resetPassword } from "../api-calls/authApi";

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [passwordLengthError, setPasswordLengthError] = useState("");

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);

//     if (newPassword.length < 6) {
//       setPasswordLengthError("Пароль должен содержать не менее 6 символов");
//     } else {
//       setPasswordLengthError("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (password.length < 6) {
//       setErrorMessage("Пароль должен содержать не менее 6 символов");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setErrorMessage("Пароли не совпадают");
//       return;
//     }
//     if (!token) {
//       setErrorMessage("Неверный или отсутствующий токен сброса пароля");
//       return;
//     }

//     try {
//       const response = await resetPassword({ token, newPassword: password });
//       setSuccessMessage(response?.message || "Пароль успешно сброшен!");
//       setPassword("");
//       setConfirmPassword("");
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
//             alt="сброс-пароля"
//           />
//         </div>

//         <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
//           <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
//             <div className="mb-12 text-center">
//               <h3 className="text-3xl font-bold text-blue-900 mb-2">Сброс пароля</h3>
//               <FaLock className="text-blue-600 text-4xl mx-auto mt-4" />
//               <p className="text-gray-600 mt-4">Создайте новый пароль</p>
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

//             <div className="mb-8">
//               <label className="text-blue-900 text-sm font-medium block mb-2">Новый пароль</label>
//               <input
//                 type="password"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={handlePasswordChange}
//               />
//               {passwordLengthError && (
//                 <p className="text-red-500 text-xs mt-1">{passwordLengthError}</p>
//               )}
//             </div>

//             <div className="mb-8">
//               <label className="text-blue-900 text-sm font-medium block mb-2">Подтвердите пароль</label>
//               <input
//                 type="password"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
//               >
//                 Сбросить пароль
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

// export default ResetPassword;


import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaLock, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { resetPassword } from "../api-calls/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6) {
      setPasswordLengthError("Пароль должен содержать не менее 6 символов");
    } else {
      setPasswordLengthError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (password.length < 6) {
        throw new Error("Пароль должен содержать не менее 6 символов");
      }
      if (password !== confirmPassword) {
        throw new Error("Пароли не совпадают");
      }
      if (!token) {
        throw new Error("Неверный или отсутствующий токен сброса пароля");
      }

      const response = await resetPassword({ token, newPassword: password });
      setSuccessMessage(response?.message || "Пароль успешно сброшен!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error.message || "Произошла ошибка. Пожалуйста, попробуйте снова.";
      setErrorMessage(message);
    } finally {
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
            alt="сброс-пароля"
          />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">Сброс пароля</h3>
              <FaLock className="text-blue-600 text-4xl mx-auto mt-4" />
              <p className="text-gray-600 mt-4">Создайте новый пароль</p>
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

            <div className="mb-8">
              <label className="text-blue-900 text-sm font-medium block mb-2">Новый пароль</label>
              <input
                type="password"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordLengthError && (
                <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                  <FaExclamationCircle className="flex-shrink-0" />
                  <span>{passwordLengthError}</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="text-blue-900 text-sm font-medium block mb-2">Подтвердите пароль</label>
              <input
                type="password"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={password.length < 6 || password !== confirmPassword || !token || isLoading}
                className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none transition-colors shadow-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white relative"
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
                    <span>Обработка...</span>
                  </div>
                ) : (
                  'Сбросить пароль'
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

export default ResetPassword;