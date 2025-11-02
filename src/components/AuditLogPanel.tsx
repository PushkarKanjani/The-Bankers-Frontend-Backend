import React, { useEffect, useRef } from 'react';
import { AuditLog } from '../types';

interface AuditLogPanelProps {
  logs: AuditLog[];
}

export const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        Transaction & Safety Audit Log
      </h2>
      <div
        ref={logContainerRef}
        className="bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm border border-gray-700"
      >
        {logs.length === 0 ? (
          <p className="text-gray-500">No audit entries yet. Perform an action to begin logging.</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-300">
                <span className="text-blue-500">{log.timestamp}</span> - {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
