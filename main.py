from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import from our new api module
from api.router import router
from api.dependencies import driver

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This ensures the driver cleanly disconnects when you stop the server
    yield
    driver.close()

app = FastAPI(title="RippleTrace Risk API", lifespan=lifespan)

# Allow CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "RippleTrace API is live!"}

# Plug in the modular routes
app.include_router(router)