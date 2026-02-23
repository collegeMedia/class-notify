"""add_department_model

Revision ID: 449e510db4f9
Revises: 1fb8a8040ca5
Create Date: 2026-02-23 23:24:07.706815

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '449e510db4f9'
down_revision: Union[str, None] = '1fb8a8040ca5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'departments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('code', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_departments_code'), 'departments', ['code'], unique=True)
    op.create_index(op.f('ix_departments_name'), 'departments', ['name'], unique=True)
    
    op.add_column('users', sa.Column('department_id', sa.String(), nullable=True))
    op.create_foreign_key('fk_users_department_id', 'users', 'departments', ['department_id'], ['id'])
    
    op.add_column('announcements', sa.Column('department_id', sa.String(), nullable=True))
    op.create_foreign_key('fk_announcements_department_id', 'announcements', 'departments', ['department_id'], ['id'])
    
    op.add_column('assignments', sa.Column('department_id', sa.String(), nullable=True))
    op.create_foreign_key('fk_assignments_department_id', 'assignments', 'departments', ['department_id'], ['id'])
    
    op.add_column('lectures', sa.Column('department_id', sa.String(), nullable=True))
    op.create_foreign_key('fk_lectures_department_id', 'lectures', 'departments', ['department_id'], ['id'])
    
    op.add_column('subjects', sa.Column('department_id', sa.String(), nullable=True))
    op.create_foreign_key('fk_subjects_department_id', 'subjects', 'departments', ['department_id'], ['id'])


def downgrade() -> None:
    op.drop_constraint('fk_subjects_department_id', 'subjects', type_='foreignkey')
    op.drop_column('subjects', 'department_id')
    
    op.drop_constraint('fk_lectures_department_id', 'lectures', type_='foreignkey')
    op.drop_column('lectures', 'department_id')
    
    op.drop_constraint('fk_assignments_department_id', 'assignments', type_='foreignkey')
    op.drop_column('assignments', 'department_id')
    
    op.drop_constraint('fk_announcements_department_id', 'announcements', type_='foreignkey')
    op.drop_column('announcements', 'department_id')
    
    op.drop_constraint('fk_users_department_id', 'users', type_='foreignkey')
    op.drop_column('users', 'department_id')
    
    op.drop_index(op.f('ix_departments_name'), table_name='departments')
    op.drop_index(op.f('ix_departments_code'), table_name='departments')
    op.drop_table('departments')
