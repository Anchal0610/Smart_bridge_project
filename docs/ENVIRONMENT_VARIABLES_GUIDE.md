## Environment Variables Guide – ArogyaMitra

This document explains **all key environment variables**, how they are used in the project, and **step‑by‑step instructions** to obtain or configure each one.

The project uses two primary `.env` files:

- **Backend**: `backend/.env`
- **Frontend**: `frontend/.env`

---

## 1. Backend Environment Variables (`backend/.env`)

Create a file named `.env` in the `backend` directory with content similar to:

```env
# Database
DATABASE_URL=sqlite:///./arogyamitra.db
SECRET_KEY=arogyamitra-super-secret-key-2024-fitness-ai

# App Settings
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]

# AI Services
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Google / YouTube
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id_here
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret_here
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Depending on the exact backend code, you may also have additional provider‑specific keys such as `SPOONACULAR_API_KEY` for nutrition data.

### 1.1 DATABASE_URL

- **Purpose**
  - Configures the database connection for the backend.
  - Development default is often SQLite; production should use PostgreSQL.

- **Examples**
  - Local SQLite:
    - `DATABASE_URL=sqlite:///./arogyamitra.db`
  - Local PostgreSQL:
    - `DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@localhost:5432/arogyamitra_db`
  - Managed PostgreSQL (cloud):
    - `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME`

- **How to get it**
  1. Decide your DB engine:
     - For quick local dev: keep SQLite.
     - For more robust setups: install PostgreSQL or use a cloud provider.
  2. Construct the URL string based on user, password, host, port, and database name.

### 1.2 SECRET_KEY

- **Purpose**
  - Used for signing JWTs, session tokens, and other cryptographic operations in the backend.

- **How to generate**
  - On Linux/macOS:
    - `python -c "import secrets; print(secrets.token_hex(32))"`
  - On Windows (PowerShell):
    - `python -c "import secrets; print(secrets.token_hex(32))"`
  - Paste the generated value into:
    - `SECRET_KEY=<generated_hex_string>`

### 1.3 ENVIRONMENT and DEBUG

- **ENVIRONMENT**
  - Typical values: `development`, `staging`, `production`.
  - Used to toggle behavior such as logging verbosity.

- **DEBUG**
  - `True` for local development.
  - `False` for staging/production to avoid leaking stack traces.

### 1.4 CORS_ORIGINS

- **Purpose**
  - Defines which frontend origins are allowed to call the backend.

- **Typical dev value**
  - `CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]`

- **Production**
  - Replace with your real frontend URLs, for example:
    - `["https://app.arogyamitra.com"]`

---

## 2. AI Provider Keys

These control access to external AI APIs.

### 2.1 GROQ_API_KEY

- **Purpose**
  - Authenticates requests to Groq’s API for LLaMA‑based models used in workout/nutrition/coaching logic.

- **How to obtain**
  1. Go to Groq’s website and create an account (search for “Groq cloud” or “Groq API”).
  2. Navigate to the **API Keys** or **Developer** section of your dashboard.
  3. Generate a new API key.
  4. Copy the key and set:
     - `GROQ_API_KEY=<your_groq_key_here>`

- **Notes**
  - Keep this key secret; do not commit it to Git.

### 2.2 OPENAI_API_KEY

- **Purpose**
  - Used for calling OpenAI’s models (e.g., GPT‑4 class models) as alternative or complement to Groq.

- **How to obtain**
  1. Sign in at `https://platform.openai.com`.
  2. Go to **View API keys**.
  3. Create a new secret key.
  4. Copy the key and configure:
     - `OPENAI_API_KEY=<your_openai_key_here>`

### 2.3 GEMINI_API_KEY

- **Purpose**
  - Used to call Google’s Gemini models for text or multimodal tasks.

- **How to obtain**
  1. Go to the Google AI Studio or Gemini developer page.
  2. Create a project or use an existing Google Cloud project.
  3. Enable the Gemini/Generative AI API.
  4. Generate an API key (often labeled as “API key for Generative Language”).
  5. Set:
     - `GEMINI_API_KEY=<your_gemini_key_here>`

---

## 3. Google & YouTube Integrations

### 3.1 GOOGLE_CALENDAR_CLIENT_ID

- **Purpose**
  - OAuth2 client ID for Google Calendar integration.

- **How to obtain**
  1. Visit `https://console.cloud.google.com` and log in.
  2. Create or select a Google Cloud project.
  3. Navigate to **APIs & Services → Credentials**.
  4. Click **Create Credentials → OAuth client ID**.
  5. Choose **Web application**.
  6. Set the **Authorized redirect URI** to match your backend setting, e.g.:
     - `http://localhost:8000/api/auth/google/callback`
  7. After creation, copy the **Client ID** and set:
     - `GOOGLE_CALENDAR_CLIENT_ID=<client_id_here>`

### 3.2 GOOGLE_CALENDAR_CLIENT_SECRET

- **Purpose**
  - OAuth2 client secret used together with the client ID to obtain tokens from Google.

- **How to obtain**
  1. In the same **Credentials** section where you created the OAuth client ID, click into the client.
  2. Copy the **Client secret**.
  3. Set:
     - `GOOGLE_CALENDAR_CLIENT_SECRET=<client_secret_here>`

### 3.3 GOOGLE_CALENDAR_REDIRECT_URI

- **Purpose**
  - The URL to which Google redirects after the user grants or denies permissions.
  - Must match exactly what you configure in Google Cloud Console.

- **Typical dev value**
  - `GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/auth/google/callback`

### 3.4 YOUTUBE_API_KEY

- **Purpose**
  - Access the YouTube Data API to fetch workout/exercise videos.

- **How to obtain**
  1. In the same Google Cloud Console project:
     - Go to **APIs & Services → Library**.
     - Enable the **YouTube Data API v3**.
  2. Go to **APIs & Services → Credentials**.
  3. Click **Create credentials → API key**.
  4. Copy the API key and set:
     - `YOUTUBE_API_KEY=<your_youtube_api_key_here>`

---

## 4. Nutrition / Other Third‑Party APIs

### 4.1 SPOONACULAR_API_KEY (if used)

- **Purpose**
  - Allows the backend to query Spoonacular for recipes and nutrition data.

- **How to obtain**
  1. Go to the Spoonacular developer portal.
  2. Sign up and create an application.
  3. Find your API key in the dashboard.
  4. Add to `backend/.env`:
     - `SPOONACULAR_API_KEY=<your_spoonacular_key_here>`

---

## 5. Frontend Environment Variables (`frontend/.env`)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 5.1 VITE_API_BASE_URL

- **Purpose**
  - Defines the base URL for all frontend → backend API calls.

- **Dev value**
  - `http://localhost:8000/api`

- **Production value**
  - Something like:
    - `https://api.arogyamitra.com/api`
  - Ensure CORS on the backend and frontend deployment URLs are aligned.

---

## 6. How to Manage Environment Variables Safely

- **Do NOT commit `.env` files** to git.
  - Ensure `.gitignore` includes `.env`.
- **Use separate `.env` files per environment**:
  - `.env.development`, `.env.staging`, `.env.production` (or similar convention).
- **Configuration stores (recommended for production)**:
  - Use the cloud provider’s secret manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, etc.).
  - Inject variables at deploy/runtime rather than bundling them into images.

---

## 7. Quick Checklist to Get All Environment Variables

1. **Database**
   - Decide DB (SQLite vs PostgreSQL).
   - Set `DATABASE_URL`.
2. **Security**
   - Generate `SECRET_KEY`.
3. **App Settings**
   - Set `ENVIRONMENT` and `DEBUG`.
   - Configure `CORS_ORIGINS` with all frontend URLs.
4. **AI Providers**
   - Create accounts and keys for:
     - Groq → `GROQ_API_KEY`
     - OpenAI → `OPENAI_API_KEY`
     - Gemini → `GEMINI_API_KEY`
5. **Google & YouTube**
   - Create a Google Cloud project.
   - Create OAuth client ID/secret:
     - `GOOGLE_CALENDAR_CLIENT_ID`
     - `GOOGLE_CALENDAR_CLIENT_SECRET`
   - Set `GOOGLE_CALENDAR_REDIRECT_URI`.
   - Enable YouTube Data API v3 and generate `YOUTUBE_API_KEY`.
6. **Nutrition Provider (optional)**
   - Spoonacular (or similar) → `SPOONACULAR_API_KEY`.
7. **Frontend**
   - Set `VITE_API_BASE_URL` in `frontend/.env`.

Once all of these are configured, the backend and frontend should be able to start via the provided scripts (`start.bat` / `start.sh`) and have full access to all integrations.

