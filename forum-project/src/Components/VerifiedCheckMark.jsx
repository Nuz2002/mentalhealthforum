const VerifiedCheckmark = ({ className = "" }) => (
    <span
      className={`absolute bottom-0 right-0 translate-x-1/5 -translate-y-1/5 bg-teal-500 rounded-full p-[2px] flex items-center justify-center ${className}`}
      style={{ width: '16px', height: '16px' }}
    >
      <svg
        className="w-3 h-3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
  
  export default VerifiedCheckmark;
  