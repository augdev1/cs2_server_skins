import pymysql
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Copia todos os dados do Clever Cloud atual para o novo MySQL do Railway

def migrate(old_conn_params, new_conn_params):
    print("\n Conectando aos dois bancos de dados...")
    old_conn = pymysql.connect(**old_conn_params, cursorclass=pymysql.cursors.DictCursor)
    new_conn = pymysql.connect(**new_conn_params, cursorclass=pymysql.cursors.DictCursor)

    tables = ['wp_player_skins', 'wp_player_knife', 'wp_player_gloves', 'wp_player_agents', 'wp_player_music']

    with old_conn.cursor() as old_cur, new_conn.cursor() as new_cur:
        for t in tables:
            old_cur.execute(f"SELECT * FROM `{t}`")
            rows = old_cur.fetchall()
            print(f"  Tabela {t}: migrando {len(rows)} registros...")
            if rows:
                cols = list(rows[0].keys())
                col_names = ", ".join([f"`{c}`" for c in cols])
                placeholders = ", ".join(["%s"] * len(cols))
                update_clause = ", ".join([f"`{c}`=VALUES(`{c}`)" for c in cols])
                sql = f"INSERT INTO `{t}` ({col_names}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE {update_clause}"

                for r in rows:
                    vals = [r[c] for c in cols]
                    new_cur.execute(sql, vals)
                new_conn.commit()

    print("\n Migração concluída com 100% de sucesso!")
    old_conn.close()
    new_conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Uso: python migrate_data_to_railway.py <NEW_HOST> <NEW_PORT> <NEW_USER> <NEW_PASSWORD> <NEW_DATABASE>")
        sys.exit(1)

    old_params = {
        'host': 'bj3x5yez1tqpijaiwkuo-mysql.services.clever-cloud.com',
        'port': 3306,
        'user': 'ueqcggkcwbxiqaxa',
        'password': 'sKiRdjMfsbNIzw3NpqzV',
        'database': 'bj3x5yez1tqpijaiwkuo'
    }

    new_params = {
        'host': sys.argv[1],
        'port': int(sys.argv[2]),
        'user': sys.argv[3],
        'password': sys.argv[4],
        'database': sys.argv[5]
    }

    migrate(old_params, new_params)
