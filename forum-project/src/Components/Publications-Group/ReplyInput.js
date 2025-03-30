// /src/components/Publications/ReplyInput.js
import React, { useState, useRef, useEffect } from 'react';

export default function ReplyInput({ placeholder, onSubmit, inputKey }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // Auto-focus when the input mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      key={inputKey}
      ref={inputRef}
      type="text"
      className="w-full p-2 bg-blue-50 rounded-lg border border-blue-100 outline-none"
      placeholder={placeholder}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && text.trim()) {
          onSubmit(text);
          setText('');
        }
      }}
    />
  );
}
