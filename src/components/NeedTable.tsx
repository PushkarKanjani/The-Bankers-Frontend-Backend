import React from 'react';

interface NeedTableProps {
  need: number[][];
}

export const NeedTable: React.FC<NeedTableProps> = ({ need }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-pink-400 mb-4">
        Ab Aur Kitna Chahiye (Need)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-3 text-left text-gray-300 font-semibold border border-gray-700">
                Customer Ka Naam
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                Cash (Lakhs)
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                Gold (KGs)
              </th>
              <th className="px-4 py-3 text-center text-gray-300 font-semibold border border-gray-700">
                Property (Plots)
              </th>
            </tr>
          </thead>
          <tbody>
            {['Raju', 'Shyam', 'Baburao', 'Totla Seth', 'Anuradha'].map((processId, pIdx) => (
              <tr key={processId} className="hover:bg-gray-750">
                <td className="px-4 py-3 text-pink-400 font-mono font-semibold border border-gray-700">
                  {processId}
                </td>
                {[0, 1, 2].map((rIdx) => (
                  <td
                    key={rIdx}
                    className="px-4 py-3 text-center text-pink-300 font-mono border border-gray-700 bg-gray-900"
                  >
                    {need[pIdx][rIdx]}
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
