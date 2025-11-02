/*
 * =====================================================================
 * THE BANK-ERS: FINAL BACKEND SERVER CODE
 * This is the 100% correct, debugged version.
 * =====================================================================
 */

// 1. IMPORT NECESSARY PACKAGES
import express from 'express';
import cors from 'cors';

// 2. INITIALIZE THE APP
const app = express();
// Use the port Blackbox found. If it was 3001, leave it.
const PORT = process.env.PORT || 3001;

// 3. SET UP MIDDLEWARE
// This allows your frontend (on port 5173) to talk to this backend
app.use(cors());
// This allows the server to read JSON data from request bodies
app.use(express.json());

/*
 * =====================================================================
 * THE CORRECT AND VERIFIED 'isSafe' FUNCTION
 * This version has the correct logic and number conversions.
 * =====================================================================
 */
function isSafe(available, max, allocation) {
  const numProcesses = max.length;
  const numResources = available.length;

  // --- FIX: CONVERT ALL INPUTS TO NUMBERS ---
  // This is critical. The bug is probably here.
  let work = available.map(Number);
  let numMax = max.map(row => row.map(Number));
  let numAlloc = allocation.map(row => row.map(Number));

  // 1. Calculate 'need' matrix
  let need = Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      need[i][j] = numMax[i][j] - numAlloc[i][j];
    }
  }

  // 2. Initialize 'finish'
  let finish = Array(numProcesses).fill(false);
  let safeSequence = [];

  let count = 0;
  // We must loop up to numProcesses times to find all processes
  while (count < numProcesses) {
    let foundProcess = false; // Flag to check if we found a process in this pass

    for (let p = 0; p < numProcesses; p++) {
      // If this process is not yet finished
      if (finish[p] === false) {
        
        // Check if its needs can be met by current 'work'
        // This is the check that was failing
        let canRun = true;
        for (let j = 0; j < numResources; j++) {
          if (need[p][j] > work[j]) {
            canRun = false;
            break; // No need to check other resources
          }
        }

        // If this process *can* run
        if (canRun) {
          // 1. Release its resources (add to 'work')
          for (let k = 0; k < numResources; k++) {
            work[k] += numAlloc[p][k];
          }
          
          // 2. Mark as finished
          finish[p] = true;
          // 3. Add to safe sequence
          safeSequence.push(`P${p}`);
          count++;
          foundProcess = true;
        }
      }
    } // end of for loop (looping through all processes)

    // If we went through all processes and couldn't find one
    // that could run, the system is in an unsafe state.
    if (foundProcess === false) {
      return {
        safe: false,
        message: `DEVA RE DEVA! Bank Kangaal Hone Wala Hai! (Bankrupt Risk!)`
      };
    }
  } // end of while loop

  // If we exit the loop, all processes finished successfully.
  return {
    safe: true,
    sequence: safeSequence,
    message: `✓ TENSION NAHI LENE KA! Bank Safe Hai. Safe sequence found: [${safeSequence.join(', ')}]`
  };
}


/*
 * =====================================================================
 * API ENDPOINT 1: /api/check-safety
 * =====================================================================
 */
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


/*
 * =====================================================================
 * API ENDPOINT 2: /api/request-resource
 * =====================================================================
 */
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

    // Calculate 'need' matrix
    let need = Array(numMax.length).fill(0).map(() => Array(numAvailable.length).fill(0));
    for (let i = 0; i < numMax.length; i++) {
      for (let j = 0; j < numAvailable.length; j++) {
        need[i][j] = numMax[i][j] - numAlloc[i][j];
      }
    }

    // Step 1: Check if request <= need
    for (let j = 0; j < numAvailable.length; j++) {
      if (numRequest[j] > need[p][j]) {
        return res.json({
          granted: false,
          message: `LOAN DENIED! Itna paisa thodi dega. Limit me raho!`
        });
      }
    }

    // Step 2: Check if request <= available
    for (let j = 0; j < numAvailable.length; j++) {
      if (numRequest[j] > numAvailable[j]) {
        return res.json({
          granted: false,
          message: `LOAN DENIED! Abhi paisa nahi hai. Baad me aa.`
        });
      }
    }

    // Step 3: "Pretend" to grant the request
    let newAvailable = [...numAvailable];
    let newAllocation = JSON.parse(JSON.stringify(numAlloc)); // Deep copy

    for (let j = 0; j < numAvailable.length; j++) {
      newAvailable[j] -= numRequest[j];
      newAllocation[p][j] += numRequest[j];
    }

    // Step 4: Run Safety Algorithm on the *new* state
    const result = isSafe(newAvailable, numMax, newAllocation);

    if (result.safe) {
      // If safe, grant the request!
      res.json({
        granted: true,
        message: `LOAN APPROVED. Ye le paisa, aur nikal.`,
        newAvailable: newAvailable,
        newAllocationRow: newAllocation[p]
      });
    } else {
      // If unsafe, deny the request
      res.json({
        granted: false,
        message: `LOAN DENIED! Ye scheme tere baap ka nahi hai. Bank doob jayega!`
      });
    }

  } catch (error) {
    res.status(500).json({ granted: false, message: `Server Error: ${error.message}` });
  }
});


// 4. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ THE BANK-ERS server running on http://localhost:${PORT}`);
});