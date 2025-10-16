from fastapi import FastAPI, Body 
from fastapi.middleware.cors import CORSMiddleware 
from checkPassswrd import is_password_pwned

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
    result = is_password_pwned(password)

    if result.get("error"):
        return {"error": result["error"]}

    return {
        "pwned": result["pwned"],
        "count": result["count"],
    }