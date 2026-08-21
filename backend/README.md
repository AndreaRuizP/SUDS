# Backend SUDS — Guía rápida de arranque

Requiere Python 3.12 (no usar 3.13/3.14: `scipy` no tiene wheels y falla al compilar).

## Opción A: Docker (recomendada, igual en cualquier SO)

```bash
cd backend
cp .env.example .env
docker compose up
```

Levanta Postgres + API en `http://localhost:8000` con hot-reload. No necesitas instalar Python ni nada más.

## Opción B: Local sin Docker

1. Instala [Python 3.12](https://www.python.org/downloads/) si no lo tienes.
2. Crea el entorno virtual e instala dependencias:

   ```bash
   cd backend
   py -3.12 -m venv venv          # Windows
   # python3.12 -m venv venv      # Linux/Mac

   venv/Scripts/pip install -r requirements.txt   # Windows
   # venv/bin/pip install -r requirements.txt     # Linux/Mac
   ```

3. Configura la base de datos en `.env` (copia `.env.example`):
   - Con PostgreSQL local: deja `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/suds`.
   - Sin PostgreSQL (más simple): usa SQLite → `DATABASE_URL=sqlite:///./suds.db`.

4. Arranca el servidor:

   ```bash
   venv/Scripts/python -m uvicorn app.main:app --reload --port 8000   # Windows
   # venv/bin/python -m uvicorn app.main:app --reload --port 8000    # Linux/Mac
   ```

## Verificar

- API: http://127.0.0.1:8000
- Docs interactivas: http://127.0.0.1:8000/docs
- Usuario admin por defecto: el definido en `.env` (`DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`), se crea solo al iniciar.


./venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000