import sys
import pymysql
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

sys.stdout.reconfigure(encoding='utf-8')

DB_CONFIG = {
    "host": DB_HOST,
    "port": DB_PORT,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "cursorclass": pymysql.cursors.DictCursor
}

def inspect_database():
    print("=" * 60)
    print(f" Conectando ao MySQL em {DB_CONFIG['host']}:{DB_CONFIG['port']}...")
    print("=" * 60)
    
    try:
        connection = pymysql.connect(**DB_CONFIG)
        print(" [OK] Conexão estabelecida com sucesso!\n")
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            
            if not tables:
                print(" [!] Nenhuma tabela encontrada no banco de dados.")
                return
            
            table_key = list(tables[0].keys())[0]
            table_names = [row[table_key] for row in tables]
            
            print(f" [Tabelas Encontradas: {len(table_names)}]")
            for t in table_names:
                print(f"  - {t}")
            print("\n" + "=" * 60)
            
            for table in table_names:
                print(f"\n >>> Tabela: `{table}`")
                print("-" * 50)
                
                cursor.execute(f"DESCRIBE `{table}`;")
                columns = cursor.fetchall()
                print(f"{'Campo':<25} {'Tipo':<20} {'Nulo':<6} {'Chave':<6} {'Default'}")
                print("-" * 70)
                for col in columns:
                    field = str(col.get('Field'))
                    c_type = str(col.get('Type'))
                    null = str(col.get('Null'))
                    key = str(col.get('Key'))
                    default = str(col.get('Default'))
                    print(f"{field:<25} {c_type:<20} {null:<6} {key:<6} {default}")
                
                cursor.execute(f"SELECT COUNT(*) as total FROM `{table}`;")
                count_res = cursor.fetchone()
                total = count_res['total'] if count_res else 0
                print(f"\n Total de registros: {total}")
                
                if total > 0:
                    cursor.execute(f"SELECT * FROM `{table}` LIMIT 5;")
                    rows = cursor.fetchall()
                    print(" Amostra de registros (até 5):")
                    for idx, row in enumerate(rows, 1):
                        print(f"  [{idx}] {row}")
                print("=" * 60)
                
    except pymysql.MySQLError as e:
        print(f" [ERRO] Falha no MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
            print("\n Conexão finalizada.")

if __name__ == "__main__":
    inspect_database()
