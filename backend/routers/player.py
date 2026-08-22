from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from database import get_db_cursor
from auth import get_current_user
from models import (
    UserProfile,
    SkinUpdateRequest,
    KnifeUpdateRequest,
    GlovesUpdateRequest,
    AgentUpdateRequest,
    MusicUpdateRequest,
    DeleteSkinRequest,
    ApiResponse
)

router = APIRouter(prefix="/player", tags=["Equipamentos do Jogador"])

@router.get("/equipment", summary="Obter inventário completo equipado do jogador")
def get_player_equipment(current_user: UserProfile = Depends(get_current_user)):
    """
    Retorna todo o loadout atual do jogador registrado no banco MySQL:
    - Skins de armas (TR e CT)
    - Faca equipada (TR e CT)
    - Luvas equipadas (TR e CT)
    - Agentes (TR e CT)
    - Music Kits (TR e CT)
    """
    steamid = str(current_user.steamid)
    
    with get_db_cursor() as cur:
        # 1. Carrega Skins de Armas (wp_player_skins)
        cur.execute(
            """
            SELECT weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed, 
                   weapon_nametag, weapon_stattrak, weapon_stattrak_count,
                   weapon_sticker_0, weapon_sticker_1, weapon_sticker_2, weapon_sticker_3, weapon_sticker_4,
                   weapon_keychain
            FROM wp_player_skins 
            WHERE steamid = %s
            """,
            (steamid,)
        )
        skins_rows = cur.fetchall() or []
        
        # 2. Carrega Faca Equipada (wp_player_knife)
        cur.execute(
            "SELECT weapon_team, knife FROM wp_player_knife WHERE steamid = %s",
            (steamid,)
        )
        knife_rows = cur.fetchall() or []
        
        # 3. Carrega Luvas Equipadas (wp_player_gloves)
        cur.execute(
            "SELECT weapon_team, weapon_defindex FROM wp_player_gloves WHERE steamid = %s",
            (steamid,)
        )
        gloves_rows = cur.fetchall() or []
        
        # 4. Carrega Agentes (wp_player_agents)
        cur.execute(
            "SELECT steamid, agent_ct, agent_t FROM wp_player_agents WHERE steamid = %s",
            (steamid,)
        )
        agent_row = cur.fetchone()
        
        # 5. Carrega Music Kit (wp_player_music)
        cur.execute(
            "SELECT weapon_team, music_id FROM wp_player_music WHERE steamid = %s",
            (steamid,)
        )
        music_rows = cur.fetchall() or []

    # Estrutura a resposta dividida entre lado T (2) e CT (3)
    response_data = {
        "t": {
            "knife": None,
            "gloves": None,
            "agent": None,
            "music": None,
            "skins": {}
        },
        "ct": {
            "knife": None,
            "gloves": None,
            "agent": None,
            "music": None,
            "skins": {}
        }
    }
    
    # Processa skins de armas
    for row in skins_rows:
        team_key = "t" if row["weapon_team"] == 2 else "ct" if row["weapon_team"] == 3 else None
        if team_key:
            response_data[team_key]["skins"][str(row["weapon_defindex"])] = row

    # Processa facas
    for row in knife_rows:
        team_key = "t" if row["weapon_team"] == 2 else "ct" if row["weapon_team"] == 3 else None
        if team_key:
            response_data[team_key]["knife"] = row["knife"]

    # Processa luvas
    for row in gloves_rows:
        team_key = "t" if row["weapon_team"] == 2 else "ct" if row["weapon_team"] == 3 else None
        if team_key:
            response_data[team_key]["gloves"] = row["weapon_defindex"]

    # Processa agentes
    if agent_row:
        if agent_row.get("agent_t"):
            response_data["t"]["agent"] = agent_row["agent_t"]
        if agent_row.get("agent_ct"):
            response_data["ct"]["agent"] = agent_row["agent_ct"]

    # Processa music kit
    for row in music_rows:
        team_key = "t" if row["weapon_team"] == 2 else "ct" if row["weapon_team"] == 3 else None
        if team_key:
            response_data[team_key]["music"] = row["music_id"]

    return response_data

@router.post("/skin", response_model=ApiResponse, summary="Equipar/Atualizar Skin de Arma")
def update_skin(req: SkinUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Atualiza ou insere a skin personalizada de uma arma para o time selecionado."""
    steamid = str(current_user.steamid)
    team = int(req.weapon_team) if req.weapon_team in (2, 3) else 2
    
    sql = """
    INSERT INTO wp_player_skins (
        steamid, weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed,
        weapon_nametag, weapon_stattrak, weapon_stattrak_count,
        weapon_sticker_0, weapon_sticker_1, weapon_sticker_2, weapon_sticker_3, weapon_sticker_4,
        weapon_keychain
    ) VALUES (
        %s, %s, %s, %s, %s, %s,
        %s, %s, %s,
        %s, %s, %s, %s, %s,
        %s
    )
    ON DUPLICATE KEY UPDATE
        weapon_paint_id = VALUES(weapon_paint_id),
        weapon_wear = VALUES(weapon_wear),
        weapon_seed = VALUES(weapon_seed),
        weapon_nametag = VALUES(weapon_nametag),
        weapon_stattrak = VALUES(weapon_stattrak),
        weapon_stattrak_count = VALUES(weapon_stattrak_count),
        weapon_sticker_0 = VALUES(weapon_sticker_0),
        weapon_sticker_1 = VALUES(weapon_sticker_1),
        weapon_sticker_2 = VALUES(weapon_sticker_2),
        weapon_sticker_3 = VALUES(weapon_sticker_3),
        weapon_sticker_4 = VALUES(weapon_sticker_4),
        weapon_keychain = VALUES(weapon_keychain)
    """
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(sql, (
            steamid, team, req.weapon_defindex, req.weapon_paint_id, req.weapon_wear, req.weapon_seed,
            req.weapon_nametag, req.weapon_stattrak, req.weapon_stattrak_count,
            req.weapon_sticker_0 or "0;0;0;0;0;0;0",
            req.weapon_sticker_1 or "0;0;0;0;0;0;0",
            req.weapon_sticker_2 or "0;0;0;0;0;0;0",
            req.weapon_sticker_3 or "0;0;0;0;0;0;0",
            req.weapon_sticker_4 or "0;0;0;0;0;0;0",
            req.weapon_keychain or "0;0;0;0;0"
        ))
        
    return ApiResponse(success=True, message="Skin salva com sucesso no servidor!")

@router.delete("/skin/{team}/{defindex}", response_model=ApiResponse, summary="Remover Skin (Restaurar Padrão)")
def delete_skin(team: int, defindex: int, current_user: UserProfile = Depends(get_current_user)):
    """Remove a skin personalizada de uma arma, restaurando o modelo padrão do jogo."""
    steamid = str(current_user.steamid)
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            "DELETE FROM wp_player_skins WHERE steamid = %s AND weapon_team = %s AND weapon_defindex = %s",
            (steamid, team, defindex)
        )
        
    return ApiResponse(success=True, message="Skin restaurada para o padrão.")

@router.post("/knife", response_model=ApiResponse, summary="Equipar Faca")
def update_knife(req: KnifeUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Equipa um modelo de faca para o time especificado (TR ou CT)."""
    steamid = str(current_user.steamid)
    team = req.weapon_team or req.team or 2
    knife_name = req.knife_name or req.knife
    
    if not knife_name:
        raise HTTPException(status_code=400, detail="Nome da faca é obrigatório.")
        
    sql = """
    INSERT INTO wp_player_knife (steamid, weapon_team, knife)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE knife = VALUES(knife)
    """
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(sql, (steamid, team, knife_name))
        
    return ApiResponse(success=True, message=f"Faca '{knife_name}' equipada com sucesso!")

@router.post("/gloves", response_model=ApiResponse, summary="Equipar Luvas")
def update_gloves(req: GlovesUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Equipa um modelo de luvas para o time especificado."""
    steamid = str(current_user.steamid)
    team = req.weapon_team or req.team or 2
    gloves_def = req.gloves_defindex or req.weapon_defindex
    
    if not gloves_def:
        raise HTTPException(status_code=400, detail="Defindex das luvas é obrigatório.")
        
    sql = """
    INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE weapon_defindex = VALUES(weapon_defindex)
    """
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(sql, (steamid, team, gloves_def))
        
    return ApiResponse(success=True, message="Luvas equipadas com sucesso!")

@router.post("/agent", response_model=ApiResponse, summary="Equipar Agente")
def update_agent(req: AgentUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Equipa um agente (personagem) para o time especificado."""
    steamid = str(current_user.steamid)
    team = req.weapon_team or req.team or 2
    agent = req.agent_model or (req.agent_t if team == 2 else req.agent_ct)
    
    if team == 2:
        sql = """
        INSERT INTO wp_player_agents (steamid, agent_t) VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE agent_t = VALUES(agent_t)
        """
        params = (steamid, agent)
    else:
        sql = """
        INSERT INTO wp_player_agents (steamid, agent_ct) VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE agent_ct = VALUES(agent_ct)
        """
        params = (steamid, agent)
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(sql, params)
        
    return ApiResponse(success=True, message=f"Agente equipado com sucesso!")

@router.post("/music", response_model=ApiResponse, summary="Equipar Music Kit")
def update_music(req: MusicUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Equipa uma trilha sonora (Music Kit) para o jogador."""
    steamid = str(current_user.steamid)
    team = req.weapon_team or req.team or 2
    
    sql = """
    INSERT INTO wp_player_music (steamid, weapon_team, music_id)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE music_id = VALUES(music_id)
    """
    
    with get_db_cursor(commit=True) as cur:
        cur.execute(sql, (steamid, team, req.music_id))
        
    return ApiResponse(success=True, message=f"Music Kit #{req.music_id} equipado!")

@router.post("/clear-all", response_model=ApiResponse, summary="Limpar todo o inventário")
def clear_all_equipment(current_user: UserProfile = Depends(get_current_user)):
    """Limpa todas as configurações de skins, facas e luvas do jogador no banco de dados."""
    steamid = str(current_user.steamid)
    
    with get_db_cursor(commit=True) as cur:
        cur.execute("DELETE FROM wp_player_skins WHERE steamid = %s", (steamid,))
        cur.execute("DELETE FROM wp_player_knife WHERE steamid = %s", (steamid,))
        cur.execute("DELETE FROM wp_player_gloves WHERE steamid = %s", (steamid,))
        cur.execute("DELETE FROM wp_player_agents WHERE steamid = %s", (steamid,))
        cur.execute("DELETE FROM wp_player_music WHERE steamid = %s", (steamid,))
        
    return ApiResponse(success=True, message="Todo o inventário foi restaurado para o padrão.")
