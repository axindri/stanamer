# STANAMER

<p align="center">
  <img src="frontend/public/icon.jpg" alt="STANAMER" width="72" height="72" />
</p>

<p align="center">
  <strong>Стандартизация нейминга</strong> для таблиц, колонок, DAG, топиков и других сущностей
</p>

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-0.0.1-111111?style=flat-square" />
  <img alt="license" src="https://img.shields.io/badge/license-GPL--3.0-blue?style=flat-square" />
  <img alt="docker" src="https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img alt="fastapi" src="https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img alt="react" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="shadcn" src="https://img.shields.io/badge/ui-shadcn%2Fui-000000?style=flat-square" />
</p>

<p align="center">
  <img src="docs/screenshots/home.png" alt="Главная страница STANAMER" width="820" />
</p>

Опишите сущность — получите варианты имён с пояснениями, стилем (`snake_case` / `camelCase` / …), префиксом, постфиксом и опциональным контекстом. Есть UI, HTTP API и Swagger.

## Быстрый старт

```bash
cp .env.example .env   # OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL
docker compose up -d
```

Откройте **http://localhost:8080**

```bash
docker compose logs -f
docker compose down
```

## Скриншоты

| Нейминг | Параметры | Результат |
|:---:|:---:|:---:|
| ![naming](docs/screenshots/naming.png) | ![params](docs/screenshots/naming-params.png) | ![results](docs/screenshots/naming-results.png) |

<p align="center">
  <img src="docs/screenshots/development.png" alt="Development / API" width="820" />
</p>

## Возможности

- Генерация имён для `table`, `column`, `dag`, `topic`, `metric`, `schema`, `function`
- Доп. параметры: длина, количество, короткие имена, цифры, префикс / постфикс, контекст
- История в `localStorage`, тема light / dark / system
- API: `POST /api/v1/naming/generate` · UI-доки на `/dev` · Swagger на `/swagger`

## Стек

| Слой | Технологии |
|---|---|
| Frontend | React, Vite, shadcn/ui, Tailwind |
| Backend | FastAPI, OpenAI-compatible LLM |
| Runtime | Docker Compose, nginx → API |

## Конфиг (`.env`)

| Переменная | Назначение |
|---|---|
| `STANAMER_PORT` | Порт UI (по умолчанию `8080`) |
| `OPENAI_BASE_URL` | Base URL шлюза |
| `OPENAI_API_KEY` | Токен |
| `OPENAI_MODEL` | Модель |
| `OPENAI_VERIFY_SSL` | Проверка TLS (`true` / `false`) |
| `CORS_ORIGINS` | Origins через запятую |

## Лицензия

[GPL-3.0](LICENSE)
