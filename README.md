# ⬡ AI Arena — Multi-Model AI Comparison App

> Ask once. Compare Gemini, Groq, and Mistral side-by-side. Get a synthesized verdict.

---

## 📁 Project Structure

```
ai-arena/
├── backend/
│   ├── app.py                    # Flask entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── __init__.py
│   │   └── ask.py                # POST /ask endpoint
│   └── services/
│       ├── __init__.py
│       ├── ai_dispatcher.py      # Parallel model execution
│       ├── model_gemini.py       # Gemini service (mock + real stub)
│       ├── model_groq.py         # Groq service (mock + real stub)
│       ├── model_mistral.py      # Mistral service (mock + real stub)
│       └── summarizer.py         # Final verdict generator
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx              # React entry
        ├── App.jsx               # Root component + state
        ├── api.js                # Fetch wrapper
        ├── hooks/
        │   ├── useTheme.js       # Dark/light theme state
        │   └── useHistory.js     # Search history state
        ├── components/
        │   ├── LandingPage.jsx   # Animated intro screen
        │   ├── Header.jsx        # Nav + theme toggle
        │   ├── Sidebar.jsx       # History panel
        │   ├── QueryInput.jsx    # Search bar + model checkboxes
        │   ├── ResponseCard.jsx  # Individual AI response
        │   └── SummaryPanel.jsx  # Final verdict display
        └── styles/
            └── global.css        # CSS variables, animations, theme
```

---

## ▶️ Setup Instructions

### 1. Clone / Download the project
```bash
git clone <your-repo-url>
cd ai-arena
```

### 2. Backend Setup (Python / Flask)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Copy .env and add your keys (optional for mock mode)
cp .env.example .env

# Run the Flask server
python app.py
# Server starts at: http://localhost:5000
```

### 3. Frontend Setup (React / Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# App opens at: http://localhost:3000
```

### 4. Open the App
Navigate to **http://localhost:3000** in your browser.

---

## 🔗 API Reference

### `POST /ask`

**Request:**
```json
{
  "query": "What is the best way to learn machine learning?",
  "models": ["gemini", "groq", "mistral"]
}
```

**Response:**
```json
{
  "responses": {
    "gemini": {
      "text": "Gemini's Perspective: That's a thoughtful question...",
      "error": null
    },
    "groq": {
      "text": "Groq (LLaMA) Response: Interesting query...",
      "error": null
    },
    "mistral": {
      "text": "Mistral's Analysis: Regarding...",
      "error": null
    }
  },
  "summary": "## Final Verdict\n\nBased on 3 models..."
}
```

**Error Response (400):**
```json
{ "error": "query is required" }
```

---

## 🔑 Adding Real API Keys

### Gemini
1. Get key: https://aistudio.google.com/app/apikey
2. `pip install google-generativeai`
3. In `.env`: `GEMINI_API_KEY=your_key`
4. Uncomment real API code in `services/model_gemini.py`

### Groq
1. Get key: https://console.groq.com
2. `pip install groq`
3. In `.env`: `GROQ_API_KEY=your_key`
4. Uncomment real API code in `services/model_groq.py`

### Mistral
1. Get key: https://console.mistral.ai
2. `pip install mistralai`
3. In `.env`: `MISTRAL_API_KEY=your_key`
4. Uncomment real API code in `services/model_mistral.py`

---

## 🎨 Features

| Feature | Status |
|---|---|
| Dark / Light theme toggle | ✅ |
| Animated landing page | ✅ |
| Model selection checkboxes | ✅ |
| Parallel API calls (threading) | ✅ |
| Response cards with fade-in | ✅ |
| Final verdict summary | ✅ |
| Search history sidebar | ✅ |
| Loading skeleton cards | ✅ |
| Error handling (front + back) | ✅ |
| Responsive layout | ✅ |

---

## 🧩 Extending the Project

**Add a new model:**
1. Create `backend/services/model_newai.py`
2. Add it to `MODEL_REGISTRY` in `ai_dispatcher.py`
3. Add its chip to `MODELS` array in `QueryInput.jsx`
4. Add its meta to `MODEL_META` in `ResponseCard.jsx`

**Add response streaming:**
- Use Flask's `Response` with `stream_with_context`
- Use `EventSource` or `fetch` with `ReadableStream` on frontend

**Add persistent history:**
- Replace `useHistory` state with `localStorage` calls
- Or add a SQLite DB to Flask backend

**Deploy:**
- Backend: Render, Railway, or Fly.io (free tier)
- Frontend: Vercel or Netlify
- Update `API_BASE` in `frontend/src/api.js` to production URL
