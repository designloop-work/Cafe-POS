@echo off
echo Starting POS Backend...
cd /d "C:\Users\hp\OneDrive\Desktop\POS\backend"
call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000
pause
