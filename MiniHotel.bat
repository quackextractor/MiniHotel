@echo off

cd frontend
start cmd /k "npm i --legacy-peer-deps & npm run dev"

cd ..
cd backend
if not exist venv (python -m venv venv)
start cmd /k "venv\Scripts\activate & pip install -r requirements.txt & python main.py"