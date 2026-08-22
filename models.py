from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# --- Auth Models ---
class UserProfile(BaseModel):
    steamid: str
    personaname: str = "Player"
    avatar: str = ""
    avatarmedium: str = ""
    avatarfull: str = ""
    profileurl: str = ""

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class DevLoginRequest(BaseModel):
    steamid: str = Field(..., description="SteamID64 do jogador (ex: 76561198232682580)")
    personaname: Optional[str] = "Dev Player"

# --- Items & Equipment Models ---
class SkinUpdateRequest(BaseModel):
    weapon_team: int = Field(..., ge=2, le=3, description="2 para Terroristas (TR), 3 para Contra-Terroristas (CT)")
    weapon_defindex: int = Field(..., description="ID de definição da arma (ex: 7 para AK47, 515 para Butterfly)")
    weapon_paint_id: int = Field(..., description="ID da pintura/skin (paint index)")
    weapon_wear: float = Field(0.000001, ge=0.0, le=1.0, description="Desgaste/Float (0.00 a 1.00)")
    weapon_seed: int = Field(0, ge=0, description="Pattern Seed (0 a 1000)")
    weapon_nametag: Optional[str] = Field(None, max_length=128, description="Nome customizado da arma")
    weapon_stattrak: int = Field(0, ge=0, le=1, description="StatTrak habilitado (1 ou 0)")
    weapon_stattrak_count: int = Field(0, ge=0, description="Contador StatTrak")
    weapon_sticker_0: str = Field("0;0;0;0;0;0;0", description="Sticker slot 0 (id;schema;x;y;wear;scale;rotation)")
    weapon_sticker_1: str = Field("0;0;0;0;0;0;0", description="Sticker slot 1")
    weapon_sticker_2: str = Field("0;0;0;0;0;0;0", description="Sticker slot 2")
    weapon_sticker_3: str = Field("0;0;0;0;0;0;0", description="Sticker slot 3")
    weapon_sticker_4: str = Field("0;0;0;0;0;0;0", description="Sticker slot 4")
    weapon_keychain: str = Field("0;0;0;0;0", description="Chaveiro (id;x;y;z;seed)")

class KnifeUpdateRequest(BaseModel):
    weapon_team: int = Field(..., ge=2, le=3, description="2 = TR, 3 = CT")
    knife: str = Field(..., description="Nome do modelo da faca (ex: weapon_knife_butterfly, weapon_knife_karambit)")

class GlovesUpdateRequest(BaseModel):
    weapon_team: int = Field(..., ge=2, le=3, description="2 = TR, 3 = CT")
    weapon_defindex: int = Field(..., description="Defindex do modelo de luvas (ex: 5030, 5031, 5032)")

class AgentUpdateRequest(BaseModel):
    agent_ct: Optional[str] = Field(None, description="Identificador do agente CT")
    agent_t: Optional[str] = Field(None, description="Identificador do agente TR")

class MusicUpdateRequest(BaseModel):
    weapon_team: int = Field(..., ge=2, le=3, description="2 = TR, 3 = CT")
    music_id: int = Field(..., description="ID do Music Kit")

class DeleteSkinRequest(BaseModel):
    weapon_team: int = Field(..., ge=2, le=3)
    weapon_defindex: int = Field(...)

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
