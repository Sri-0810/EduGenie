@echo off
echo Starting EduGenie...
if not exist .venv (
  python -m venv .venv
)
call .venv\Scripts\activate
pip install -r requirements.txt
if not exist .env (
  copy .env.example .env
  echo.
  echo IMPORTANT: Edit .env and add your GEMINI_API_KEY, then run this file again.
  pause
  exit /b
)
python -m uvicorn app.main:app --reload
