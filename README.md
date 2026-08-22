# 🎮 CS2 WeaponPaints Web

> Interface Web moderna e responsiva para seleção e personalização de skins no **Counter-Strike 2**, integrada diretamente ao plugin [Nereziel/cs2-WeaponPaints](https://github.com/Nereziel/cs2-WeaponPaints) (CounterStrikeSharp) através de banco de dados **MySQL / MariaDB**.

---

## 🌟 Funcionalidades

- **Autenticação Steam Oficial (OpenID):** Identificação segura do `SteamID64` do jogador, foto de perfil e nick.
- **Modo Dev Login:** Permite testar a interface em ambiente local inserindo diretamente o SteamID.
- **Suporte Completo a Times:** Configuração independente de skins para o lado **Terrorista (TR)** e **Contra-Terrorista (CT)**.
- **Catálogo Completo do CS2:**
  - **35 Armas:** Rifles, Snipers, Pistolas, SMGs, Espingardas e Metralhadoras Pesadas.
  - **20 Facas:** Karambit, Butterfly, M9 Bayonet, Bayonet, Kukri Knife, Skeleton, Talon, etc.
  - **Luvas, Agentes e Trilhas Sonoras (Music Kits).**
  - **Mais de 2.100 skins** com imagens oficiais em alta definição via **Steam CDN**.
- **Personalização Avançada:**
  - **Wear / Float:** Slider contínuo de `0.000` a `1.000` com detecção de condição (*FN, MW, FT, WW, BS*).
  - **Pattern Seed:** Seletor de `0` a `1000`.
  - **StatTrak™:** Contador de eliminações customizado.
  - **Nametag:** Nome gravado personalizado na arma.
  - **Filtros por Raridade:** Destaque para skins *Covert*, *Classified*, *Restricted*, *Mil-Spec*.
- **Sincronização em Tempo Real:** Gravação direta nas tabelas do MySQL utilizadas pelo servidor de CS2.

---

## 🏗️ Arquitetura do Projeto

```
.
├── docker-compose.yml          # Orquestração do Backend e Frontend com Docker
├── .env.example                # Template das variáveis de ambiente
├── backend/                    # API REST em Python (FastAPI + PyMySQL)
│   ├── Dockerfile
│   ├── main.py                 # Inicialização com CORS e Swagger UI (/docs)
│   ├── config.py               # Leitura de variáveis de ambiente
│   ├── database.py             # Conexão e transações com o MySQL
│   ├── models.py               # Schemas Pydantic tipados
│   ├── auth.py                 # Steam OpenID & JWT
│   ├── routers/
│   │   ├── auth.py             # Rotas de Autenticação (/auth/steam, /dev-login, /me)
│   │   ├── items.py            # Catálogo (/api/items/weapons, /knives, /skins, etc.)
│   │   └── player.py           # Inventário (/api/player/equipment, /skin, /knife)
│   ├── data/                   # Catálogo JSON com imagens Steam CDN e Paint IDs
│   ├── requirements.txt        # Dependências Python
│   └── test_api.py             # Suíte de testes automatizados
└── frontend/                   # Interface Web em React (Vite + Nginx)
    ├── Dockerfile              # Build multi-stage Node -> Nginx
    ├── nginx.conf              # Configuração do Nginx e proxy reverso
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Aplicação principal React
        ├── index.css           # Design System CS2 (Dark mode, glassmorphism)
        ├── services/api.js     # Cliente Axios com injeção de JWT
        └── components/         # Componentes modulares
```

---

## 🚀 Como Executar

### Opção 1: Usando Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/augdev1/cs2_server_skins.git
   cd cs2_server_skins
   ```

2. Crie seu arquivo `.env` a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
   *(Preencha as credenciais do seu banco de dados MySQL no arquivo `.env`)*

3. Inicie os containers com Docker Compose:
   ```bash
   docker compose up --build -d
   ```

4. Acesse:
   - 🌐 **Frontend (Painel Web):** [http://localhost:3000](http://localhost:3000)
   - 📑 **API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Opção 2: Desenvolvimento Local (Sem Docker)

#### 1. Backend (FastAPI)
```bash
# Instale as dependências
pip install -r backend/requirements.txt

# Configure o arquivo .env ou variáveis de ambiente
# Inicie o servidor
python backend/main.py
```
A API estará rodando em `http://localhost:8000`.

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
O frontend estará rodando em `http://localhost:3000`.

---

## ⚙️ Variáveis de Ambiente (`.env`)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_HOST` | Host do banco de dados MySQL do servidor CS2 | `localhost` ou IP |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASSWORD` | Senha do MySQL | `sua_senha` |
| `DB_NAME` | Nome do banco de dados | `cs2_weaponpaints` |
| `STEAM_API_KEY` | Chave Web API da Steam ([Obter aqui](https://steamcommunity.com/dev/apikey)) | `SUA_CHAVE_AQUI` |
| `BASE_URL` | URL pública da API | `http://localhost:8000` |
| `FRONTEND_URL` | URL pública do Frontend | `http://localhost:3000` |
| `JWT_SECRET` | Chave para assinatura dos tokens de sessão | `chave-secreta-aleatoria` |

---

## 🗄️ Tabelas Utilizadas no Banco de Dados

Esta aplicação lê e grava nas seguintes tabelas criadas pelo plugin `cs2-WeaponPaints`:

- **`wp_player_skins`**: Armazena as skins de armas e facas (`steamid`, `weapon_team`, `weapon_defindex`, `weapon_paint_id`, `weapon_wear`, `weapon_seed`, `weapon_nametag`, `weapon_stattrak`, `stickers`, `keychain`).
- **`wp_player_knife`**: Armazena o modelo de faca equipado por time (`steamid`, `weapon_team`, `knife`).
- **`wp_player_gloves`**: Armazena o modelo de luvas equipado por time (`steamid`, `weapon_team`, `weapon_defindex`).
- **`wp_player_agents`**: Armazena agentes customizados (`agent_ct`, `agent_t`).
- **`wp_player_music`**: Armazena a trilha sonora (`music_id`).

---

## 🧪 Testes Automatizados

Para executar os testes de integração da API:
```bash
python backend/test_api.py
```

---

## 📜 Licença

Este projeto é desenvolvido para a comunidade de Counter-Strike 2. Distribuído sob a licença MIT.
