import pyhibp
from pyhibp import pwnedpasswords as pw

# ОБЯЗАТЕЛЬНО указываем User-Agent, иначе API Have I Been Pwned не примет запросы
pyhibp.set_user_agent(ua="CheckMyPasswordAPI/1.0 (dudnikov.novopaviel@gmail.com)")

def is_password_pwned(password: str) -> dict:
    """
    Проверяет, был ли пароль найден в базах утечек с помощью API Have I Been Pwned.
    
    Возвращает словарь:
    {
        "pwned": bool,     # True, если пароль найден в утечках
        "count": int        # Количество раз, сколько он появлялся в утечках
    }
    """

    try:
        # Проверяем пароль
        count = pw.is_password_breached(password=password)
        
        return {
            "pwned": count > 0,
            "count": count or 0
        }

    except Exception as e:
        # Если произошла ошибка (например, недоступен API)
        return {
            "pwned": False,
            "count": 0,
            "error": str(e)
        }
