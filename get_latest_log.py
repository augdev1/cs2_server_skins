import sys
import pymysql
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

sys.stdout.reconfigure(encoding='utf-8')

conn = pymysql.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    cursorclass=pymysql.cursors.DictCursor
)

with conn.cursor() as cur:
    print("=" * 65)
    print(" 📋 ÚLTIMOS REGISTROS DO BANCO DE DADOS (MYSQL)")
    print("=" * 65)
    
    # 1. wp_player_skins
    print("\n >>> Tabela: `wp_player_skins` (Últimas skins salvas):")
    cur.execute("SELECT * FROM wp_player_skins ORDER BY steamid DESC, weapon_defindex ASC LIMIT 6;")
    rows = cur.fetchall()
    for idx, r in enumerate(rows, 1):
        team_str = "TR (2)" if r["weapon_team"] == 2 else "CT (3)"
        print(f"  [{idx}] SteamID: {r['steamid']} | Time: {team_str} | Arma Defindex: {r['weapon_defindex']} | Skin Paint ID: {r['weapon_paint_id']} | Float: {r['weapon_wear']} | Seed: {r['weapon_seed']} | Nametag: {r['weapon_nametag']} | StatTrak: {r['weapon_stattrak']}")

    # 2. wp_player_knife
    print("\n >>> Tabela: `wp_player_knife` (Últimas facas equipadas):")
    cur.execute("SELECT * FROM wp_player_knife ORDER BY steamid DESC LIMIT 6;")
    knife_rows = cur.fetchall()
    for idx, r in enumerate(knife_rows, 1):
        team_str = "TR (2)" if r["weapon_team"] == 2 else "CT (3)"
        print(f"  [{idx}] SteamID: {r['steamid']} | Time: {team_str} | Faca Modelo: {r['knife']}")

    # 3. wp_player_gloves
    print("\n >>> Tabela: `wp_player_gloves` (Últimas luvas equipadas):")
    cur.execute("SELECT * FROM wp_player_gloves ORDER BY steamid DESC LIMIT 6;")
    gloves_rows = cur.fetchall()
    for idx, r in enumerate(gloves_rows, 1):
        team_str = "TR (2)" if r["weapon_team"] == 2 else "CT (3)"
        print(f"  [{idx}] SteamID: {r['steamid']} | Time: {team_str} | Luva Defindex: {r['weapon_defindex']}")

    # 4. Total de registros
    print("\n" + "-" * 65)
    print("📊 RESUMO TOTAL DE REGISTROS POR TABELA:")
    for t in ['wp_player_skins', 'wp_player_knife', 'wp_player_gloves', 'wp_player_agents', 'wp_player_music', 'wp_player_pins']:
        cur.execute(f"SELECT COUNT(*) as total FROM `{t}`;")
        total = cur.fetchone()['total']
        print(f"  • {t:<20}: {total} registros")
    print("=" * 65)

conn.close()
