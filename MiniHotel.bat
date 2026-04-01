@echo off

cd MiniHotel-frontend
start cmd /k "npm i --legacy-peer-deps & npm run dev"

cd ..
cd MiniHotel-backend
start cmd /k "pip install -r requirements.txt & python main.py"