import React from 'react';
import { Shield, RotateCcw } from 'lucide-react';

interface SystemControlsPanelProps {
  onCheckSafety: () => void;
  onReset: () => void;
}

export const SystemControlsPanel: React.FC<SystemControlsPanelProps> = ({
  onCheckSafety,
  onReset,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">System Controls</h2>
      <div className="space-y-3">
        <button
          onClick={onCheckSafety}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2"
        >
          <Shield size={20} />
          Audit: Check System Safety
        </button>
        <button
          onClick={onReset}
          className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Reset All
        </button>
      </div>
    </div>
  );
};
