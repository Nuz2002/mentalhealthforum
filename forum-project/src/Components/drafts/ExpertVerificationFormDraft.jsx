import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import FileUpload from "../FileUpload"; // Make sure this is the correct path
import { submitApplication } from "../../api-calls/expertVerificationApi";

const ExpertVerificationFormDraft = () => {
  const [submitted, setSubmitted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "", // for dateOfBirth
    professionalBio: "",
    profilePhoto: null,
    governmentId: null,
    qualifications: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // ----------- CUSTOM VALIDATION FOR ALL FIELDS -----------
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.dateOfBirth.trim() ||
      !formData.professionalBio.trim() ||
      !formData.profilePhoto ||
      !formData.governmentId ||
      !formData.qualifications
    ) {
      setError("All fields are required. Please fill them in before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await submitApplication({
        ...formData,
        dateOfBirth: formData.dateOfBirth, // (Should already be "YYYY-MM-DD" from <input type="date">
      });
      setSubmitted(true);
      setVerificationStatus(response.data.status);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  return (
    <div className="bg-blue-50 w-full flex flex-col md:flex-row gap-5 px-3 md:px-8 lg:px-16 xl:px-28 text-blue-900 min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden p-3 bg-teal-600 text-white rounded-lg self-start mt-4"
      >
        {showMobileMenu ? "Close Menu" : "Settings Menu"}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`${showMobileMenu ? "block" : "hidden"} md:block py-4 w-full md:w-1/3 lg:w-1/4`}>
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-b md:border-r border-blue-100 top-12">
          <h2 className="pl-3 mb-4 text-xl md:text-2xl font-bold text-blue-900">Settings</h2>
          <NavLink
            to="/profile-settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Public Profile
          </NavLink>
          <NavLink
            to="/become-expert"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
                isActive ? "bg-teal-600 text-white" : "text-blue-700 hover:bg-blue-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Get Verified
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-blue-900 border-b-2 border-blue-100 pb-3 md:pb-4">
              Expert Verification Application
            </h2>

            {submitted ? (
              <div className="text-center p-6 md:p-8 bg-blue-50 rounded-xl space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-full">
                  {verificationStatus === "APPROVED" ? (
                    <svg
                      className="w-8 h-8 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : verificationStatus === "REJECTED" ? (
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
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
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-blue-900">
                  {verificationStatus === "APPROVED"
                    ? "Approved!"
                    : verificationStatus === "REJECTED"
                    ? "Application Rejected"
                    : "Application Submitted!"}
                </h3>

                <p className="text-sm md:text-base text-blue-700">
                  {verificationStatus === "APPROVED"
                    ? "Your expert verification has been approved! You can now offer your services."
                    : verificationStatus === "REJECTED"
                    ? "Unfortunately your application didn't meet our requirements. Please review our guidelines and try again."
                    : "Our team will review your documents and get back to you within 3-5 business days."}
                </p>

                {verificationStatus === "REJECTED" && (
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-xl"
                  >
                    Re-apply
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      /* No 'required' here – do your own validation if needed */
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      /* No 'required' here – do your own validation if needed */
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      /* No 'required' here – do your own validation if needed */
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full cursor-pointer group">
                        <div className="px-3 py-4 md:px-4 md:py-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:border-teal-500 transition-colors group-hover:bg-white text-center">
                          <svg
                            className="mx-auto w-6 h-6 md:w-8 md:h-8 text-teal-600 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm md:text-base text-teal-600 font-medium">
                            Upload Photo
                          </span>
                          <span className="block text-xs text-blue-600 mt-1">
                            JPEG or PNG, max 2MB
                          </span>
                          <FileUpload
                            name="profilePhoto"
                            label="Profile Photo"
                            accept="image/*"
                            file={formData.profilePhoto}
                            onChange={handleFileChange}
                            onRemove={() =>
                              setFormData((prev) => ({
                                ...prev,
                                profilePhoto: null
                              }))
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Professional Bio (100 words max)
                  </label>
                  <textarea
                    name="professionalBio"
                    rows={3}
                    maxLength={100}
                    /* No 'required' here – do your own validation if needed */
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg bg-blue-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    value={formData.professionalBio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  {/* Government ID */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Government ID
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full cursor-pointer group">
                        <div className="px-3 py-4 md:px-4 md:py-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:border-teal-500 transition-colors group-hover:bg-white text-center">
                          <svg
                            className="mx-auto w-6 h-6 md:w-8 md:h-8 text-teal-600 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm md:text-base text-teal-600 font-medium">
                            Upload Document
                          </span>
                          <span className="block text-xs text-blue-600 mt-1">
                            PDF, JPG or PNG, max 5MB
                          </span>
                          <FileUpload
                            name="governmentId"
                            label="Government ID"
                            accept=".pdf,.jpg,.png"
                            file={formData.governmentId}
                            onChange={handleFileChange}
                            onRemove={() =>
                              setFormData((prev) => ({
                                ...prev,
                                governmentId: null
                              }))
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Qualifications
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full cursor-pointer group">
                        <div className="px-3 py-4 md:px-4 md:py-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:border-teal-500 transition-colors group-hover:bg-white text-center">
                          <svg
                            className="mx-auto w-6 h-6 md:w-8 md:h-8 text-teal-600 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm md:text-base text-teal-600 font-medium">
                            Upload Certifications
                          </span>
                          <span className="block text-xs text-blue-600 mt-1">
                            PDF, JPG or PNG, max 5MB
                          </span>
                          <FileUpload
                            name="qualifications"
                            label="Qualifications"
                            accept=".pdf,.jpg,.png"
                            file={formData.qualifications}
                            onChange={handleFileChange}
                            onRemove={() =>
                              setFormData((prev) => ({
                                ...prev,
                                qualifications: null
                              }))
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 md:mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 md:py-3 px-6 rounded-xl transition-colors shadow-md outline-none ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                  {error && (
                    <p className="mt-2 text-red-600 text-sm">
                      {error}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertVerificationFormDraft;
