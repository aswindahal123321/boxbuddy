# utils/jwt_handler.py
import jwt, datetime, os
from fastapi import HTTPException, Cookie
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_change_me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def create_access_token(data: dict, expires_hours: int = 1):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=expires_hours)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        return jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
