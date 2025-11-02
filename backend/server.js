import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function isSafe(available, max, allocation) {
  const numProcesses = max.length;
  const numResources = available.length;

  // --- FIX: CONVERT ALL INPUTS TO NUMBERS ---
  let work = available.map(Number);
  let numMax = max.map(row => row.map(Number));
  let numAlloc = allocation.map(row => row.map(Number));

  let need = Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      need[i][j] = numMax[i][j] - numAlloc[i][j];
    }
  }

  let finish = Array(numProcesses).fill(false);
  let safeSequence = [];

  let count = 0;
  while (count < numProcesses) {
    let foundProcess = false;

    for (let p = 0; p < numProcesses; p++) {
      if (finish[p] === false) {
        let canRun = true;
        for (let j = 0; j < numResources; j++) {
          if (need[p][j] > work[j]) {
            canRun = false;
            break;
          }
        }

        if (canRun) {
          for (let k = 0; k < numResources; k++) {
            work[k] += numAlloc[p][k];
          }
          finish[p] = true;
          safeSequence.push(`P${p}`);
          count++;
          foundProcess = true;
        }
      }
    }

    if (foundProcess === false) {
      return {
        safe: false,
        message: `DEVA RE DEVA! Bank Kangaal Hone Wala Hai! (Bankrupt Risk!)`
      };
    }
  }

  return {
    safe: true,
    sequence: safeSequence,
    message: `✓ TENSION NAHI LENE KA! Bank Safe Hai. Safe sequence found: [${safeSequence.join(', ')}]`
  };
}

app.post("/api/check-safety", (req, res) => {
  try {
    const { available, max, allocation } = req.body;
    if (!available || !max || !allocation) {
      return res.status(400).json({ safe: false, message: "Error: Missing data." });
    }
    const result = isSafe(available, max, allocation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ safe: false, message: `Server Error: ${error.message}` });
  }
});

app.post("/api/request-resource", (req, res) => {
  try {
    const { available, max, allocation, requestingProcessID, requestAmount } = req.body;
    if (!available || !max || !allocation || !requestingProcessID || !requestAmount) {
      return res.status(400).json({ granted: false, message: "Error: Missing data." });
    }

    // --- FIX: CONVERT ALL INPUTS TO NUMBERS ---
    const p = parseInt(requestingProcessID.replace('P', ''));
    const numRequest = requestAmount.map(Number);
    const numAvailable = available.map(Number);
    const numMax = max.map(row => row.map(Number));
    const numAlloc = allocation.map(row => row.map(Number));

    let need = Array(numMax.length).fill(0).map(() => Array(numAvailable.length).fill(0));
    for (let i = 0; i < numMax.length; i++) {
      for (let j = 0; j < numAvailable.length; j++) {
        need[i][j] = numMax[i][j] - numAlloc[i][j];
      }
    }

    for (let j = 0; j < numAvailable.length; j++) {
      if (numRequest[j] > need[p][j]) {
        return res.json({
          granted: false,
          message: `LOAN DENIED! Itna paisa thodi dega. Limit me raho!`
        });
      }
    }

    for (let j = 0; j < numAvailable.length; j++) {
      if (numRequest[j] > numAvailable[j]) {
        return res.json({
          granted: false,
          message: `LOAN DENIED! Abhi paisa nahi hai. Baad me aa.`
        });
      }
    }

    let newAvailable = [...numAvailable];
    let newAllocation = JSON.parse(JSON.stringify(numAlloc));

    for (let j = 0; j < numAvailable.length; j++) {
      newAvailable[j] -= numRequest[j];
      newAllocation[p][j] += numRequest[j];
    }

    const result = isSafe(newAvailable, numMax, newAllocation);

    if (result.safe) {
      res.json({
        granted: true,
        message: `LOAN APPROVED. Ye le paisa, aur nikal.`,
        newAvailable: newAvailable,
        newAllocationRow: newAllocation[p]
      });
    } else {
      res.json({
        granted: false,
        message: `LOAN DENIED! Itna risk nahi lene ka. Bank doob jayega!`
      });
    }

  } catch (error) {
    res.status(500).json({ granted: false, message: `Server Error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ THE BANK-ERS server running on http://localhost:${PORT}`);
});
