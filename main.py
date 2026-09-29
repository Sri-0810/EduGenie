from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from .ai_modules import (
    answer_question,
    explain_topic,
    generate_quiz,
    summarize_text,
    learning_path,
)

app = FastAPI(
    title="EduGenie",
    description="AI-powered learning assistant",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=20000)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health():
    return {"status": "ok", "service": "EduGenie"}

@app.post("/qa")
async def qa(payload: TextRequest):
    try:
        return {"result": answer_question(payload.text)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/explain")
async def explain(payload: TextRequest):
    try:
        return {"result": explain_topic(payload.text)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/quiz")
async def quiz(payload: TextRequest):
    try:
        return {"quiz": generate_quiz(payload.text)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/summarize")
async def summarize(payload: TextRequest):
    try:
        return {"result": summarize_text(payload.text)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@app.post("/learn/recommendations")
async def recommendations(payload: TextRequest):
    try:
        return {"result": learning_path(payload.text)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
