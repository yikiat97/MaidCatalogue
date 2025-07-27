import React, { useState } from 'react';


const LinkGeneratorModal = ({ generatedLink, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = generatedLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Link Generated Successfully!
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={generatedLink}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded text-white text-sm font-medium transition-colors ${
              copySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkGeneratorModal;