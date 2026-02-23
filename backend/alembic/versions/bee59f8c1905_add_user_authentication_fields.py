"""add_user_authentication_fields

Revision ID: bee59f8c1905
Revises: 449e510db4f9
Create Date: 2026-02-24 00:07:42.773149

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bee59f8c1905'
down_revision: Union[str, None] = '449e510db4f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))
    op.add_column('users', sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'hashed_password')
