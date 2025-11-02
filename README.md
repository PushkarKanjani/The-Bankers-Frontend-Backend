# Laxmi Chit Fund
"21 Din Mein Paisa Double!"
This is a desktop application and Banker's Algorithm simulator, built as a project for an Operating Systems course. It demonstrates the principles of deadlock avoidance in a multi-process, multi-resource system, all wrapped in a Hera Pheri theme.

Features
Full-Stack Application: A React + TypeScript frontend packaged as a standalone .exe with Electron.

Live Backend: A Node.js + Express server handling all logic, deployed live on Render.

Banker's Algorithm: Implements both the Safety Algorithm (Audit) and the Request Algorithm (Loan Request) to ensure the system never enters an unsafe state (i.e., the bank never goes bankrupt).

Themed UI: The "clients" (Raju, Shyam, Baburao) and "resources" (Cash, Gold, Property) provide a fun, practical analogy for OS concepts.

How to Run
Run the Installer: The easiest way is to run the Laxmi Chit Fund Setup.exe file (found in the dist or release folder).

No Local Server Needed: The app connects directly to the live backend hosted on Render.

Test Scenarios
1. Safe State (Test Case)
Bank Ki Tijori (Total): Cash: 10, Gold: 5, Property: 7

Baata Hua Paisa (Current Loans):

Raju: [0, 1, 0]

Shyam: [2, 0, 0]

Baburao: [3, 0, 2]

Totla Seth: [2, 1, 1]

Anuradha: [0, 0, 2]

Kagaz Ke Hisaab Se (Max Loan):

Raju: [7, 5, 3]

Shyam: [3, 2, 2]

Baburao: [9, 0, 2]

Totla Seth: [2, 2, 2]

Anuradha: [4, 3, 3]

Result: Click "Audit" -> SAFE: [Shyam, Totla Seth, Anuradha, Raju, Baburao]

2. Unsafe State (Test Case)
Use the same Allocation/Max tables as above, but set Tijori (Total) to: [8, 2, 5]

Result: Click "Audit" -> UNSAFE: "DEVA RE DEVA! Bank Kangaal Hone Wala Hai!"
