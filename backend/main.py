import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import test_db_connection
from routers.auth import router as auth_router
from routers.items import router as items_router
from routers.player import router as player_router

app = FastAPI(
    title="CS2 WeaponPaints Web API",
    description="""
    API REST moderna para gerenciamento de Skins, Facas, Luvas, Agentes e Loadouts no Counter-Strike 2.
    Integrada com o plugin CounterStrikeSharp (WeaponPaints) e banco de dados MySQL.
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS para permitir acesso de qualquer frontend (Vercel, Localhost, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registro dos Routers
app.include_router(auth_router)
app.include_router(items_router)
app.include_router(player_router)

@app.get("/", tags=["Status"])
def root():
    """Endpoint inicial de verificação de status da API e banco de dados."""
    db_status = test_db_connection()
    return {
        "name": "CS2 WeaponPaints API",
        "status": "online",
        "version": "2.0.0",
        "database_connected": db_status,
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
