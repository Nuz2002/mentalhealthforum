const FileUpload = ({ name, label, accept, file, onChange, onRemove }) => (
  <div>
    <label className="block text-sm font-medium text-blue-900 mb-2">
      {label}
    </label>
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col w-full cursor-pointer group">
        <div className="h-24 flex items-center justify-center px-3 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:border-teal-500 transition-colors group-hover:bg-white text-center">
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-teal-600 font-medium truncate">{file.name}</span>
              <button
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm md:text-base text-teal-600 font-medium">
                Предпросмотр файла
              </span>
            </>
          )}
          <input
            type="file"
            name={name}
            accept={accept}
            className="hidden"
            onChange={onChange}
            required={!file}
          />
        </div>
      </label>
    </div>
  </div>
);

export default FileUpload;
