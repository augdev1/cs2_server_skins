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

router = APIRouter(prefix="/api/player", tags=["Equipamentos do Jogador"])

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
    steamid = current_user.steamid
    
    with get_db_cursor() as cur:
        # 1. Skins
        cur.execute("SELECT * FROM `wp_player_skins` WHERE `steamid` = %s;", (steamid,))
        skins_rows = cur.fetchall()
        
        # 2. Facas
        cur.execute("SELECT * FROM `wp_player_knife` WHERE `steamid` = %s;", (steamid,))
        knife_rows = cur.fetchall()
        
        # 3. Luvas
        cur.execute("SELECT * FROM `wp_player_gloves` WHERE `steamid` = %s;", (steamid,))
        gloves_rows = cur.fetchall()
        
        # 4. Agentes
        cur.execute("SELECT * FROM `wp_player_agents` WHERE `steamid` = %s;", (steamid,))
        agent_row = cur.fetchone()
        
        # 5. Music Kits
        cur.execute("SELECT * FROM `wp_player_music` WHERE `steamid` = %s;", (steamid,))
        music_rows = cur.fetchall()

    # Estruturação por times (2 = TR, 3 = CT)
    equipment = {
        "steamid": steamid,
        "t": {
            "knife": None,
            "gloves": None,
            "agent": agent_row.get("agent_t") if agent_row else None,
            "music": None,
            "skins": {}
        },
        "ct": {
            "knife": None,
            "gloves": None,
            "agent": agent_row.get("agent_ct") if agent_row else None,
            "music": None,
            "skins": {}
        }
    }
    
    # Preenche skins
    for s in skins_rows:
        team_key = "t" if s["weapon_team"] == 2 else "ct"
        defindex = s["weapon_defindex"]
        equipment[team_key]["skins"][str(defindex)] = s

    # Preenche facas
    for k in knife_rows:
        team_key = "t" if k["weapon_team"] == 2 else "ct"
        equipment[team_key]["knife"] = k["knife"]

    # Preenche luvas
    for g in gloves_rows:
        team_key = "t" if g["weapon_team"] == 2 else "ct"
        equipment[team_key]["gloves"] = g["weapon_defindex"]

    # Preenche music
    for m in music_rows:
        team_key = "t" if m["weapon_team"] == 2 else "ct"
        equipment[team_key]["music"] = m["music_id"]

    return equipment

@router.post("/skin", response_model=ApiResponse, summary="Equipar/Atualizar skin de arma ou faca")
def update_skin(req: SkinUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Salva ou atualiza a skin de uma arma ou faca para o time especificado (TR ou CT)."""
    steamid = current_user.steamid
    
    query = """
        INSERT INTO `wp_player_skins` (
            `steamid`, `weapon_team`, `weapon_defindex`, `weapon_paint_id`,
            `weapon_wear`, `weapon_seed`, `weapon_nametag`,
            `weapon_stattrak`, `weapon_stattrak_count`,
            `weapon_sticker_0`, `weapon_sticker_1`, `weapon_sticker_2`, `weapon_sticker_3`, `weapon_sticker_4`,
            `weapon_keychain`
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON DUPLICATE KEY UPDATE
            `weapon_paint_id` = VALUES(`weapon_paint_id`),
            `weapon_wear` = VALUES(`weapon_wear`),
            `weapon_seed` = VALUES(`weapon_seed`),
            `weapon_nametag` = VALUES(`weapon_nametag`),
            `weapon_stattrak` = VALUES(`weapon_stattrak`),
            `weapon_stattrak_count` = VALUES(`weapon_stattrak_count`),
            `weapon_sticker_0` = VALUES(`weapon_sticker_0`),
            `weapon_sticker_1` = VALUES(`weapon_sticker_1`),
            `weapon_sticker_2` = VALUES(`weapon_sticker_2`),
            `weapon_sticker_3` = VALUES(`weapon_sticker_3`),
            `weapon_sticker_4` = VALUES(`weapon_sticker_4`),
            `weapon_keychain` = VALUES(`weapon_keychain`);
    """
    
    params = (
        steamid,
        req.weapon_team,
        req.weapon_defindex,
        req.weapon_paint_id,
        req.weapon_wear,
        req.weapon_seed,
        req.weapon_nametag,
        req.weapon_stattrak,
        req.weapon_stattrak_count,
        req.weapon_sticker_0,
        req.weapon_sticker_1,
        req.weapon_sticker_2,
        req.weapon_sticker_3,
        req.weapon_sticker_4,
        req.weapon_keychain
    )
    
    with get_db_cursor() as cur:
        cur.execute(query, params)
        
    return ApiResponse(
        success=True,
        message=f"Skin atualizada com sucesso para a arma {req.weapon_defindex} (Time {req.weapon_team}).",
        data={"defindex": req.weapon_defindex, "paint_id": req.weapon_paint_id, "team": req.weapon_team}
    )

@router.delete("/skin", response_model=ApiResponse, summary="Restaurar skin padrão de uma arma")
def delete_skin(req: DeleteSkinRequest, current_user: UserProfile = Depends(get_current_user)):
    """Remove a skin customizada de uma arma, restaurando o modelo padrão."""
    steamid = current_user.steamid
    
    with get_db_cursor() as cur:
        cur.execute(
            "DELETE FROM `wp_player_skins` WHERE `steamid` = %s AND `weapon_team` = %s AND `weapon_defindex` = %s;",
            (steamid, req.weapon_team, req.weapon_defindex)
        )
        
    return ApiResponse(success=True, message="Skin removida com sucesso. A arma retornou ao padrão.")

@router.post("/knife", response_model=ApiResponse, summary="Equipar modelo de faca")
def update_knife(req: KnifeUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Define o modelo da faca do jogador para o time especificado (ex: weapon_knife_butterfly)."""
    steamid = current_user.steamid
    
    query = """
        INSERT INTO `wp_player_knife` (`steamid`, `weapon_team`, `knife`)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE `knife` = VALUES(`knife`);
    """
    
    with get_db_cursor() as cur:
        cur.execute(query, (steamid, req.weapon_team, req.knife))
        
    return ApiResponse(
        success=True,
        message=f"Modelo de faca atualizado para '{req.knife}' (Time {req.weapon_team}).",
        data={"knife": req.knife, "team": req.weapon_team}
    )

@router.delete("/knife", response_model=ApiResponse, summary="Restaurar faca padrão")
def delete_knife(team: int, current_user: UserProfile = Depends(get_current_user)):
    """Remove a faca customizada e restaura a faca padrão do time."""
    steamid = current_user.steamid
    
    with get_db_cursor() as cur:
        cur.execute(
            "DELETE FROM `wp_player_knife` WHERE `steamid` = %s AND `weapon_team` = %s;",
            (steamid, team)
        )
    return ApiResponse(success=True, message="Faca restaurada para o padrão.")

@router.post("/gloves", response_model=ApiResponse, summary="Equipar modelo de luvas")
def update_gloves(req: GlovesUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Define o modelo de luva do jogador."""
    steamid = current_user.steamid
    
    query = """
        INSERT INTO `wp_player_gloves` (`steamid`, `weapon_team`, `weapon_defindex`)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE `weapon_defindex` = VALUES(`weapon_defindex`);
    """
    
    with get_db_cursor() as cur:
        cur.execute(query, (steamid, req.weapon_team, req.weapon_defindex))
        
    return ApiResponse(
        success=True,
        message=f"Luva atualizada com sucesso para defindex {req.weapon_defindex}.",
        data={"gloves_defindex": req.weapon_defindex, "team": req.weapon_team}
    )

@router.delete("/gloves", response_model=ApiResponse, summary="Restaurar luvas padrão")
def delete_gloves(team: int, current_user: UserProfile = Depends(get_current_user)):
    """Remove as luvas customizadas."""
    steamid = current_user.steamid
    
    with get_db_cursor() as cur:
        cur.execute(
            "DELETE FROM `wp_player_gloves` WHERE `steamid` = %s AND `weapon_team` = %s;",
            (steamid, team)
        )
    return ApiResponse(success=True, message="Luvas restauradas para o padrão.")

@router.post("/agent", response_model=ApiResponse, summary="Equipar agentes customizados")
def update_agent(req: AgentUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Define os agentes para CT e/ou TR."""
    steamid = current_user.steamid
    
    query = """
        INSERT INTO `wp_player_agents` (`steamid`, `agent_ct`, `agent_t`)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            `agent_ct` = COALESCE(VALUES(`agent_ct`), `agent_ct`),
            `agent_t` = COALESCE(VALUES(`agent_t`), `agent_t`);
    """
    
    with get_db_cursor() as cur:
        cur.execute(query, (steamid, req.agent_ct, req.agent_t))
        
    return ApiResponse(success=True, message="Agente atualizado com sucesso.")

@router.post("/music", response_model=ApiResponse, summary="Equipar Music Kit")
def update_music(req: MusicUpdateRequest, current_user: UserProfile = Depends(get_current_user)):
    """Define a trilha sonora / Music Kit."""
    steamid = current_user.steamid
    
    query = """
        INSERT INTO `wp_player_music` (`steamid`, `weapon_team`, `music_id`)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE `music_id` = VALUES(`music_id`);
    """
    
    with get_db_cursor() as cur:
        cur.execute(query, (steamid, req.weapon_team, req.music_id))
        
    return ApiResponse(success=True, message="Music Kit atualizado com sucesso.")
