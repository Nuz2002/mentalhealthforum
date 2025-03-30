import React from "react";
import { NavLink } from "react-router-dom";

const ApprovedPage = () => {
  return (
    <div className="bg-blue-50 w-full flex flex-col md:flex-row gap-5 px-3 md:px-8 lg:px-16 xl:px-28 text-blue-900 min-h-screen">
      {/* Кнопка меню на мобильных */}
      <button
        onClick={() => {}}
        className="md:hidden p-3 bg-teal-600 text-white rounded-lg self-start mt-4"
      >
        Меню настроек
      </button>

      {/* Боковое меню */}
      <aside className={`md:block py-4 w-full md:w-1/3 lg:w-1/4`}>
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-b md:border-r border-blue-100 top-12">
          <h2 className="pl-3 mb-4 text-xl md:text-2xl font-bold text-blue-900">Настройки</h2>
          <NavLink
            to="/profile-settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
              }`
            }
          >
            Публичный профиль
          </NavLink>
          <NavLink
            to="/become-expert"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
              }`
            }
          >
            Пройти верификацию
          </NavLink>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8 border border-blue-100">
            <div className="text-center p-6 md:p-8 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-full">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-blue-900">Верификация пройдена!</h3>
              <p className="text-sm md:text-base text-blue-700">
                Ваша заявка на верификацию одобрена! Теперь вы можете предлагать свои услуги как эксперт.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovedPage;
