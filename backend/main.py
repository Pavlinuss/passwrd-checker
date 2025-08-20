from fastapi import FastAPI, Body 
from fastapi.middleware.cors import CORSMiddleware 
import subprocess

app = FastAPI()

# Настройка CORS (разрешить запросы с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки. В продакшене укажите конкретный домен.
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],  # Явно разрешаем OPTIONS и POST
    allow_headers=["*"],
)

@app.post("/")
def check_password(password: str = Body(..., embed=True)):
    result = subprocess.run(
        ["./checkPasswordStrengthCPP"],
        input=password,  # Убрали .encode() - передаём строку напрямую
        capture_output=True,
        text=True,  # Обрабатываем ввод/вывод как текст (str)
        encoding='utf-8'  # Явно указываем кодировку (опционально)
    )
    return {"strength": result.stdout.strip()}