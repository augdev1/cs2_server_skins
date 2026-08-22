import sys
sys.stdout.reconfigure(encoding='utf-8')
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print(" INICIANDO TESTES DA API FASTAPI (CS2 WEAPONPAINTS)")
    print("=" * 60)
    
    # 1. Test Root
    res = client.get("/")
    assert res.status_code == 200, f"Falha no root: {res.text}"
    data = res.json()
    print(f" [PASS] GET / -> Status: {data.get('status')}, DB Conectado: {data.get('database_connected')}")
    
    # 2. Test Categories
    res = client.get("/api/items/categories")
    assert res.status_code == 200
    categories = res.json()
    print(f" [PASS] GET /api/items/categories -> {len(categories)} categorias encontradas.")
    
    # 3. Test Weapons
    res = client.get("/api/items/weapons")
    assert res.status_code == 200
    weapons = res.json()
    print(f" [PASS] GET /api/items/weapons -> {len(weapons)} armas catalogadas.")
    
    # 4. Test Skins (AK-47)
    res = client.get("/api/items/skins?defindex=7")
    assert res.status_code == 200
    ak_skins = res.json()
    print(f" [PASS] GET /api/items/skins?defindex=7 -> {len(ak_skins)} skins para AK-47.")
    
    # 5. Test Knives
    res = client.get("/api/items/knives")
    assert res.status_code == 200
    knives = res.json()
    print(f" [PASS] GET /api/items/knives -> {len(knives)} modelos de facas carregadas.")
    
    # 6. Test Dev Login
    dev_steamid = "76561198232682580"
    res = client.post("/auth/dev-login", json={"steamid": dev_steamid, "personaname": "Test Player"})
    assert res.status_code == 200, f"Falha no dev-login: {res.text}"
    auth_data = res.json()
    token = auth_data["access_token"]
    print(f" [PASS] POST /auth/dev-login -> Token JWT gerado para SteamID: {dev_steamid}")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 7. Test /auth/me
    res = client.get("/auth/me", headers=headers)
    assert res.status_code == 200
    user = res.json()
    print(f" [PASS] GET /auth/me -> Autenticado como: {user.get('personaname')} ({user.get('steamid')})")
    
    # 8. Test /api/player/equipment
    res = client.get("/api/player/equipment", headers=headers)
    assert res.status_code == 200
    equipment = res.json()
    t_skins_count = len(equipment["t"]["skins"])
    ct_skins_count = len(equipment["ct"]["skins"])
    print(f" [PASS] GET /api/player/equipment -> TR: {t_skins_count} skins, Faca: {equipment['t']['knife']} | CT: {ct_skins_count} skins, Faca: {equipment['ct']['knife']}")
    
    # 9. Test update skin (AK-47 Redline / Asiimov test)
    skin_payload = {
        "weapon_team": 2,
        "weapon_defindex": 7,
        "weapon_paint_id": 180, # Fire Serpent
        "weapon_wear": 0.01,
        "weapon_seed": 420,
        "weapon_nametag": "AK47 by FastAPI",
        "weapon_stattrak": 1,
        "weapon_stattrak_count": 1337,
        "weapon_sticker_0": "0;0;0;0;0;0;0",
        "weapon_sticker_1": "0;0;0;0;0;0;0",
        "weapon_sticker_2": "0;0;0;0;0;0;0",
        "weapon_sticker_3": "0;0;0;0;0;0;0",
        "weapon_sticker_4": "0;0;0;0;0;0;0",
        "weapon_keychain": "0;0;0;0;0"
    }
    res = client.post("/api/player/skin", json=skin_payload, headers=headers)
    assert res.status_code == 200, f"Falha ao salvar skin: {res.text}"
    print(f" [PASS] POST /api/player/skin -> {res.json()['message']}")
    
    # 10. Test update knife
    knife_payload = {
        "weapon_team": 2,
        "knife": "weapon_knife_butterfly"
    }
    res = client.post("/api/player/knife", json=knife_payload, headers=headers)
    assert res.status_code == 200
    print(f" [PASS] POST /api/player/knife -> {res.json()['message']}")
    
    print("\n" + "=" * 60)
    print(" [SUCESSO] TODOS OS TESTES DA API PASSARAM COM SUCESSO!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
