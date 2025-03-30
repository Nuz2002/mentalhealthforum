import React from "react";

const RejectedPage = ({ onReapply }) => {
  return (
    <div className="text-center p-6 md:p-8 bg-blue-50 rounded-xl space-y-4">
      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-full">
        {/* Значок отклонения (крестик) */}
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-blue-900">Заявка отклонена</h3>
      <p className="text-sm md:text-base text-blue-700">
        К сожалению, ваша заявка не соответствует нашим требованиям. Пожалуйста, ознакомьтесь с правилами и попробуйте снова.
      </p>
    </div>
  );
};

export default RejectedPage;
