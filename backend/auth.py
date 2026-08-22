import re
import urllib.parse
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import httpx
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import STEAM_API_KEY, BASE_URL, JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_DAYS
from models import UserProfile

security = HTTPBearer(auto_error=False)

STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"

def get_steam_login_url(return_url: Optional[str] = None) -> str:
    """Gera a URL de redirecionamento para login seguro via Steam OpenID."""
    callback_url = return_url or f"{BASE_URL}/auth/steam/callback"
    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": callback_url,
        "openid.realm": BASE_URL,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    }
    return f"{STEAM_OPENID_URL}?{urllib.parse.urlencode(params)}"

async def verify_steam_openid(query_params: Dict[str, str]) -> Optional[str]:
    """Valida o payload retornado pela Steam e extrai o SteamID64."""
    if query_params.get("openid.mode") == "cancel":
        return None
    
    validation_params = dict(query_params)
    validation_params["openid.mode"] = "check_authentication"
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(STEAM_OPENID_URL, data=validation_params)
        if "is_valid:true" in response.text:
            claimed_id = query_params.get("openid.claimed_id", "")
            match = re.search(r"https://steamcommunity\.com/openid/id/(\d+)", claimed_id)
            if match:
                return match.group(1)
    return None

async def fetch_steam_player_profile(steamid: str) -> UserProfile:
    """Consulta os detalhes do perfil do jogador na Steam Web API."""
    profile = UserProfile(steamid=steamid, personaname=f"Player {steamid[-4:]}")
    
    if not STEAM_API_KEY:
        return profile
        
    url = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={STEAM_API_KEY}&steamids={steamid}"
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            res = await client.get(url)
            if res.status_code == 200:
                data = res.json()
                players = data.get("response", {}).get("players", [])
                if players:
                    p = players[0]
                    profile.personaname = p.get("personaname", profile.personaname)
                    profile.avatar = p.get("avatar", "")
                    profile.avatarmedium = p.get("avatarmedium", "")
                    profile.avatarfull = p.get("avatarfull", "")
                    profile.profileurl = p.get("profileurl", "")
    except Exception as e:
        print(f"[STEAM API WARNING] Erro ao buscar perfil: {e}")
        
    return profile

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Gera um JWT token com os dados do usuário e tempo de expiração."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodifica e valida o JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(auth: Optional[HTTPAuthorizationCredentials] = Security(security)) -> UserProfile:
    """Dependency do FastAPI para obter o usuário logado a partir do token Bearer."""
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticação necessária. Envie o token Bearer no cabeçalho Authorization.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_access_token(auth.credentials)
    if not payload or "steamid" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserProfile(
        steamid=payload.get("steamid"),
        personaname=payload.get("personaname", "Player"),
        avatar=payload.get("avatar", ""),
        avatarmedium=payload.get("avatarmedium", ""),
        avatarfull=payload.get("avatarfull", ""),
        profileurl=payload.get("profileurl", "")
    )
