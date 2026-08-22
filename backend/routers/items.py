import os
import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/items", tags=["Catálogo de Itens"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json_file(filename: str) -> Any:
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# Carrega os dados em memória no startup
weapons_data = load_json_file("weapons.json")
knives_data = load_json_file("knives.json")
gloves_data = load_json_file("gloves.json")
agents_data = load_json_file("agents.json")
music_data = load_json_file("music.json")
skins_data = load_json_file("skins.json")

CATEGORIES = [
    {"id": "rifles", "name": "Rifles", "icon": "rifle"},
    {"id": "sniper_rifles", "name": "Rifles de Precisão (Snipers)", "icon": "sniper"},
    {"id": "pistols", "name": "Pistolas", "icon": "pistol"},
    {"id": "smg", "name": "Submetralhadoras (SMGs)", "icon": "smg"},
    {"id": "shotguns", "name": "Espingardas", "icon": "shotgun"},
    {"id": "machine_guns", "name": "Metralhadoras Pesadas", "icon": "heavy"},
    {"id": "knives", "name": "Facas", "icon": "knife"},
    {"id": "gloves", "name": "Luvas", "icon": "gloves"},
    {"id": "agents", "name": "Agentes", "icon": "agent"},
    {"id": "music", "name": "Trilhas Sonoras (Music Kits)", "icon": "music"}
]

def safe_int(val: Any, default: int = -1) -> int:
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

@router.get("/categories", summary="Listar categorias de itens")
def get_categories():
    """Retorna todas as categorias de itens disponíveis no CS2."""
    return CATEGORIES

@router.get("/weapons", summary="Listar todas as armas")
def get_weapons(category: Optional[str] = Query(None, description="Filtrar por categoria (ex: rifles, pistols)")):
    """Retorna o catálogo de armas cadastradas."""
    if category:
        return [w for w in weapons_data if w.get("category") == category]
    return weapons_data

@router.get("/skins", summary="Listar todas as skins / pinturas")
def get_skins(
    defindex: Optional[int] = Query(None, description="Filtrar por defindex da arma (ex: 7 para AK-47)"),
    weapon_name: Optional[str] = Query(None, description="Filtrar por nome da arma (ex: weapon_ak47)"),
    search: Optional[str] = Query(None, description="Buscar por nome da skin (ex: Redline, Fade, Dragon Lore)")
):
    """Retorna a lista de skins compatíveis com a busca."""
    results = skins_data

    if defindex is not None:
        target_def = safe_int(defindex)
        results = [s for s in results if safe_int(s.get("weapon_defindex")) == target_def]

    if weapon_name:
        results = [s for s in results if s.get("weapon_name") == weapon_name]

    if search:
        s_lower = search.strip().lower()
        results = [
            s for s in results 
            if s_lower in s.get("paint_name", "").lower() or s_lower in s.get("weapon_name", "").lower()
        ]

    return results

@router.get("/knives", summary="Listar todas as facas do CS2")
def get_knives():
    """Retorna a lista de todos os tipos e modelos de facas disponíveis."""
    return knives_data

@router.get("/gloves", summary="Listar todas as luvas do CS2")
def get_gloves():
    """Retorna o catálogo completo de luvas oficiais."""
    return gloves_data

@router.get("/agents", summary="Listar todos os agentes de personangem")
def get_agents(team: Optional[str] = Query(None, description="Filtrar por time ('t' ou 'ct')")):
    """Retorna todos os modelos de agentes disponíveis."""
    if team:
        t_clean = team.strip().lower()
        return [a for a in agents_data if a.get("team") == t_clean]
    return agents_data

@router.get("/music", summary="Listar todas as trilhas sonoras (Music Kits)")
def get_music():
    """Retorna todas as trilhas sonoras oficiais do CS2."""
    return music_data

@router.get("/rarities", summary="Listar todas as raridades")
def get_rarities():
    """Retorna as cores e nomes de raridades das skins."""
    return [
        {"id": "covert", "name": "★ Covert (Oculto)", "color": "#eb4b4b"},
        {"id": "classified", "name": "Classified (Confidencial)", "color": "#d32ce6"},
        {"id": "restricted", "name": "Restricted (Restrito)", "color": "#8847ff"},
        {"id": "milspec", "name": "Mil-Spec (Grau Militar)", "color": "#4b69ff"},
        {"id": "industrial", "name": "Industrial (Grau Industrial)", "color": "#5e98d9"},
        {"id": "consumer", "name": "Consumer (Consumidor)", "color": "#b0c3d9"},
        {"id": "contraband", "name": "Contraband (Contrabando)", "color": "#ffd700"}
    ]
