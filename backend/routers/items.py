import os
import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/api/items", tags=["Catálogo de Itens"])

def load_json_file(filename: str) -> Any:
    possible_paths = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", filename),
        os.path.join(os.getcwd(), "data", filename),
        os.path.join(os.getcwd(), "backend", "data", filename),
        os.path.join("/app", "data", filename),
        os.path.join(os.path.dirname(__file__), "..", "data", filename)
    ]
    for path in possible_paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    print(f" [AVISO] Arquivo {filename} não encontrado nos caminhos testados.")
    return []

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
    """Retorna o catálogo de skins com ID da pintura (paint), imagens oficiais e nomes."""
    results = skins_data
    
    if defindex is not None:
        results = [s for s in results if safe_int(s.get("weapon_defindex")) == defindex]
        
    if weapon_name:
        results = [s for s in results if s.get("weapon_name") == weapon_name]
        
    if search:
        s_lower = search.lower()
        results = [s for s in results if s_lower in s.get("paint_name", "").lower()]
        
    return results

@router.get("/knives", summary="Listar modelos e skins de facas")
def get_knives():
    """Retorna todos os modelos de facas do CS2 e suas respectivas skins compatíveis."""
    knife_list = []
    for k in knives_data:
        defidx = safe_int(k["defindex"])
        skins_for_knife = [s for s in skins_data if safe_int(s.get("weapon_defindex")) == defidx]
        knife_list.append({
            "defindex": defidx,
            "name": k["name"],
            "knife": k["knife"],
            "image": k["image"],
            "skins_count": len(skins_for_knife),
            "skins": skins_for_knife
        })
    return knife_list


@router.get("/gloves", summary="Listar modelos e skins de luvas")
def get_gloves():
    """Retorna os modelos e skins de luvas disponíveis."""
    return gloves_data

@router.get("/agents", summary="Listar agentes")
def get_agents(team: Optional[str] = Query(None, description="Filtrar por time: 'ct' ou 't'")):
    """Retorna todos os agentes customizados disponíveis para TR e CT."""
    if team and isinstance(agents_data, dict):
        return agents_data.get(team.lower(), [])
    return agents_data

@router.get("/music", summary="Listar Music Kits")
def get_music():
    """Retorna todas as trilhas sonoras / Music Kits do CS2."""
    return music_data

@router.get("/search", summary="Busca global de itens")
def search_items(q: str = Query(..., min_length=2, description="Termo de busca")):
    """Busca em armas, skins, facas e agentes pelo nome ou pintura."""
    term = q.lower()
    
    matched_weapons = [w for w in weapons_data if term in w.get("name", "").lower() or term in w.get("weapon_name", "").lower()]
    matched_knives = [k for k in knives_data if term in k.get("name", "").lower()]
    matched_skins = [s for s in skins_data if term in s.get("paint_name", "").lower()][:50]
    
    return {
        "query": q,
        "weapons": matched_weapons,
        "knives": matched_knives,
        "skins": matched_skins
    }
