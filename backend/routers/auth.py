import os
from fastapi import APIRouter, Request, HTTPException, Depends, status
from fastapi.responses import RedirectResponse
from auth import (
    get_steam_login_url,
    verify_steam_openid,
    fetch_steam_player_profile,
    create_access_token,
    get_current_user
)
from models import UserProfile, AuthTokenResponse, DevLoginRequest, ApiResponse
from config import FRONTEND_URL, BASE_URL

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.get("/steam", summary="Iniciar login via Steam")
def login_steam(request: Request):
    """Redireciona o usuário para o formulário oficial de autenticação da Steam."""
    # Detect dynamically if deployed or localhost
    host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    proto = request.headers.get("x-forwarded-proto", "https" if "https" in str(request.base_url) else "http")
    
    current_base = f"{proto}://{host}" if host and "localhost" not in host else BASE_URL
    callback_url = f"{current_base}/auth/steam/callback"
    
    login_url = get_steam_login_url(callback_url=callback_url, realm=current_base)
    return RedirectResponse(url=login_url)

@router.get("/steam/callback", summary="Callback de retorno da Steam")
async def steam_callback(request: Request):
    """Processa a resposta OpenID da Steam após o usuário autorizar o login."""
    query_params = dict(request.query_params)
    steamid = await verify_steam_openid(query_params)
    
    if not steamid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Falha ao autenticar com a Steam. O login foi cancelado ou a assinatura é inválida."
        )
    
    profile = await fetch_steam_player_profile(steamid)
    token = create_access_token(profile.model_dump())
    
    # Redireciona para o frontend com o token no hash
    target_frontend = FRONTEND_URL if (FRONTEND_URL and "localhost" not in FRONTEND_URL) else "https://frontend-eta-steel-myu91t1l92.vercel.app"
    redirect_url = f"{target_frontend}/#token={token}"
    return RedirectResponse(url=redirect_url)

@router.post("/dev-login", response_model=AuthTokenResponse, summary="Login direto para desenvolvimento/testes")
async def dev_login(req: DevLoginRequest):
    """
    Permite autenticação direta informando o SteamID64.
    Ideal para desenvolvimento local ou testes de integração sem passar pelo formulário da Steam.
    """
    steamid = req.steamid.strip()
    if not steamid or len(steamid) < 10:
        raise HTTPException(status_code=400, detail="SteamID inválido.")
    
    profile = await fetch_steam_player_profile(steamid)
    if req.personaname and req.personaname != "Dev Player":
        profile.personaname = req.personaname
        
    token = create_access_token(profile.model_dump())
    return AuthTokenResponse(access_token=token, token_type="bearer", user=profile)

@router.get("/me", response_model=UserProfile, summary="Obter dados do usuário logado")
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    """Retorna os detalhes da conta do jogador autenticado via Token Bearer."""
    return current_user

@router.post("/logout", response_model=ApiResponse, summary="Encerrar sessão")
async def logout(current_user: UserProfile = Depends(get_current_user)):
    """Informa o encerramento da sessão do usuário."""
    return ApiResponse(success=True, message="Sessão encerrada com sucesso.")
