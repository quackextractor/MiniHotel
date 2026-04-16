# Technická dokumentace MiniHotel

## Přehled systému

MiniHotel je komplexní systém pro správu hotelových operací postavený jako monorepo obsahující moderní webové rozhraní (frontend) a RESTful API server (backend). Systém pokrývá kompletní lifecycle hotelového provozu včetně správy pokojů, hostů, rezervací, housekeepingu, údržby a reportingu.

**Hlavní funkce:**
- Správa pokojů a pokojových skupin s podporou sezónních sazeb
- Evidence hostů s historií rezervací
- Rezervační systém s automatickou detekcí konfliktů a výpočtem ceny
- Housekeeping a údržbová agenda
- Přídavné služby a spotřeba
- Reporty obsazenosti, příjmů a denních operací
- Vícejazyčné rozhraní (čeština, angličtina, němčina)
- Správa směnných kurzů pro mezinárodní platby
- Kalendář akcí a událostí

## Architektura

Projekt využívá monorepo strukturu s oddělením frontend a backend vrstvy:

```
MiniHotel/
├── frontend/          # Next.js aplikace (UI/UX)
├── backend/           # Flask REST API (business logika)
└── README.md          # Dokumentace projektu
```

**Komunikace:**
- Frontend volá backend přes HTTP na `/api/*` endpointy
- Backend poskytuje RESTful API dokumentované přes Swagger UI
- Autentizace pomocí JWT tokenů v HTTP hlavičkách

## Technologie

### Backend
- **Python 3.x** - runtime
- **Flask 3.0.0** - web framework
- **SQLAlchemy 3.1.1** - ORM pro databázovou vrstvu
- **Marshmallow 3.20.1** - serializace a validace dat
- **marshmallow-sqlalchemy 0.29.0** - integrace Marshmallow + SQLAlchemy
- **PyJWT 2.8.0** - JWT autentizace
- **Flask-CORS 4.0.0** - podpora Cross-Origin Resource Sharing
- **Flask-Limiter 3.5.0** - rate limiting API requestů
- **Flasgger 0.9.7.1** - automatická Swagger dokumentace
- **bcrypt 4.1.2** - hashování hesel

### Frontend
- **Next.js 16.1.1** - React framework s App Router
- **React 19.2.0** - UI knihovna
- **TypeScript 5.x** - typování
- **Tailwind CSS 4.1.9** - utility-first CSS framework
- **next-intl 4.7.0** - internacionalizace
- **Radix UI** - headless UI komponenty
- **React Hook Form 7.71.2** - správa formulářů
- **Zod 3.25.76** - validace schémat
- **Recharts** - grafy a vizualizace dat
- **date-fns 4.1.0** - manipulace s datumy

## Struktura repozitáře

### Backend (`/backend`)
```
backend/
├── __init__.py              # Factory funkce create_app()
├── app.py                   # Flask aplikace, error handlers
├── main.py                  # Vstupní bod, venv setup, Swagger config
├── database.py              # SQLAlchemy modely
├── schemas.py               # Marshmallow schémata
├── extensions.py            # Flask rozšíření (limiter)
├── utils.py                 # Utility funkce (token_required dekorátor)
├── importer.py              # Import vzorových dat
├── requirements.txt         # Python závislosti
├── routes/                  # API blueprints
│   ├── auth_routes.py       # Autentizace (login, register)
│   ├── room_routes.py       # Správa pokojů
│   ├── guest_routes.py      # Správa hostů
│   ├── booking_routes.py    # Rezervace
│   ├── service_routes.py    # Přídavné služby
│   ├── operations_routes.py # Housekeeping, údržba
│   ├── report_routes.py     # Reporty
│   ├── exchange_routes.py   # Směnné kurzy
│   └── event_routes.py      # Události/akce
└── services/                # Business logika
```

### Frontend (`/frontend`)
```
frontend/
├── app/                     # Next.js App Router stránky
├── components/              # React komponenty
├── contexts/                # React kontext (AuthContext, SettingsContext)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility funkce
│   ├── api.ts              # API wrapper, fetch helper
│   └── utils.ts            # Helpers
├── i18n/                    # Internacionalizace
│   ├── config.ts           # Konfigurace jazyků
│   ├── routing.ts          # Locale routing
│   └── request.ts          # Server-side i18n
├── messages/                # Překladové klíče (en.json, cs.json, de.json)
├── middleware.ts            # Next.js middleware (locale routing)
├── manual/                  # Uživatelský manuál
│   └── manual-CZ.html      # Český manuál
├── package.json             # NPM závislosti
├── next.config.mjs          # Next.js konfigurace
└── tsconfig.json            # TypeScript konfigurace
```

## Datový model

Backend používá SQLite databázi s těmito hlavními entitami:

### Pokoje a organizace
- **RoomGroup** - hierarchické skupiny pokojů (např. patro, křídlo)
- **Room** - jednotlivé pokoje s číslem, typem, kapacitou, základní sazbou
- **SeasonalRate** - sezónní sazby s násobitelem ceny pro období/typ pokoje

### Hosté a rezervace
- **Guest** - hosté (jméno, email, telefon, adresa)
- **Booking** - rezervace s vazbou na pokoj a hosta, check-in/out, status, platba
- **Service** - katalog přídavných služeb (název, cena)
- **BookingService** - vazební tabulka služeb k rezervacím (M:N)

### Operace
- **Housekeeping** - stav úklidu pokojů (clean, dirty, inspection_needed atd.)
- **Maintenance** - údržbové tikety (ticket_id, oblast, priorita, status)
- **Contact** - kontakty na personál (role, jméno, on-call)

### Systém
- **User** - uživatelé systému (username, password_hash)
- **AuditLog** - audit log akcí (user_id, action, timestamp, IP)
- **ExchangeRate** - směnné kurzy měn (currency_code, rate, last_updated)
- **Event** - kalendář událostí/akcí (název, datum, prostor, očekávaný počet hostů)

**Vztahy:**
- Booking → Guest (N:1)
- Booking → Room (N:1)
- Booking ↔ Service (M:N přes BookingService)
- Room → RoomGroup (N:1)
- RoomGroup → RoomGroup parent (hierarchie)
- Housekeeping → Room (N:1)

## API přehled

Backend poskytuje RESTful API na `http://localhost:5000/api`.

### Dokumentace
Interaktivní Swagger UI: `http://localhost:5000/docs`

### Endpointy (blueprints)

| Blueprint | Prefix | Funkce |
|-----------|--------|--------|
| auth | `/api/auth` | Login, registrace, token refresh |
| room | `/api/rooms` | CRUD pokojů, room groups, seasonal rates |
| guest | `/api/guests` | CRUD hostů, vyhledávání |
| booking | `/api/bookings` | CRUD rezervací, výpočet ceny, kalendář |
| service | `/api/services` | CRUD služeb, přiřazení k rezervacím |
| operations | `/api/housekeeping`, `/api/maintenance` | Housekeeping, údržba |
| report | `/api/reports` | Reporty obsazenosti, příjmů |
| exchange | `/api/exchange-rates` | Správa směnných kurzů |
| event | `/api/events` | CRUD událostí |

### Společné HTTP metody
- `GET` - čtení záznamů (list, detail)
- `POST` - vytvoření nového záznamu
- `PUT` - aktualizace existujícího záznamu
- `PATCH` - částečná aktualizace (např. pouze status)
- `DELETE` - smazání záznamu

### Utility endpointy
- `GET /api/health` - health check
- `POST /api/import-data` - import vzorových dat (vyžaduje auth)

## Autentizace a bezpečnost

### Autentizační flow
1. Uživatel odešle `POST /api/auth/login` s `username` a `password`
2. Backend ověří heslo (bcrypt), vytvoří JWT token
3. Frontend uloží token do localStorage
4. Všechny další requesty obsahují token v hlavičce `Authorization: Bearer <token>`
5. Backend middleware `@token_required` validuje token
6. Při 401 Unauthorized frontend automaticky odhlásí uživatele a redirectuje na login

### JWT token
- Payload obsahuje: `user_id`, `username`, `exp` (expirace)
- Podepsáno pomocí `SECRET_KEY` (z env nebo dočasně generováno v dev módu)

### SECRET_KEY konfigurace
- **Produkce:** Musí být nastaven v `.env` souboru, jinak aplikace selže
- **Development:** Pokud není nastaven, automaticky se vygeneruje dočasný klíč (session nepřetrvá restart)

```python
# V __init__.py:
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

if not app.config['SECRET_KEY']:
    if os.getenv('FLASK_ENV') == 'production':
        raise RuntimeError("SECRET_KEY must be set in production!")
    else:
        print("WARNING: Using generated secret key...")
        app.config['SECRET_KEY'] = secrets.token_hex(32)
```

### Rate limiting
Flask-Limiter omezuje počet requestů z jedné IP adresy.

### CORS
Flask-CORS povoluje cross-origin requesty z frontendu (důležité pro dev režim s oddělenými porty).

### Audit log
Tabulka `AuditLog` loguje všechny důležité akce (user_id, action, timestamp, IP).

## Lokalizace

### Backend
Backend neobsahuje internacionalizaci, API vrací data v neutrálním formátu (JSON), lokalizace je čistě na frontendu.

### Frontend (next-intl)

**Podporované jazyky:**
- `en` - angličtina
- `cs` - čeština
- `de` - němčina

**Architektura:**
- `middleware.ts` aplikuje locale routing (automatická detekce/redirect)
- Překladové klíče v `/messages/{locale}.json`
- `next-intl` poskytuje hook `useTranslations(namespace)` v komponentách
- Dynamické locale se načítá ze serverové konfigurace (`i18n/config.ts`)

**Routing:**
- Cesty jsou prefixovány locale: `/en/dashboard`, `/cs/dashboard`, `/de/dashboard`
- Matcher v middleware vyjímá `/api`, `/_next`, `/_vercel` a statické soubory

**Příklad použití:**
```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('Dashboard');
  return <h1>{t('title')}</h1>;
}
```

**Validace:**
- Build proces obsahuje `npm run lint:i18n` (kontrola konzistence klíčů)
- Skript `verify_i18n.js` zajišťuje, že všechny jazyky mají stejné klíče

## Spuštění lokálně

### Backend

```bash
# Navigace do backend složky
cd backend

# Spuštění (automaticky vytvoří .venv a nainstaluje dependencies)
python main.py

# Pokud chcete použít globální Python packages (nedoporučeno):
python main.py --use-global
```

**Výsledek:**
- API server běží na `http://localhost:5000/api`
- Swagger UI na `http://localhost:5000/docs`
- Databáze SQLite `minihotel.db` se vytvoří automaticky při prvním spuštění
- Virtual environment `.venv` se vytvoří automaticky (Python venv)

**První přihlášení:**
Po startu backend automaticky vytvoří databázové tabulky. Pro vytvoření testovacího uživatele použijte:
```bash
python create_test_user.py  # pokud skript existuje
```

### Frontend

```bash
# Navigace do frontend složky
cd frontend

# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev
```

**Výsledek:**
- Frontend běží na `http://localhost:3000`
- Hot reload pro vývoj
- API requesty směřují na `/api` (proxy nebo absolutní URL podle konfigurace)

**Poznámka:** Pro funkční propojení musí běžet oba servery současně (backend na :5000, frontend na :3000).

## Build, test, lint

### Backend

**Build:**
Backend je interpretovaný Python, build krok není potřeba.

**Lint:**
Projekt neobsahuje předkonfigurovaný Python linter (flake8, pylint). Lze doplnit.

**Test:**
V repozitáři existují testovací skripty:
- `testing.py` - pravděpodobně unit testy
- `test_500.py` - test error handlerů
- `verify_*.py` - verifikační skripty pro databázi

Žádný standardní test runner (pytest) není v requirements.txt.

### Frontend

**Build:**
```bash
cd frontend
npm run build
```
- Spustí `lint:i18n` (validace překladů)
- Následně `next build` (produkční build)
- Výstup v `.next/` složce

**Lint:**
```bash
npm run lint
```
- ESLint kontrola kódu
- + `lint:i18n` kontrola konzistence překladových klíčů

**Test:**
Projekt neobsahuje automatizované testy (Jest, Vitest). Testovací strategie je popsána v `testing.md`.

**Start produkčního buildu:**
```bash
npm run start  # spustí Next.js production server
```

## Provozní poznámky

### Databáze
- **Výchozí:** SQLite databáze `sqlite:///minihotel.db` (relativní cesta v backend složce)
- **Konfigurace:** Lze změnit pomocí environment proměnné `DATABASE_URL`
- **Migrace:** Projekt nepoužívá Alembic/Flask-Migrate, databáze se vytváří přes `db.create_all()` při startu
- **Omezení:** SQLite není vhodná pro vysoký paralelní přístup, pro produkci doporučeno PostgreSQL

### Environment proměnné (backend)
```bash
DATABASE_URL=sqlite:///minihotel.db  # nebo postgresql://...
SECRET_KEY=<silny-tajny-klic-64-znaku>  # POVINNÉ v produkci
FLASK_ENV=production  # produkční režim
```

**Vytvoření .env souboru:**
```bash
cd backend
cp .env.example .env
# editujte .env a nastavte SECRET_KEY
```

### Produkční nasazení

**Backend:**
- Nepoužívat `app.run(debug=True)` v produkci
- Nasadit přes WSGI server (Gunicorn, uWSGI):
  ```bash
  pip install gunicorn
  gunicorn -w 4 -b 0.0.0.0:5000 app:app
  ```
- Nastavit `FLASK_ENV=production`
- Použít PostgreSQL místo SQLite
- Reverse proxy (nginx) před aplikací

**Frontend:**
- Build produkční verze: `npm run build`
- Nasadit na Vercel (doporučeno pro Next.js) nebo vlastní Node.js server
- Nastavit `NEXT_PUBLIC_API_URL` pro backend API endpoint

### Import vzorových dat
```bash
# Přes CLI (v backend složce):
flask import-data

# Nebo přes API (vyžaduje autentizaci):
POST /api/import-data
```

### Uživatelský manuál
Český manuál pro koncové uživatele je dostupný v `frontend/manual/manual-CZ.html`.

### Známá omezení
- Chybí automatizované testy (backend i frontend)
- Není implementována databázová migrace (Alembic)
- SQLite není škálovatelná pro produkci
- Chybí Python linter konfigurace
- Rate limiting konfigurace není dokumentována
- Email notifikace nejsou implementovány
- Platební brána není integrována (pouze manuální označení plateb)

### Changelog a verze
- `CHANGELOG.md` - historie změn projektu
- `VERSION.txt` - aktuální verze (root i v submodulech)

---

**Kontakt a licence:**
Projekt je licencován pod MIT licencí. Vytvořeno jako technický projekt pro studentskou výstavu v Praze.
