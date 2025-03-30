import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
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

    if (formData.password.trim().length < 6) {
      setErrorMessage('Пароль должен содержать не менее 6 символов.');
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

            {errorMessage && (
              <div className="text-red-500 mb-4">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-green-600 mb-4">
                {successMessage}
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
                <p className="text-red-500 text-sm mt-2">{passwordLengthError}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={formData.password.trim().length < 6}
                className="w-full py-3 px-6 text-sm font-semibold rounded-lg focus:outline-none transition-colors shadow-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              >
                Зарегистрироваться
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
