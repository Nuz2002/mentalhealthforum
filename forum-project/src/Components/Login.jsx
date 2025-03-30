// // This is the login page

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSignInAlt } from 'react-icons/fa';
// import axios from 'axios';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
//         {
//           email: formData.email.trim(),
//           password: formData.password.trim(),
//         }
//       );

//       if (response.data && response.data.accessToken && response.data.refreshToken) {
//         localStorage.setItem('accessToken', response.data.accessToken);
//         localStorage.setItem('refreshToken', response.data.refreshToken);
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('userType', response.data.role);

//         if (response.data.role === 'SPECIALIST') {
//           console.log('STATUS:', response.data.status);
//           localStorage.setItem('applicationStatus', response.data.status);
//           localStorage.setItem('isVerified', response.data.status === 'APPROVED');
//         }

//         window.location.href = '/home';
//       } else {
//         setErrorMessage('Неверный адрес электронной почты или пароль.');
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || 'Ошибка входа. Пожалуйста, попробуйте снова.');
//       } else {
//         console.log(error);
//         setErrorMessage('Ошибка сети или сервер недоступен.');
//       }
//     }
//   };

//   return (
//     <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
//       <div className="grid md:grid-cols-2 items-center gap-8 h-full">
//         <div className="max-md:order-1 p-4 hidden sm:block">
//           <img
//             src="/images/forum-icon.png"
//             className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
//             alt="изображение входа"
//           />
//         </div>

//         <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
//           <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
//             <div className="mb-12 text-center">
//               <h3 className="text-3xl font-bold text-blue-900 mb-2">С возвращением</h3>
//               <FaSignInAlt className="text-blue-600 text-4xl mx-auto mt-4" />
//               <p className="text-gray-600 mt-4">Войдите в свой аккаунт</p>
//             </div>

//             {errorMessage && (
//               <div className="text-red-500 mb-4">
//                 {errorMessage}
//               </div>
//             )}

//             <div>
//               <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
//                 placeholder="Введите email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
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
//             </div>

//             <p className="text-sm text-blue-900 mt-4 hover:text-blue-600 transition-colors">
//               <Link to="/forgot-password" className="font-medium">
//                 Забыли пароль?
//               </Link>
//             </p>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
//               >
//                 Войти
//               </button>
//               <p className="text-center text-blue-900 mt-8">
//                 Нет аккаунта?{' '}
//                 <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
//                   Зарегистрируйтесь здесь
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        }
      );

      if (response.data && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', response.data.role);

        if (response.data.role === 'SPECIALIST') {
          localStorage.setItem('applicationStatus', response.data.status);
          localStorage.setItem('isVerified', response.data.status === 'APPROVED');
        }

        setIsLoading(false);
        window.location.href = '/home';
      } else {
        setErrorMessage('Неверный адрес электронной почты или пароль.');
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Ошибка входа. Пожалуйста, попробуйте снова.');
      } else {
        setErrorMessage('Ошибка сети или сервер недоступен.');
      }
    }
  };

  return (
    <div className="font-[sans-serif] bg-gradient-to-br from-blue-50 to-blue-100 md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4 hidden sm:block">
          <img
            src="/images/forum-icon.png"
            className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
            alt="изображение входа"
          />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-white h-full lg:w-11/12 lg:ml-auto shadow-xl rounded-l-2xl">
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">С возвращением</h3>
              <FaSignInAlt className="text-blue-600 text-4xl mx-auto mt-4" />
              <p className="text-gray-600 mt-4">Войдите в свой аккаунт</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 flex items-center gap-2">
                <FaExclamationCircle className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="text-blue-900 text-sm font-medium block mb-2">Электронная почта</label>
              <input
                name="email"
                type="email"
                required
                className="w-full text-sm text-blue-900 border-b-2 border-blue-100 focus:border-blue-500 pl-2 pr-8 py-3 outline-none transition-colors"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleChange}
              />
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
            </div>

            <p className="text-sm text-blue-900 mt-4 hover:text-blue-600 transition-colors">
              <Link to="/forgot-password" className="font-medium">
                Забыли пароль?
              </Link>
            </p>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
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
                    <span>Вход...</span>
                  </div>
                ) : (
                  'Войти'
                )}
              </button>
              <p className="text-center text-blue-900 mt-8">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                  Зарегистрируйтесь здесь
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
