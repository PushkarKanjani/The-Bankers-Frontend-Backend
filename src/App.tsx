import { useState, useEffect } from 'react';
import { VaultPanel } from './components/VaultPanel';
import { LoanRequestPanel } from './components/LoanRequestPanel';
import { SystemControlsPanel } from './components/SystemControlsPanel';
import { AllocationTable } from './components/AllocationTable';
import { MaxTable } from './components/MaxTable';
import { NeedTable } from './components/NeedTable';
import { AuditLogPanel } from './components/AuditLogPanel';
import { SafetyReportPanel } from './components/SafetyReportPanel';
import { AuditLog, SafetyStatus } from './types';
import { checkSafety, requestResource } from './api/bankApi';
import { getTimestamp } from './utils/dateUtils';
import { Database } from 'lucide-react';

const DEFAULT_RESOURCES = [10, 5, 7];
const EMPTY_MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function App() {
  const [resources, setResources] = useState<number[]>(DEFAULT_RESOURCES);
  const [allocation, setAllocation] = useState<number[][]>(
    EMPTY_MATRIX.map((row) => [...row])
  );
  const [max, setMax] = useState<number[][]>(EMPTY_MATRIX.map((row) => [...row]));
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>({
    status: 'pending',
    sequence: [],
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const calculateAvailableResources = (): number[] => {
    const allocated = allocation.reduce(
      (acc, row) => {
        row.forEach((val, idx) => {
          acc[idx] += val;
        });
        return acc;
      },
      [0, 0, 0]
    );
    return resources.map((res, idx) => res - allocated[idx]);
  };

  const calculateNeed = (): number[][] => {
    return max.map((maxRow, pIdx) =>
      maxRow.map((maxVal, rIdx) => maxVal - allocation[pIdx][rIdx])
    );
  };

  const addLog = (message: string) => {
    const newLog: AuditLog = {
      timestamp: getTimestamp(),
      message,
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const handleResourceChange = (index: number, value: number) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
    addLog(`Bank resource ${['Cash (Lakhs)', 'Gold (KGs)', 'Property (Plots)'][index]} updated to ${value}`);
  };

  const handleAllocationChange = (
    processIndex: number,
    resourceIndex: number,
    value: number
  ) => {
    const newAllocation = allocation.map((row) => [...row]);
    newAllocation[processIndex][resourceIndex] = value;
    setAllocation(newAllocation);
    addLog(
      `Allocation updated: ${['Raju', 'Shyam', 'Baburao', 'Totla Seth', 'Anuradha'][processIndex]} Resource ${['Cash (Lakhs)', 'Gold (KGs)', 'Property (Plots)'][resourceIndex]} = ${value}`
    );
  };

  const handleMaxChange = (
    processIndex: number,
    resourceIndex: number,
    value: number
  ) => {
    const newMax = max.map((row) => [...row]);
    newMax[processIndex][resourceIndex] = value;
    setMax(newMax);
    addLog(
      `Max updated: ${['Raju', 'Shyam', 'Baburao', 'Totla Seth', 'Anuradha'][processIndex]} Resource ${['Cash (Lakhs)', 'Gold (KGs)', 'Property (Plots)'][resourceIndex]} = ${value}`
    );
  };

  const handleCheckSafety = async () => {
    setErrorMessage('');
    addLog('Running provisioning audit...');
    try {
      const available = calculateAvailableResources();
      const response = await checkSafety(available, allocation, max);

      if (response.safe) {
        setSafetyStatus({
          status: 'safe',
          sequence: response.sequence,
          message: response.message,
        });
        addLog(`✓ ${response.message}`);
      } else {
        setSafetyStatus({
          status: 'unsafe',
          sequence: [],
          message: response.message,
        });
        addLog(`✗ ${response.message}`);
      }
    } catch (error) {
      addLog(`Error: Failed to check provisioning - ${error}`);
      setErrorMessage('Failed to connect to server. Is it running?');
    }
  };

  const handleSubmitRequest = async (processId: string, requestAmount: number[]) => {
    setErrorMessage('');
    setSuccessMessage('');

    const available = calculateAvailableResources();
    const hasEnoughResources = requestAmount.every((req, idx) => req <= available[idx]);

    if (!hasEnoughResources) {
      const errorMsg = `Invalid request: Not enough available resources for ${processId}`;
      setErrorMessage(errorMsg);
      addLog(`✗ ${errorMsg}`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    addLog(`Processing loan request from ${processId}...`);
    try {
      const response = await requestResource(
        available,
        allocation,
        max,
        processId,
        requestAmount
      );

      if (response.granted) {
        // We need to *correctly* update the 2D 'allocation' matrix.

        // Find the index of the customer that just made the request
        const customerNames = ["Raju", "Shyam", "Baburao", "Totla Seth", "Anuradha"];
        const processIndex = customerNames.indexOf(processId);

        // Create a new 2D array by mapping over the old one
        const newAllocationMatrix = allocation.map((row, index) => {
          if (index === processIndex) {
            // If this is the row we just updated, return the new row from the server
            return response.newAllocation?.[processIndex] || row;
          } else {
            // Otherwise, return the old row
            return row;
          }
        });

        // Set the new, correct 2D matrix as the state.
        // This will also cause the 'Currently Available' panel to update automatically.
        setAllocation(newAllocationMatrix);
        addLog(`✓ ${response.message}`);
        setSuccessMessage("LOAN APPROVED. Ye le paisa, aur nikal.");
        setTimeout(() => setSuccessMessage(''), 3000);
        setErrorMessage('');
      } else {
        setErrorMessage(response.message);
        addLog(`✗ ${response.message}`);
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      const errorMsg = 'Failed to connect to server. Is it running?';
      addLog(`Error: ${errorMsg}`);
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleReset = () => {
    setResources(DEFAULT_RESOURCES);
    setAllocation(EMPTY_MATRIX.map((row) => [...row]));
    setMax(EMPTY_MATRIX.map((row) => [...row]));
    setSafetyStatus({
      status: 'pending',
      sequence: [],
      message: '',
    });
    setErrorMessage('');
    addLog('Bank reset to default values');
  };

  useEffect(() => {
    addLog('Laxmi Chit Fund system initialized');
  }, []);

  const availableResources = calculateAvailableResources();
  const need = calculateNeed();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database size={40} className="text-green-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Laxmi Chit Fund
          </h1>
        </div>
        <p className="text-gray-400 text-sm">
          21 Din Mein Paisa Double!
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6">
          <VaultPanel
            resources={resources}
            onResourceChange={handleResourceChange}
            availableResources={availableResources}
          />
          <LoanRequestPanel
            onSubmitRequest={handleSubmitRequest}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
          <SystemControlsPanel
            onCheckSafety={handleCheckSafety}
            onReset={handleReset}
          />
        </div>

        <div className="space-y-6">
          <AllocationTable
            allocation={allocation}
            onAllocationChange={handleAllocationChange}
          />
          <MaxTable max={max} onMaxChange={handleMaxChange} />
          <NeedTable need={need} />
        </div>

        <div className="space-y-6">
          <AuditLogPanel logs={logs} />
          <SafetyReportPanel safetyStatus={safetyStatus} />
        </div>
      </div>
    </div>
  );
}

export default App;
