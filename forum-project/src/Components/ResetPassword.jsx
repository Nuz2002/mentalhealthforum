import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { resetPassword } from "../api-calls/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState("");

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

    if (password.length < 6) {
      setErrorMessage("Пароль должен содержать не менее 6 символов");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }
    if (!token) {
      setErrorMessage("Неверный или отсутствующий токен сброса пароля");
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword: password });
      setSuccessMessage(response?.message || "Пароль успешно сброшен!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Произошла ошибка. Пожалуйста, попробуйте снова.";
      setErrorMessage(message);
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

            {errorMessage && (
              <div className="text-red-500 mb-4 text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-green-600 mb-4 text-sm">
                {successMessage}
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
                <p className="text-red-500 text-xs mt-1">{passwordLengthError}</p>
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
                className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
              >
                Сбросить пароль
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
