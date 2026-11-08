# ShilpoShikha

A React and Tailwind workspace for craft learning, artisan and buyer accounts, wholesale orders, simulated advances, shipment tracking, and admin verification.

## Run locally

Use two terminals from the project root.

Terminal 1, install the Python API dependencies and start FastAPI:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2, start the React app:

```powershell
npm install
npm run dev
```

Open the Vite URL, normally `http://127.0.0.1:5173`. FastAPI's interactive API documentation is at `http://127.0.0.1:8000/docs`.

New databases start empty; no sample accounts or orders are created. Create the first administrator before starting the API:

```powershell
python -m backend.create_admin
```

Registration and login issue 30-day bearer tokens. The `X-User-Id` shortcut is disabled by default and should only be enabled for isolated testing.

## MySQL

Create an empty MySQL database, then configure the API before starting it:

```powershell
$env:DATABASE_URL = "mysql+pymysql://USER:PASSWORD@127.0.0.1:3306/shilposhikha"
$env:SHILPO_DEMO_MODE = "false"
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Tables are created at startup. On a new production database, create the first administrator from an interactive prompt before starting the API:

Do not copy the local development `shilposhikha.db` into production. Start with a fresh production database.

```powershell
$env:DATABASE_URL = "mysql+pymysql://USER:PASSWORD@127.0.0.1:3306/shilposhikha"
$env:SHILPO_DEMO_MODE = "false"
python -m backend.create_admin
```

The command asks for an admin name, email, and a password without echoing it to the terminal. Use a migration tool before evolving a deployed schema.

## AI provider

- The AI teacher and project feedback use an OpenAI-compatible chat-completions endpoint. Configure these variables in the API process to enable them:

```powershell
$env:AI_API_URL = "https://your-provider.example/v1/chat/completions"
$env:AI_API_KEY = "YOUR_PROVIDER_KEY"
$env:AI_MODEL = "YOUR_MODEL"
```

- Without all three values, AI routes return `503` and the UI disables AI actions; no canned answer or score is generated.

## Member integration

- Authentication is shared through `Authorization: Bearer <token>`. Member 1 and Member 2 should use the registered user ID from the token response, not accept a client-supplied owner ID.
- Member 1's course, lesson, quiz, progress, and project-submission APIs are not present in this repository. The project feedback endpoint currently accepts a description; it needs a project/submission ID and assessment status integration once Member 1's schema/API is available. Photo upload and lesson unlock after approval remain with Member 1.
- Member 2's artisan activation, product catalogue, product images, and pricing APIs are not present here. The order API now enforces the 20-piece minimum and validates artisan roles, but it still accepts product text and price from the buyer. Before joining the marketplace, replace those fields with a product ID and derive artisan and price from Member 2's approved catalogue.
- This repository contains a React/Vite frontend and FastAPI backend, not Android or PHP modules. Android/PHP/MySQL integration requires the other member repositories and a shared API/database deployment plan.

## Simulated workflows

- Payment confirmation is simulated and never moves money.
- Verification stores a document name only; no document upload, NID check, or identity provider is configured.
- Delivery status is manually simulated; no courier API is connected.
- Before public deployment, configure HTTPS, secrets, database migrations, rate limiting, account recovery, and real payment, identity, and courier providers as appropriate.

## Checks

```powershell
npm run lint
npm run build
python -m unittest backend.test_main
```