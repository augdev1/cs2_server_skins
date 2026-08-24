import pymysql
import sys

sys.stdout.reconfigure(encoding='utf-8')

def migrate():
    old_params = {
        'host': 'bj3x5yez1tqpijaiwkuo-mysql.services.clever-cloud.com',
        'port': 3306,
        'user': 'ueqcggkcwbxiqaxa',
        'password': 'sKiRdjMfsbNIzw3NpqzV',
        'database': 'bj3x5yez1tqpijaiwkuo'
    }

    new_params = {
        'host': 'altaria.proxy.rlwy.net',
        'port': 16782,
        'user': 'root',
        'password': 'tjguEDSlWQCQVJsXwzxMbLEQzgihRAQV',
        'database': 'railway'
    }

    print("\n Conectando aos dois bancos de dados...")
    old_conn = pymysql.connect(**old_params, cursorclass=pymysql.cursors.DictCursor)
    new_conn = pymysql.connect(**new_params, cursorclass=pymysql.cursors.DictCursor)

    tables = ['wp_player_skins', 'wp_player_knife', 'wp_player_gloves', 'wp_player_agents', 'wp_player_music']

    with old_conn.cursor() as old_cur, new_conn.cursor() as new_cur:
        for t in tables:
            # Obtém colunas válidas no Railway
            new_cur.execute(f"DESCRIBE `{t}`")
            valid_cols = set([col['Field'] for col in new_cur.fetchall()])

            old_cur.execute(f"SELECT * FROM `{t}`")
            rows = old_cur.fetchall()
            print(f"  Tabela {t}: migrando {len(rows)} registros...")
            
            for r in rows:
                filtered_item = {k: v for k, v in r.items() if k in valid_cols}
                if not filtered_item:
                    continue
                cols = list(filtered_item.keys())
                col_names = ", ".join([f"`{c}`" for c in cols])
                placeholders = ", ".join(["%s"] * len(cols))
                update_clause = ", ".join([f"`{c}`=VALUES(`{c}`)" for c in cols])
                sql = f"INSERT INTO `{t}` ({col_names}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE {update_clause}"
                vals = [filtered_item[c] for c in cols]
                new_cur.execute(sql, vals)
            new_conn.commit()

    print("\n Migração concluída com 100% de sucesso!")
    old_conn.close()
    new_conn.close()

if __name__ == "__main__":
    migrate()
