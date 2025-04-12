from fastapi import FastAPI, Body # type: ignore
import subprocess

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.post("/check_password")
def check_password(password: str = Body(..., embed=True)):
    result = subprocess.run(
        ["./main.exe"],
        input=password,  # Убрали .encode() - передаём строку напрямую
        capture_output=True,
        text=True,  # Обрабатываем ввод/вывод как текст (str)
        encoding='utf-8'  # Явно указываем кодировку (опционально)
    )
    return {"strength": result.stdout.strip()}