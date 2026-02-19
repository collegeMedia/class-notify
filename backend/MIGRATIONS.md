# Database Migrations Guide

## Overview

This project uses Alembic for database migrations. Alembic helps you manage database schema changes in a version-controlled way.

## Setup Status

✅ Alembic is configured and ready to use
✅ Initial migration has been created and applied
✅ All tables are created in PostgreSQL database

## Database Tables Created

- `users` - User accounts (students, professors)
- `announcements` - Class announcements
- `assignments` - Homework and assignments
- `lectures` - Scheduled lectures
- `subjects` - Academic subjects/courses
- `chat_groups` - Group chats for subjects
- `messages` - Chat messages
- `alembic_version` - Migration version tracking (managed by Alembic)

## Common Commands

All commands should be run from the `backend` directory with the virtual environment activated:

```bash
cd backend
source venv/bin/activate
```

### Check Current Migration Version
```bash
alembic current
```

### View Migration History
```bash
alembic history
```

### Create a New Migration (Auto-generate)

When you modify your models in `models.py`, create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
```

Example:
```bash
alembic revision --autogenerate -m "Add email_verified field to users"
```

### Apply All Pending Migrations
```bash
alembic upgrade head
```

### Rollback Last Migration
```bash
alembic downgrade -1
```

### Rollback to Specific Version
```bash
alembic downgrade <revision_id>
```

### Rollback All Migrations
```bash
alembic downgrade base
```

### View SQL Without Applying
```bash
alembic upgrade head --sql
```

## Workflow for Schema Changes

1. **Modify your models** in `backend/models.py`
   ```python
   # Example: Add a new field
   class User(Base):
       # ... existing fields ...
       email_verified = Column(Boolean, default=False)
   ```

2. **Generate migration**
   ```bash
   cd backend
   source venv/bin/activate
   alembic revision --autogenerate -m "Add email_verified to users"
   ```

3. **Review the generated migration file** in `backend/alembic/versions/`
   - Check that it matches your intended changes
   - Edit if necessary (Alembic can't detect everything automatically)

4. **Apply the migration**
   ```bash
   alembic upgrade head
   ```

5. **Verify in database**
   ```bash
   docker exec class-notify-db psql -U postgres -d university -c "\d users"
   ```

## What Alembic Can Auto-Detect

✅ Table additions and removals
✅ Column additions and removals
✅ Column type changes
✅ Index changes
✅ Foreign key changes

## What Alembic Cannot Auto-Detect

❌ Table name changes (appears as drop + create)
❌ Column name changes (appears as drop + create)
❌ Data migrations (INSERT, UPDATE, DELETE)

For these cases, you'll need to manually edit the migration file.

## Manual Migration Example

If you need to rename a column (to preserve data):

```bash
# Generate empty migration
alembic revision -m "Rename column"
```

Edit the generated file:
```python
def upgrade():
    op.alter_column('users', 'old_name', new_column_name='new_name')

def downgrade():
    op.alter_column('users', 'new_name', new_column_name='old_name')
```

## Troubleshooting

### Migration shows no changes
- Make sure you imported the model in `models.py`
- Ensure the model inherits from `Base`
- Check that `database.py` creates the Base correctly

### Database connection error
- Verify PostgreSQL is running: `docker-compose ps`
- Check `.env` file has correct `DATABASE_URL`
- Test connection: `docker exec class-notify-db psql -U postgres -d university -c "SELECT 1;"`

### Migration conflicts
If you get conflicts (multiple heads):
```bash
alembic merge heads -m "Merge migrations"
alembic upgrade head
```

### Reset database (development only)
```bash
# WARNING: This will delete all data
alembic downgrade base
alembic upgrade head
```

Or completely reset:
```bash
docker-compose down -v  # Deletes all data
docker-compose up -d
alembic upgrade head
```

## Best Practices

1. **Always review auto-generated migrations** before applying them
2. **Test migrations on development database first**
3. **Include rollback (`downgrade`) logic** in manual migrations
4. **Use descriptive migration messages**
5. **Commit migration files to version control**
6. **Never edit applied migrations** - create a new one instead
7. **Keep migrations small and focused** on one change at a time

## Migration Files Location

Migration files are stored in:
```
backend/alembic/versions/
```

Each file is named: `<revision_id>_<description>.py`

## Configuration Files

- `backend/alembic.ini` - Alembic configuration
- `backend/alembic/env.py` - Migration environment setup
- `backend/.env` - Database connection URL

## Current Migration Status

Current version: `1fb8a8040ca5` (Initial migration)

To check status anytime:
```bash
cd backend && source venv/bin/activate && alembic current
```
