# 🛑 TEAM STANDARDS & PORT CONFIGURATION

**DO NOT CHANGE THESE PORTS WITHOUT TEAM CONSENSUS.** 
Changing these locally and pushing will break the application for everyone else.

## 1. Required Ports

| Service | Technology | Port | Hardcoded In |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | `5173` | `package.json` |
| **User/Auth Backend** | Node.js (Express) | **`5001`** | `src/api`, `src/pages`, `server/index.js` |
| **AI/RAG Backend** | Python (FastAPI) | **`8000`** | `src/pages/ChatPage.tsx`, `RUN_BACKEND.bat` |
| **Database** | MongoDB Atlas | `27017` | `.env` (MONGO_URI) |

---

## 2. Environment Variables (`.env`)

### **Node Backend (`server/.env`)**
```ini
PORT=5001
MONGO_URI=mongodb+srv://... (Must include 'tlsAllowInvalidCertificates' if on restrictive network)
JWT_SECRET=...
```

### **Python Backend (`backend_rag/.env`)**
```ini
MONGO_URI=mongodb+srv://...
# No PORT variable needed (Hardcoded to 8000 in main.py/scripts)
```

---

## 3. "Git Pull" Survival Guide

If `git pull` breaks your local setup:

1.  **Don't panic about `database.py`**:
    -   If it disappears, restore the standard version.
    -   *Action*: We should add `backend_rag/database.py` to `.gitignore` if it contains credentials, OR commit a standard version and stop changing it.

2.  **Don't Change Hardcoded URLs**:
    -   The frontend currently points to `http://localhost:5001` and `http://localhost:8000`.
    -   **Do not change this to 3000 or 5000** on your machine.

3.  **Network Issues**:
    -   If you switch Wi-Fi, you **MUST** whitelist your new IP on MongoDB Atlas.
    -   *Evidence*: `Connection reset` or `TLS handshake failed`.

---

## 4. Run Order

Always start in this order:
1.  **Python Backend**: `RUN_BACKEND.bat` (Port 8000)
2.  **Node Backend**: `cd server` -> `npm start` (Port 5001)
3.  **Frontend**: `RUN_FRONTEND.bat` (Port 5173)
