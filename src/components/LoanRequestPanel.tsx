import React, { useState } from 'react';

interface LoanRequestPanelProps {
  onSubmitRequest: (processId: string, request: number[]) => void;
  errorMessage: string;
}

export const LoanRequestPanel: React.FC<LoanRequestPanelProps> = ({
  onSubmitRequest,
  errorMessage,
}) => {
  const [selectedProcess, setSelectedProcess] = useState('P0');
  const [requestAmounts, setRequestAmounts] = useState([0, 0, 0]);

  const handleRequestChange = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0) {
      const newAmounts = [...requestAmounts];
      newAmounts[index] = num;
      setRequestAmounts(newAmounts);
    }
  };

  const handleSubmit = () => {
    onSubmitRequest(selectedProcess, requestAmounts);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">
        Process Loan Requests
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Client ID:
          </label>
          <select
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-yellow-400 font-mono focus:outline-none focus:border-yellow-500"
          >
            {['P0', 'P1', 'P2', 'P3', 'P4'].map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Loan Amount Requested:
          </label>
          <div className="space-y-2">
            {['A', 'B', 'C'].map((label, idx) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400">Request {label}:</span>
                <input
                  type="number"
                  min="0"
                  value={requestAmounts[idx]}
                  onChange={(e) => handleRequestChange(idx, e.target.value)}
                  className="w-24 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-yellow-400 font-mono focus:outline-none focus:border-yellow-500"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold rounded transition-colors"
        >
          Submit Loan Request
        </button>
        {errorMessage && (
          <div className="mt-2 p-3 bg-red-900/30 border border-red-600 rounded">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
