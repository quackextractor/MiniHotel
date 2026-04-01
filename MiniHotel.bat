@echo off

cd frontend
start cmd /k "npm i --legacy-peer-deps & npm run dev"

cd ..
cd backend
start cmd /k "if not exist venv (python -m venv venv) & venv\Scripts\activate & pip install -r requirements.txt & python main.py"