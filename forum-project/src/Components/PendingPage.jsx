import React from "react";

const PendingPage = () => {
  return (
    <div className="text-center p-6 md:p-8 bg-blue-50 rounded-xl space-y-4">
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-full">
        {/* Значок ожидания (часы) */}
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-blue-900">Заявка отправлена!</h3>
      <p className="text-sm md:text-base text-blue-700">
        Наша команда рассмотрит ваши документы и свяжется с вами в течение 3–5 рабочих дней.
      </p>
    </div>
  );
};

export default PendingPage;
