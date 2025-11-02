import React from 'react';

interface AllocationTableProps {
  allocation: number[][];
  onAllocationChange: (processIndex: number, resourceIndex: number, value: number) => void;
}

export const AllocationTable: React.FC<AllocationTableProps> = ({
  allocation,
  onAllocationChange,
}) => {
  const handleInputChange = (pIdx: number, rIdx: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num >= 0) {
      onAllocationChange(pIdx, rIdx, num);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-purple-400 mb-4">
        Client-Held Assets (Current Allocation)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-3 text-left text-gray-300 font-semibold border border-gray-700">
                Client ID
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                A
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                B
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                C
              </th>
            </tr>
          </thead>
          <tbody>
            {['P0', 'P1', 'P2', 'P3', 'P4'].map((processId, pIdx) => (
              <tr key={processId} className="hover:bg-gray-750">
                <td className="px-4 py-3 text-purple-400 font-mono font-semibold border border-gray-700">
                  {processId}
                </td>
                {[0, 1, 2].map((rIdx) => (
                  <td key={rIdx} className="px-2 py-2 border border-gray-700">
                    <input
                      type="number"
                      min="0"
                      value={allocation[pIdx][rIdx]}
                      onChange={(e) => handleInputChange(pIdx, rIdx, e.target.value)}
                      className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-purple-300 font-mono text-center focus:outline-none focus:border-purple-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
