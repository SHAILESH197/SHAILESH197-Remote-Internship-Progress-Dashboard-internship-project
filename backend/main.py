from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.database import engine, Base
from app.models import user_model
from app.routes import user_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_routes.router)

@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is running "}