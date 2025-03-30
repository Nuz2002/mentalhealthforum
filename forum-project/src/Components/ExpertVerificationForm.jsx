import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import FileUpload from "./FileUpload";
import { submitApplication } from "../api-calls/expertVerificationApi";
import { useNavigate } from "react-router-dom";

// ...imports remain unchanged
const ExpertVerificationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    professionalBio: "",
    profilePhoto: null,
    governmentId: null,
    qualifications: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.dateOfBirth.trim() ||
      !formData.professionalBio.trim() ||
      !formData.profilePhoto ||
      !formData.governmentId ||
      !formData.qualifications
    ) {
      setError("Пожалуйста, заполните все поля перед отправкой.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await submitApplication(formData);
      localStorage.setItem("applicationStatus", data.status);
      navigate("/become-expert");
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось отправить заявку. Повторите попытку.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  return (
    <div className="bg-blue-50 w-full flex flex-col md:flex-row gap-5 px-3 md:px-8 lg:px-16 xl:px-28 text-blue-900 min-h-screen">
      <button className="md:hidden p-3 bg-teal-600 text-white rounded-lg self-start mt-4">
        Меню настроек
      </button>

      <aside className="md:block py-4 w-full md:w-1/3 lg:w-1/4">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-b md:border-r border-blue-100 top-12">
          <h2 className="pl-3 mb-4 text-xl md:text-2xl font-bold text-blue-900">Настройки</h2>
          <NavLink to="/profile-settings" className={({ isActive }) =>
            `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
              isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
            }`}>Публичный профиль</NavLink>
          <NavLink to="/become-expert" className={({ isActive }) =>
            `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
              isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
            }`}>Пройти верификацию</NavLink>
        </div>
      </aside>

      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-blue-900 border-b-2 border-blue-100 pb-3 md:pb-4">
              Заявка на верификацию эксперта
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Имя</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Фамилия</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">Дата рождения</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <FileUpload
                    name="profilePhoto"
                    label="Фотография профиля"
                    accept="image/*"
                    file={formData.profilePhoto}
                    onChange={handleFileChange}
                    onRemove={() => setFormData((prev) => ({ ...prev, profilePhoto: null }))}
                  />
                  {formData.profilePhoto && (
                    <p className="mt-1 text-sm text-blue-600">
                      Это только для администраторов. Позже вы сможете обновить свой профиль, чтобы его видели все пользователи.
                    </p>
                  )}
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Профессиональная биография (до 100 слов)
                </label>
                <textarea
                  name="professionalBio"
                  rows={3}
                  maxLength={100}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  value={formData.professionalBio}
                  onChange={handleInputChange}
                />
                {formData.professionalBio.trim().length > 0 && (
                  <p className="mt-1 text-sm text-blue-600">
                    Это только для администраторов. Позже вы сможете обновить свой профиль, чтобы его видели все пользователи.
                  </p>
                )}
              </div>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <FileUpload
                  name="governmentId"
                  label="Удостоверение личности"
                  accept=".pdf,.jpg,.png"
                  file={formData.governmentId}
                  onChange={handleFileChange}
                  onRemove={() => setFormData((prev) => ({ ...prev, governmentId: null }))}
                />

                <FileUpload
                  name="qualifications"
                  label="Документы об образовании"
                  accept=".pdf,.jpg,.png"
                  file={formData.qualifications}
                  onChange={handleFileChange}
                  onRemove={() => setFormData((prev) => ({ ...prev, qualifications: null }))}
                />
              </div>

              <div className="mt-6 md:mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 md:py-3 px-6 rounded-xl transition-colors shadow-md outline-none ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Отправка..." : "Отправить заявку"}
                </button>
                {error && (
                  <p className="mt-2 text-red-600 text-sm">{error}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertVerificationForm;
