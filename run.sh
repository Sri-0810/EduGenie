#!/usr/bin/env bash
set -e
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "IMPORTANT: Edit .env and add your GEMINI_API_KEY, then run ./run.sh again."
  exit 0
fi
python -m uvicorn app.main:app --reload
