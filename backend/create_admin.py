"""Create (or promote) an admin account.

Usage:
    python create_admin.py <email> <name>

The password is prompted for and never echoed. Self-registration via
/auth/register only creates students, so use this to bootstrap the first admin.
Run `alembic upgrade head` first so the tables exist.
"""
import getpass
import sys

import crud
import schemas
from database import SessionLocal


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    email, name = sys.argv[1], sys.argv[2]

    db = SessionLocal()
    try:
        existing = crud.get_user_by_email(db, email=email)
        if existing:
            existing.role = "admin"
            db.commit()
            print(f"Promoted existing user {email} to admin.")
            return

        password = getpass.getpass("Password: ")
        if len(password) < 8 or password != getpass.getpass("Confirm password: "):
            print("Passwords must match and be at least 8 characters.")
            sys.exit(1)

        crud.create_user(db, schemas.UserCreate(
            name=name, email=email, password=password, role="admin", department="Administration",
        ))
        print(f"Created admin {email}.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
