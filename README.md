# EduGenie — Google Gemini Powered Learning Assistant

EduGenie is a complete educational AI web application built with FastAPI and a simple HTML/CSS/JavaScript frontend.

## Features

- **Q&A** — ask academic/general learning questions.
- **Explain** — simplify complex topics for beginners.
- **Quiz** — generate exactly 3 MCQs with 4 options and instant answer feedback.
- **Summary** — turn long educational text into concise revision notes.
- **Learning Path** — generate a beginner-to-advanced structured study plan.

## Project structure

```text
EduGenie/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── gemini_client.py
│   └── ai_modules.py
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
├── requirements.txt
├── run.bat
├── run.sh
└── README.md
```

## Requirements

- Python 3.10 or newer
- A Google Gemini API key

## Setup — Windows

1. Extract the ZIP.
2. Open the `EduGenie` folder in Command Prompt/PowerShell.
3. Run:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env`.
5. Open `.env` and replace:

```text
GEMINI_API_KEY=PASTE_YOUR_API_KEY_HERE
```

with your real Gemini API key.
6. Start the application:

```powershell
python -m uvicorn app.main:app --reload
```

7. Open:

```text
http://127.0.0.1:8000
```

### Easier Windows method

After adding your API key to `.env`, double-click `run.bat`.

## Setup — macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`, add your Gemini API key, then:

```bash
chmod +x run.sh
./run.sh
```

Open `http://127.0.0.1:8000`.

## API endpoints

- `GET /` — web application
- `GET /health` — health check
- `POST /qa`
- `POST /explain`
- `POST /quiz`
- `POST /summarize`
- `POST /learn/recommendations`

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Important

Do not put your API key directly inside Python or JavaScript files. Keep it in `.env`, which is ignored by Git.

The original sample project describes FastAPI endpoints for `/qa`, `/explain`, `/quiz`, `/summarize`, and `/learn/recommendations`, along with a simple HTML/CSS interface. This implementation follows that structure while providing a complete runnable frontend/backend project.
