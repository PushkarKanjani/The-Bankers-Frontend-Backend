import React from 'react';

interface VaultPanelProps {
  resources: number[];
  onResourceChange: (index: number, value: number) => void;
  availableResources: number[];
}

export const VaultPanel: React.FC<VaultPanelProps> = ({
  resources,
  onResourceChange,
  availableResources,
}) => {
  const handleInputChange = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0) {
      onResourceChange(index, num);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-green-400 mb-4">
        Vault: Total System Resources
      </h2>
      <div className="space-y-4">
        {['A', 'B', 'C'].map((label, idx) => (
          <div key={label} className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Resource {label}:</label>
            <input
              type="number"
              min="0"
              value={resources[idx]}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              className="w-24 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-green-400 font-mono text-lg focus:outline-none focus:border-green-500"
            />
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-blue-400 mb-3">
            Currently Available:
          </h3>
          <div className="space-y-2">
            {['A', 'B', 'C'].map((label, idx) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Resource {label}:</span>
                <span className="text-blue-300 font-mono text-lg font-bold">
                  {availableResources[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
