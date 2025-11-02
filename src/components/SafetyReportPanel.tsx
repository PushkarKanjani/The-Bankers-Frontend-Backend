import React from 'react';
import { SafetyStatus } from '../types';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface SafetyReportPanelProps {
  safetyStatus: SafetyStatus;
}

export const SafetyReportPanel: React.FC<SafetyReportPanelProps> = ({
  safetyStatus,
}) => {
  const getStatusDisplay = () => {
    switch (safetyStatus.status) {
      case 'safe':
        return (
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-green-500" />
            <div>
              <p className="text-green-400 text-lg font-bold">
                PROVISIONING SAFE: Sequence [{safetyStatus.sequence.join(', ')}]
              </p>
              <p className="text-gray-400 text-sm mt-1">{safetyStatus.message}</p>
            </div>
          </div>
        );
      case 'unsafe':
        return (
          <div className="flex items-center gap-3">
            <ShieldAlert size={32} className="text-red-500" />
            <div>
              <p className="text-red-400 text-lg font-bold">
                PROVISIONING UNSAFE: Deadlock Possible!
              </p>
              <p className="text-gray-400 text-sm mt-1">{safetyStatus.message}</p>
            </div>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center gap-3">
            <ShieldQuestion size={32} className="text-gray-500" />
            <div>
              <p className="text-gray-500 text-lg font-bold">
                Run audit to check status
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Click "Audit: Check Provisioning Status" to analyze the current state
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Bank Ka Haal</h2>
      <div className="bg-gray-900 rounded p-6 border border-gray-700">
        {getStatusDisplay()}
      </div>
    </div>
  );
};
