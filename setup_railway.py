import os
import pymysql
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Script de criação automática de tabelas no Railway MySQL usando variáveis de ambiente ou argumentos

QUERIES = [
    """
    CREATE TABLE IF NOT EXISTS `wp_player_skins` (
      `steamid` varchar(18) NOT NULL,
      `weapon_team` int NOT NULL,
      `weapon_defindex` int NOT NULL,
      `weapon_paint_id` int NOT NULL DEFAULT 0,
      `weapon_wear` float NOT NULL DEFAULT 0.001,
      `weapon_seed` int NOT NULL DEFAULT 0,
      `weapon_nametag` varchar(128) DEFAULT NULL,
      `weapon_stattrak` int NOT NULL DEFAULT 0,
      `weapon_stattrak_count` int NOT NULL DEFAULT 0,
      `weapon_sticker_0` varchar(64) NOT NULL DEFAULT '0',
      `weapon_sticker_1` varchar(64) NOT NULL DEFAULT '0',
      `weapon_sticker_2` varchar(64) NOT NULL DEFAULT '0',
      `weapon_sticker_3` varchar(64) NOT NULL DEFAULT '0',
      `weapon_sticker_4` varchar(64) NOT NULL DEFAULT '0',
      `weapon_keychain` varchar(64) NOT NULL DEFAULT '0',
      PRIMARY KEY (`steamid`, `weapon_team`, `weapon_defindex`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS `wp_player_knife` (
      `steamid` varchar(18) NOT NULL,
      `knife_ct` varchar(64) NOT NULL DEFAULT 'weapon_knife',
      `knife_t` varchar(64) NOT NULL DEFAULT 'weapon_knife_t',
      PRIMARY KEY (`steamid`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS `wp_player_gloves` (
      `steamid` varchar(18) NOT NULL,
      `weapon_team` int NOT NULL,
      `weapon_defindex` int NOT NULL DEFAULT 0,
      PRIMARY KEY (`steamid`, `weapon_team`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS `wp_player_agents` (
      `steamid` varchar(18) NOT NULL,
      `agent_ct` varchar(64) DEFAULT NULL,
      `agent_t` varchar(64) DEFAULT NULL,
      PRIMARY KEY (`steamid`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS `wp_player_music` (
      `steamid` varchar(18) NOT NULL,
      `weapon_team` int NOT NULL,
      `music_id` int NOT NULL DEFAULT 0,
      PRIMARY KEY (`steamid`, `weapon_team`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
]

def setup_railway_database(host, port, user, password, database):
    print(f"\n Conectando ao MySQL do Railway em {host}:{port}...")
    conn = pymysql.connect(
        host=host,
        port=int(port),
        user=user,
        password=password,
        database=database,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with conn.cursor() as cur:
        print("Criando tabelas oficiais do WeaponPaints (skins, facas, luvas, agentes, music)...")
        for q in QUERIES:
            cur.execute(q.strip())
        conn.commit()
    
    print(" Tabelas criadas com sucesso no Railway MySQL!")
    conn.close()

if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else os.getenv("DB_HOST", "localhost")
    port = sys.argv[2] if len(sys.argv) > 2 else os.getenv("DB_PORT", "3306")
    user = sys.argv[3] if len(sys.argv) > 3 else os.getenv("DB_USER", "root")
    password = sys.argv[4] if len(sys.argv) > 4 else os.getenv("DB_PASSWORD", "")
    database = sys.argv[5] if len(sys.argv) > 5 else os.getenv("DB_NAME", "railway")

    if not host or not password:
        print("Uso: python setup_railway.py <HOST> <PORT> <USER> <PASSWORD> <DATABASE>")
        print("Exemplo: python setup_railway.py seu_host.proxy.rlwy.net 12345 root sua_senha railway")
        sys.exit(1)

    setup_railway_database(host, port, user, password, database)
