# main.py
from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import bcrypt

from utils.jwt_handler import create_access_token, verify_token

app = FastAPI()

# --- point to frontend/ outside the service folder ---
BASE_DIR = Path(__file__).resolve().parents[2]     # goes from services/auth-service -> meal-subscription
# Correct paths to your frontend folder
TEMPLATES_DIR = BASE_DIR / "frontend"
STATIC_DIR = TEMPLATES_DIR / "assets"

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
app.mount("/assets", StaticFiles(directory=str(STATIC_DIR)), name="assets")
# -----------------------------------------------------

# simple in-memory store for demo
users_db = []  # [{ "username": str, "password": <hashed_bytes> }]

@app.get("/", response_class=HTMLResponse)
def root():
    # send users to login
    return RedirectResponse(url="/login", status_code=303)

@app.get("/register", response_class=HTMLResponse)
def get_register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
def post_register(username: str = Form(...), password: str = Form(...)):
    # check duplicates (basic)
    if any(u["username"] == username for u in users_db):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users_db.append({"username": username, "password": hashed})
    return RedirectResponse(url="/login", status_code=303)

@app.get("/login", response_class=HTMLResponse)
def get_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
def post_login(username: str = Form(...), password: str = Form(...)):
    user = next((u for u in users_db if u["username"] == username), None)
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": username})
    resp = RedirectResponse(url="/shop", status_code=303)
    resp.set_cookie(key="access_token", value=token, httponly=True, samesite="lax")
    return resp

@app.get("/shop", response_class=HTMLResponse)
def get_products(request: Request, token_payload: dict = Depends(verify_token)):
    user = token_payload["sub"]
    # render the protected page
    return templates.TemplateResponse("shop.html", {"request": request, "user": user})

@app.post("/logout")
def logout():
    resp = RedirectResponse(url="/login", status_code=303)
    resp.delete_cookie("access_token")
    return resp
