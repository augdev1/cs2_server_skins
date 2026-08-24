import os
import pymysql
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Script de migração dinâmica de dados entre instâncias MySQL sem credenciais hardcoded

def migrate(old_params, new_params):
    print("\n Conectando aos dois bancos de dados...")
    old_conn = pymysql.connect(**old_params, cursorclass=pymysql.cursors.DictCursor)
    new_conn = pymysql.connect(**new_params, cursorclass=pymysql.cursors.DictCursor)

    tables = ['wp_player_skins', 'wp_player_knife', 'wp_player_gloves', 'wp_player_agents', 'wp_player_music']

    with old_conn.cursor() as old_cur, new_conn.cursor() as new_cur:
        for t in tables:
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
    if len(sys.argv) < 11:
        print("Uso:")
        print("python migrate_data_to_railway.py <OLD_HOST> <OLD_PORT> <OLD_USER> <OLD_PASS> <OLD_DB> <NEW_HOST> <NEW_PORT> <NEW_USER> <NEW_PASS> <NEW_DB>")
        sys.exit(1)

    old_params = {
        'host': sys.argv[1],
        'port': int(sys.argv[2]),
        'user': sys.argv[3],
        'password': sys.argv[4],
        'database': sys.argv[5]
    }

    new_params = {
        'host': sys.argv[6],
        'port': int(sys.argv[7]),
        'user': sys.argv[8],
        'password': sys.argv[9],
        'database': sys.argv[10]
    }

    migrate(old_params, new_params)
