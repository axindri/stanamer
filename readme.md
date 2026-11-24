# Stanamer

Помощник для нейминга таблиц, колонок, DAG, функций и других сущностей.
Стек: **FastAPI** + **React (Vite)** + **shadcn/ui**.

## Docker (рекомендуется)

Один `docker-compose.yml` поднимает backend и frontend (nginx проксирует `/api`).

```bash
cp .env.example .env   # заполните OPENAI_* и при необходимости порт
docker compose up --build -d
```

UI: http://localhost:8080

Параметры из корневого `.env` пробрасываются в контейнеры (`OPENAI_*`, `CORS_ORIGINS`, `APP_ENV`, `STANAMER_PORT`).
Логи контейнеров ограничены: `max-size=10m`, `max-file=3`.

```bash
docker compose logs -f
docker compose down
```

## Локальная разработка

### Backend

```bash
cp .env.example .env   # общий файл в корне репозитория
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://127.0.0.1:5173 — Vite проксирует `/api` на `:8000`.

## Переменные окружения (корневой `.env`)

| Переменная | Описание |
|---|---|
| `STANAMER_PORT` | Порт UI на хосте (default `8080`) |
| `APP_ENV` | `development` / `production` |
| `CORS_ORIGINS` | Origins через запятую |
| `OPENAI_BASE_URL` | Base URL OpenAI-compatible шлюза |
| `OPENAI_API_KEY` | Токен |
| `OPENAI_MODEL` | Имя модели |
| `OPENAI_VERIFY_SSL` | Проверка TLS (`true`/`false`) |
| `OPENAI_CA_BUNDLE` | Корп CA (Docker: `/certs/rootca.crt`). По умолчанию берётся **системное** хранилище как в VS Code (`truststore`) |

> VS Code-расширение видит корп-сертификаты из OS, а обычный Python — нет. Stanamer теперь тоже использует OS trust store. В Docker положите CA в `./certs/rootca.crt`.
