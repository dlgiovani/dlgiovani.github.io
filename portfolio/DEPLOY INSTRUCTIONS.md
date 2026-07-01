---
Deploy plan — dlgiovani.dev (Oracle Cloud)

OS: Oracle Linux Server 8.10 aarch64
Default user: opc
Repo is already cloned on the server. Frontend source is at portfolio/, backend at backend/.

Overview

The Oracle server runs:
- Nginx      — serves portfolio/dist/ at dlgiovani.dev, proxies /api/ to uvicorn
- FastAPI    — uvicorn on 127.0.0.1:8000, managed by systemd
- PostgreSQL — local database, migrated with Alembic
- Certbot    — TLS via Let's Encrypt

---
Step 0 — Source already updated

These changes are already committed in the repo:
  - astro.config.ts: site is 'https://dlgiovani.dev'
  - portfolio/.gitignore: dist/ is ignored (not committed — built on the server)
  - backend/app/config.py: allowed_origins overridden via .env on the server

Nothing to change locally before proceeding.

---
Step 1 — DNS

In your DNS provider, add/update:

┌──────┬───────────────────┬────────────────────┐
│ Type │       Name        │       Value        │
├──────┼───────────────────┼────────────────────┤
│ A    │ dlgiovani.dev     │ <oracle-public-ip> │
├──────┼───────────────────┼────────────────────┤
│ A    │ www.dlgiovani.dev │ <oracle-public-ip> │
└──────┴───────────────────┴────────────────────┘

Let this propagate before running certbot.

---
Step 2 — Oracle Cloud — open ports

In the OCI console → Networking → VCN → Security List → Ingress Rules, add:

┌─────────────┬──────────┬──────┐
│ Source CIDR │ Protocol │ Port │
├─────────────┼──────────┼──────┤
│ 0.0.0.0/0   │ TCP      │ 80   │
├─────────────┼──────────┼──────┤
│ 0.0.0.0/0   │ TCP      │ 443  │
└─────────────┴──────────┴──────┘

Then open the ports in the OS firewall (Oracle Linux 8 uses firewalld):

  sudo firewall-cmd --permanent --add-service=http
  sudo firewall-cmd --permanent --add-service=https
  sudo firewall-cmd --reload
  sudo firewall-cmd --list-all   # verify http and https appear

---
Step 3 — System packages

  sudo dnf update -y

  # EPEL — needed for certbot, python3.11, and other extras
  sudo dnf install -y epel-release
  sudo dnf update -y

  # Nginx
  sudo dnf install -y nginx
  sudo systemctl enable --now nginx

  # Certbot (from EPEL)
  sudo dnf install -y certbot python3-certbot-nginx

  # Python 3.11 (OL8 ships 3.6/3.8 by default; 3.11 is in EPEL)
  sudo dnf install -y python3.11 python3.11-devel
  python3.11 -m ensurepip --upgrade
  python3.11 -m pip install --upgrade pip

  # Node 22 via NodeSource (RPM build for RHEL/OL8)
  curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
  sudo dnf install -y nodejs

  # Build tools (needed to compile some Python C extensions)
  sudo dnf install -y gcc gcc-c++ make

  # ffmpeg (RPM Fusion — EL8 aarch64 is supported; not in EPEL due to codec licensing)
  sudo dnf install -y --nogpgcheck https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-8.noarch.rpm
  sudo dnf install -y ffmpeg

  # Verify
  node -v           # >= 22
  python3.11 --version
  psql --version    # after Step 4
  ffmpeg -version    # needed to transcode APOD "video of the day" entries to webm

---
Step 4 — PostgreSQL

OL8's built-in PostgreSQL is old. Use the official PGDG repo:

  # Add PGDG repo for OL8 / RHEL 8 (aarch64 is supported)
  sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-aarch64/pgdg-redhat-repo-latest.noarch.rpm

  # Disable the built-in module to avoid conflict
  sudo dnf -qy module disable postgresql

  # Install PostgreSQL 16
  sudo dnf install -y postgresql16-server postgresql16

  # Initialize and start
  sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
  sudo systemctl enable --now postgresql-16

  # Create user and database
  sudo -u postgres /usr/pgsql-16/bin/psql <<'SQL'
  CREATE USER dlgiovani WITH PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
  CREATE DATABASE dlgiovani_db OWNER dlgiovani;
  SQL

The DATABASE_URL for the backend:
  postgresql+asyncpg://dlgiovani:CHOOSE_A_STRONG_PASSWORD@localhost/dlgiovani_db

Note: if asyncpg fails to connect, check pg_hba.conf allows local scram auth:
  sudo grep -n "^host" /var/lib/pgsql/16/data/pg_hba.conf
  # should include: host all all 127.0.0.1/32 scram-sha-256
  # if missing, add it and: sudo systemctl restart postgresql-16

---
Step 5 — Pull code and build (on the server)

The repo is already on the server. Pull the latest, then build the frontend:

  cd ~/dlgiovani.github.io   # or wherever the repo is cloned — adjust if needed

  git pull origin main

  # Install/update frontend dependencies and build
  cd portfolio
  npm ci
  PUBLIC_API_URL=https://dlgiovani.dev npm run build
  # This produces portfolio/dist/ which nginx will serve

The backend has no build step — Python source is used directly.

---
Step 6 — Backend setup

  cd ~/dlgiovani.github.io/backend

  # Virtual environment (first time only)
  python3.11 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt

Create ~/dlgiovani.github.io/backend/.env  (adjust path to repo root):

  DATABASE_URL=postgresql+asyncpg://dlgiovani:CHOOSE_A_STRONG_PASSWORD@localhost/dlgiovani_db
  FREECRYPTOAPI_KEY=<your_key>
  EXCHANGERATEAPI_KEY=<your_key>
  GITHUB_PAT=<your_pat>
  NASA_API_KEY=<your_key>
  ALLOWED_ORIGINS=https://dlgiovani.dev,https://www.dlgiovani.dev

Run Alembic migrations:

  cd ~/dlgiovani.github.io/backend
  source .venv/bin/activate
  alembic upgrade head

Quick smoke test:

  uvicorn app.main:app --host 127.0.0.1 --port 8000 &
  curl http://localhost:8000/health
  # → {"status":"ok"}
  kill %1

---
Step 7 — systemd service for the backend

Adjust WorkingDirectory and ExecStart to the actual repo path on the server:

  sudo tee /etc/systemd/system/dlgiovani-api.service <<'EOF'
  [Unit]
  Description=dlgiovani.dev API
  After=network.target postgresql-16.service

  [Service]
  User=opc
  WorkingDirectory=/home/opc/dlgiovani.github.io/backend
  ExecStart=/home/opc/dlgiovani.github.io/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2
  Restart=always
  RestartSec=5
  Environment=PYTHONPATH=/home/opc/dlgiovani.github.io/backend

  [Install]
  WantedBy=multi-user.target
  EOF

  sudo systemctl daemon-reload
  sudo systemctl enable --now dlgiovani-api
  sudo systemctl status dlgiovani-api

---
Step 8 — SELinux (Oracle Linux 8 has it enforcing by default)

Nginx needs permission to proxy to a local port:

  sudo setsebool -P httpd_can_network_connect 1

Verify no denials after setting up nginx:

  sudo ausearch -m avc -ts recent

---
Step 9 — Nginx

On RHEL/OL8, nginx uses /etc/nginx/conf.d/ (not sites-available).
The root must point to portfolio/dist/ inside the repo. Adjust the path below to match
where the repo is cloned on the server.

  sudo tee /etc/nginx/conf.d/dlgiovani.dev.conf <<'EOF'
  server {
      listen 80;
      server_name dlgiovani.dev www.dlgiovani.dev;

      # certbot will add the SSL block and redirect in Step 10
      root /home/opc/dlgiovani.github.io/portfolio/dist;
      index index.html;

      location /api/ {
          # consulting form accepts file uploads (10MB/file cap in the app);
          # nginx's default 1m body limit would 413 them first
          client_max_body_size 20m;
          proxy_pass http://127.0.0.1:8000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      location / {
          try_files $uri $uri/ $uri.html =404;
      }
  }
  EOF

  sudo nginx -t
  sudo systemctl reload nginx

If the existing nginx config already exists (old portfolio config), remove or replace it:
  sudo rm /etc/nginx/conf.d/<old-config>.conf
  # then re-run the tee command above

---
Step 10 — TLS (Let's Encrypt)

DNS must be propagated before this step (verify with: dig dlgiovani.dev).

  sudo certbot --nginx -d dlgiovani.dev -d www.dlgiovani.dev

Certbot edits the nginx config to add SSL and the HTTP→HTTPS redirect automatically.
Verify after:

  sudo nginx -t && sudo systemctl reload nginx
  sudo certbot renew --dry-run

---
Step 11 — Verification checklist

  curl https://dlgiovani.dev/api/health
  # → {"status":"ok"}

  curl https://dlgiovani.dev/api/guestbook
  # → {"entries":[...], "has_more":false}

  curl https://dlgiovani.dev/api/github-stats
  # → 503 until GITHUB_PAT is set, then real data

  curl https://dlgiovani.dev/api/ticker
  # → {"EUR_USD":...}

  curl https://dlgiovani.dev/api/apod
  # → 503 until NASA_API_KEY is set (or the DEMO_KEY quota is exhausted), then real data

  curl -I https://dlgiovani.dev
  # → HTTP/2 200, content-type: text/html

In the browser: open https://dlgiovani.dev, check:
  - [ ] Site loads and signals section shows live counters
  - [ ] Guestbook pagination works
  - [ ] Playground fetches pokémon + weather
  - [ ] Ticker shows live FX + commits today
  - [ ] /pt/ locale works

---
Re-deploys (after this initial setup)

Frontend change:
  git pull origin main
  cd portfolio && npm ci && PUBLIC_API_URL=https://dlgiovani.dev npm run build
  # nginx serves portfolio/dist/ directly — no restart needed

Backend change:
  git pull origin main
  cd backend && source .venv/bin/activate && pip install -r requirements.txt
  alembic upgrade head   # only if there are new migrations
  sudo systemctl restart dlgiovani-api

Both:
  git pull origin main
  cd portfolio && npm ci && PUBLIC_API_URL=https://dlgiovani.dev npm run build
  cd ../backend && source .venv/bin/activate && pip install -r requirements.txt
  sudo systemctl restart dlgiovani-api

---
Things to keep in mind

- PUBLIC_API_URL is baked into the static HTML at build time.
  Always pass it: PUBLIC_API_URL=https://dlgiovani.dev npm run build

- Logs: journalctl -u dlgiovani-api -f

- PostgreSQL service name is postgresql-16 (not postgresql).
  sudo systemctl status postgresql-16

- Database backups:
  sudo -u postgres /usr/pgsql-16/bin/pg_dump dlgiovani_db > backup.sql

- GITHUB_PAT: create a fine-grained PAT on GitHub with read-only access to public repositories.
  The /api/github-stats endpoint returns 503 until it is set.

- NASA_API_KEY: get a free key at https://api.nasa.gov. The default DEMO_KEY is limited to
  ~30 requests/hour/IP and will make /api/apod* return 503 once exhausted — this is the most
  common cause of APOD outages in production. The APOD cache refreshes hourly and is persisted
  to backend/data/apod/ so it survives restarts and is shared across uvicorn workers. If the
  primary NASA API is unavailable (or today's entry has no still image), the backend falls back
  to scraping https://apod.nasa.gov/apod/archivepixFull.html for the freshest available image,
  so /api/apod* should only ever return 503 on a brand-new deployment that hasn't completed its
  first successful fetch yet.

- APOD "video of the day": self-hosted videos (direct .mp4/.webm links) are transcoded with
  ffmpeg to a small VP9/WebM (~480p) plus a poster frame extracted from the video, served at
  /api/apod/video and /api/apod/thumb+image respectively. ffmpeg is required for both steps —
  if it's missing from PATH, that day's refresh fails cleanly (logged, no crash) and the site
  keeps serving the last cached image/video until ffmpeg is installed or a new day rolls over.
  Embedded videos (YouTube/Vimeo) aren't self-hosted or transcoded — those days fall back to
  the archive scraper's most recent still image instead.

- SELinux: if nginx returns 502 unexpectedly, check ausearch -m avc -ts recent.
  Most issues are fixed by httpd_can_network_connect (already set in Step 8).

- If the repo was cloned to a path other than ~/dlgiovani.github.io, adjust all paths
  in Steps 5–9 and in the systemd unit accordingly.
