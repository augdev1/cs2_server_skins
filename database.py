import pymysql
from contextlib import contextmanager
from typing import Generator
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

DB_CONFIG = {
    "host": DB_HOST,
    "port": DB_PORT,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "cursorclass": pymysql.cursors.DictCursor,
    "autocommit": True,
    "connect_timeout": 10
}

@contextmanager
def get_db_cursor() -> Generator[pymysql.cursors.DictCursor, None, None]:
    """Context manager para obter conexão e cursor MySQL."""
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            yield cursor
    finally:
        conn.close()

def test_db_connection() -> bool:
    """Testa a conectividade com o banco de dados."""
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1 as is_alive;")
            res = cur.fetchone()
            return bool(res and res.get("is_alive") == 1)
    except Exception as e:
        print(f"[DB ERROR] Falha ao conectar ao MySQL: {e}")
        return False
