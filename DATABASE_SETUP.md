# PostgreSQL Database Setup with Docker

## Prerequisites
- Docker and Docker Compose installed on your system

## Quick Start

### 1. Start PostgreSQL container
```bash
docker-compose up -d
```

This will:
- Download PostgreSQL 15 Alpine image (if not already downloaded)
- Start a PostgreSQL container named `class-notify-db`
- Expose PostgreSQL on port 5432
- Create a database named `university`
- Set up credentials (user: `postgres`, password: `password`)

### 2. Verify the container is running
```bash
docker-compose ps
```

You should see the `class-notify-db` container with status "Up".

### 3. Check logs (if needed)
```bash
docker-compose logs postgres
```

## Database Connection

Your backend is already configured to connect to this database using the connection string in `backend/.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5436/university
```

## Database Migrations

Database schema is managed using Alembic migrations. After starting PostgreSQL:

1. **Apply all migrations** (creates tables):
```bash
cd backend
source venv/bin/activate
alembic upgrade head
```

2. **Check current migration status**:
```bash
alembic current
```

For more details on creating and managing migrations, see [`backend/MIGRATIONS.md`](backend/MIGRATIONS.md)

## Useful Commands

### Stop the database
```bash
docker-compose stop
```

### Start the database (after stopping)
```bash
docker-compose start
```

### Stop and remove containers
```bash
docker-compose down
```

### Stop and remove containers + volumes (deletes all data)
```bash
docker-compose down -v
```

### Access PostgreSQL CLI
```bash
docker exec -it class-notify-db psql -U postgres -d university
```

### View real-time logs
```bash
docker-compose logs -f postgres
```

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This means your data persists even if you stop or restart the container. To completely remove the data, use `docker-compose down -v`.

## Troubleshooting

### Port 5432 already in use
If you have another PostgreSQL instance running locally:
1. Stop your local PostgreSQL: `sudo systemctl stop postgresql`
2. Or change the port in `docker-compose.yml`: `"5433:5432"` and update `backend/.env` to use port 5433

### Connection refused
- Make sure the container is running: `docker-compose ps`
- Check container logs: `docker-compose logs postgres`
- Wait for healthcheck to pass (may take a few seconds on first start)
