"""add subject_id to assignments and lectures

Replaces matching on the free-text `subject` column with a real foreign key,
so ownership checks can't match the wrong subject when names collide.
Existing rows are backfilled by subject code, then by name when exactly one
subject has that name. Ambiguous or unknown rows are left NULL (only admins
can then modify them until an admin re-saves them with a subject_id).

Revision ID: 7c2e91d4a6b3
Revises: 0424914f3289
Create Date: 2026-11-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '7c2e91d4a6b3'
down_revision: Union[str, None] = '0424914f3289'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLES = ("assignments", "lectures")


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    for table in TABLES:
        if "subject_id" in {c["name"] for c in inspector.get_columns(table)}:
            continue
        with op.batch_alter_table(table) as batch:
            batch.add_column(sa.Column("subject_id", sa.String(), nullable=True))
            batch.create_foreign_key(f"fk_{table}_subject_id_subjects", "subjects", ["subject_id"], ["id"])
            batch.create_index(f"ix_{table}_subject_id", ["subject_id"])

        # Backfill: exact code match first (codes are unique)...
        op.execute(f"""
            UPDATE {table} SET subject_id = (
                SELECT s.id FROM subjects s WHERE s.code = {table}.subject
            )
            WHERE subject_id IS NULL
        """)
        # ...then name match, only when the name is unambiguous.
        op.execute(f"""
            UPDATE {table} SET subject_id = (
                SELECT s.id FROM subjects s WHERE s.name = {table}.subject
            )
            WHERE subject_id IS NULL
              AND (SELECT COUNT(*) FROM subjects s WHERE s.name = {table}.subject) = 1
        """)


def downgrade() -> None:
    for table in TABLES:
        with op.batch_alter_table(table) as batch:
            batch.drop_index(f"ix_{table}_subject_id")
            batch.drop_constraint(f"fk_{table}_subject_id_subjects", type_="foreignkey")
            batch.drop_column("subject_id")
