from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

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
    weapon_team: int = Field(2, description="2 para Terroristas (TR), 3 para Contra-Terroristas (CT)")
    weapon_defindex: int = Field(..., description="ID de definição da arma (ex: 7 para AK47, 515 para Butterfly)")
    weapon_paint_id: int = Field(0, description="ID da pintura/skin (paint index)")
    weapon_wear: float = Field(0.000001, description="Desgaste/Float (0.00 a 1.00)")
    weapon_seed: int = Field(0, description="Pattern Seed (0 a 1000)")
    weapon_nametag: Optional[str] = Field(None, max_length=128, description="Nome customizado da arma")
    weapon_stattrak: int = Field(0, description="StatTrak habilitado (1 ou 0)")
    weapon_stattrak_count: int = Field(0, description="Contador StatTrak")
    weapon_sticker_0: Optional[str] = Field("0;0;0;0;0;0;0", description="Sticker slot 0")
    weapon_sticker_1: Optional[str] = Field("0;0;0;0;0;0;0", description="Sticker slot 1")
    weapon_sticker_2: Optional[str] = Field("0;0;0;0;0;0;0", description="Sticker slot 2")
    weapon_sticker_3: Optional[str] = Field("0;0;0;0;0;0;0", description="Sticker slot 3")
    weapon_sticker_4: Optional[str] = Field("0;0;0;0;0;0;0", description="Sticker slot 4")
    weapon_keychain: Optional[str] = Field("0;0;0;0;0", description="Chaveiro")

class KnifeUpdateRequest(BaseModel):
    team: Optional[int] = Field(None)
    weapon_team: Optional[int] = Field(None)
    knife: Optional[str] = Field(None)
    knife_name: Optional[str] = Field(None)

class GlovesUpdateRequest(BaseModel):
    team: Optional[int] = Field(None)
    weapon_team: Optional[int] = Field(None)
    weapon_defindex: Optional[int] = Field(None)
    gloves_defindex: Optional[int] = Field(None)

class AgentUpdateRequest(BaseModel):
    team: Optional[int] = Field(None)
    weapon_team: Optional[int] = Field(None)
    agent_model: Optional[str] = Field(None)
    agent_ct: Optional[str] = Field(None)
    agent_t: Optional[str] = Field(None)

class MusicUpdateRequest(BaseModel):
    team: Optional[int] = Field(None)
    weapon_team: Optional[int] = Field(None)
    music_id: int = Field(...)

class DeleteSkinRequest(BaseModel):
    weapon_team: int = Field(2)
    weapon_defindex: int = Field(...)

class ApiResponse(BaseModel):
    success: bool
    message: str = "Operação realizada com sucesso."
    data: Optional[Any] = None
