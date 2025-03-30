// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaUserAlt } from 'react-icons/fa';
// import axios from 'axios';

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     role: 'REGULAR',
//     password: '',
//   });

//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [passwordLengthError, setPasswordLengthError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'password') {
//       if (value.trim().length > 0 && value.trim().length < 6) {
//         setPasswordLengthError('Пароль должен содержать не менее 6 символов');
//       } else {
//         setPasswordLengthError('');
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     if (formData.password.trim().length < 6) {
//       setErrorMessage('Пароль должен содержать не менее 6 символов.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
//         {
//           username: formData.username.trim(),
//           email: formData.email.trim(),
//           role: formData.role,
//           password: formData.password.trim(),
//         }
//       );

//       const { message } = response.data || {};

//       if (!message) {
//         setErrorMessage('Сервер не вернул сообщение. Пожалуйста, попробуйте снова.');
//         return;
//       }

//       if (message.toLowerCase().includes('успешно')) {
//         setSuccessMessage(message);
//         setFormData({
//           username: '',
//           email: '',
//           role: 'REGULAR',
//           password: '',
//         });
//       } else {
//         setErrorMessage(message);
//       }

//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || 'Регистрация не удалась.');
//       } else {
//         setErrorMessage('Ошибка сети или сервер недоступен.');
//       }
//     }
//   };

//   return (
//     <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
//       <div className="grid md:grid-cols-2 items-center gap-8 h-full">
//         <div className="max-md:order-1 p-4">
//           <img
//             src="/images/forum-icon.png"
//             className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
//             alt="регистрация"
//           />
//         </div>

//         <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
//           <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
//             <div className="mb-12 text-center">
//               <h3 className="text-3xl font-bold text-blue-900 mb-2">Создайте аккаунт</h3>
//               <FaUserAlt className="text-blue-600 text-4xl mx-auto mt-4" />
//               <p className="text-gray-600 mt-4">Зарегистрируйтесь, чтобы начать пользоваться</p>
//             </div>

//             {errorMessage && (
//               <div className="text-red-500 mb-4">
//                 {errorMessage}
//               </div>
//             )}
//             {successMessage && (
//               <div className="text-green-600 mb-4">
//                 {successMessage}
//               </div>
//             )}

//             <div>
//               <label className="text-blue-900 text-sm font-medium block mb-2">Имя пользователя</label>
//               <input
//                 name="username"
//                 type="text"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="Введите имя пользователя"
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//               {formData.username && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Это имя будет видно другим пользователям
//                 </p>
//               )}
//             </div>

//             <div className="mt-8">
//               <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="Введите эл. почту"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mt-8">
//               <label className="text-blue-900 text-sm font-medium block mb-2">Роль</label>
//               <select
//                 name="role"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors bg-white"
//                 value={formData.role}
//                 onChange={handleChange}
//               >
//                 <option value="REGULAR">Обычный пользователь</option>
//                 <option value="SPECIALIST">Эксперт</option>
//               </select>
//             </div>

//             <div className="mt-8">
//               <label className="text-blue-900 text-sm font-medium block mb-2">Пароль</label>
//               <input
//                 name="password"
//                 type="password"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="Введите пароль"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {passwordLengthError && (
//                 <p className="text-red-500 text-sm mt-2">{passwordLengthError}</p>
//               )}
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={formData.password.trim().length < 6}
//                 className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none transition-colors shadow-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
//               >
//                 Зарегистрироваться
//               </button>
//               <p className="text-center text-blue-900 mt-8">
//                 Уже есть аккаунт?{' '}
//                 <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
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

// export default Register;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'REGULAR',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordLengthError, setPasswordLengthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      if (value.trim().length > 0 && value.trim().length < 6) {
        setPasswordLengthError('Пароль должен содержать не менее 6 символов');
      } else {
        setPasswordLengthError('');
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (formData.password.trim().length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
          role: formData.role,
          password: formData.password.trim(),
        }
      );

      const { message } = response.data || {};
      setIsLoading(false);

      if (!message) {
        setErrorMessage('Сервер не вернул сообщение. Пожалуйста, попробуйте снова.');
        return;
      }

      if (message.toLowerCase().includes('успешно')) {
        setSuccessMessage(message);
        setFormData({
          username: '',
          email: '',
          role: 'REGULAR',
          password: '',
        });
      } else {
        setErrorMessage(message);
      }

    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Регистрация не удалась.');
      } else {
        setErrorMessage('Ошибка сети или сервер недоступен.');
      }
    }
  };

  return (
    <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4">
          <img
            src="/images/forum-icon.png"
            className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
            alt="регистрация"
          />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">Создайте аккаунт</h3>
              <FaUserAlt className="text-blue-600 text-4xl mx-auto mt-4" />
              <p className="text-gray-600 mt-4">Зарегистрируйтесь, чтобы начать пользоваться</p>
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
              <label className="text-blue-900 text-sm font-medium block mb-2">Имя пользователя</label>
              <input
                name="username"
                type="text"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="Введите имя пользователя"
                value={formData.username}
                onChange={handleChange}
              />
              {formData.username && (
                <p className="text-sm text-gray-500 mt-2">
                  Это имя будет видно другим пользователям
                </p>
              )}
            </div>

            <div className="mt-8">
              <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
              <input
                name="email"
                type="email"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="Введите эл. почту"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8">
              <label className="text-blue-900 text-sm font-medium block mb-2">Роль</label>
              <select
                name="role"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors bg-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="REGULAR">Обычный пользователь</option>
                <option value="SPECIALIST">Эксперт</option>
              </select>
            </div>

            <div className="mt-8">
              <label className="text-blue-900 text-sm font-medium block mb-2">Пароль</label>
              <input
                name="password"
                type="password"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
              />
              {passwordLengthError && (
                <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                  <FaExclamationCircle className="flex-shrink-0" />
                  <span>{passwordLengthError}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={formData.password.trim().length < 6 || isLoading}
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
                  'Зарегистрироваться'
                )}
              </button>
              <p className="text-center text-blue-900 mt-8">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
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

export default Register;